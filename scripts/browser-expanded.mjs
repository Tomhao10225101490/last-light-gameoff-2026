// Expanded-world normal-input navigation. Browser mutations are ONLY mouse/key
// input, navigation/reload and screenshots. Physics planning runs outside Chrome.
import {spawn} from 'node:child_process';import {mkdir,readFile,writeFile,readdir} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {buildSector} from '../dist/world.js';import {stepPlayer,updateMovingPlatforms} from '../dist/core.js';import {doorColliders} from '../dist/doors.js';import {CollisionIndex} from '../dist/spatial.js';
import {createGhost,updateGhost} from '../dist/enemies.js';
const complete=process.env.ENDING==='complete',limit=Number(process.env.MAX_SECTORS||18),out=process.env.EVIDENCE_DIR||`docs/evidence/expanded/${complete?'complete':'normal'}-${limit}`;
await mkdir(out,{recursive:true});const audit=JSON.parse(await readFile('docs/evidence/expanded/space-audit.json','utf8'));
const hashes={};for(const name of await readdir('dist'))hashes[name]=createHash('sha256').update(await readFile(`dist/${name}`)).digest('hex');
const port=Number(process.env.PORT||8793),debug=Number(process.env.DEBUG_PORT||9233),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const server=spawn('python3',['-m','http.server',String(port),'-d','dist'],{stdio:'ignore'});
const profile=process.env.CHROME_PROFILE||`/tmp/last-light-expanded-${process.pid}`;
const chrome=spawn(process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--disable-gpu','--autoplay-policy=no-user-gesture-required',`--remote-debugging-port=${debug}`,`--user-data-dir=${profile}`,'--window-size=1280,1100',`http://127.0.0.1:${port}`],{stdio:'ignore'});
let ws,id=0,error,passed=false;const wait=new Map(),keys=new Set(),actions=[],log=[],errors=[],shots=new Set();
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id,timer=setTimeout(()=>{wait.delete(n);reject(Error(`CDP timeout ${method}`));},7000);wait.set(n,{resolve,reject,timer});ws.send(JSON.stringify({id:n,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const key=async(code,on)=>{if(keys.has(code)===on)return;if(on)keys.add(code);else keys.delete(code);actions.push({ms:Date.now(),code,on});await send('Input.dispatchKeyEvent',{type:on?'keyDown':'keyUp',code,key:code==='Space'?' ':code});};
const tap=async code=>{await key(code,true);await sleep(13);await key(code,false);};
const stop=async()=>{for(const k of [...keys])await key(k,false);};
const click=async(selector='#start')=>{const p=await evaluate(`(()=>{let e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});let r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',clickCount:1});};
const screenshot=async name=>{if(shots.has(name))return;shots.add(name);const s=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(`${out}/${name}.png`,Buffer.from(s.data,'base64'));};
const adjacency=new WeakMap(),distanceCache=new WeakMap();
function adjacencyFor(edges){if(!adjacency.has(edges)){const m=new Map();for(const e of edges){if(!m.has(e.from))m.set(e.from,[]);m.get(e.from).push(e);}adjacency.set(edges,m);}return adjacency.get(edges);}
function distances(edges,goal){let cache=distanceCache.get(edges);if(!cache){cache=new Map();distanceCache.set(edges,cache);}if(cache.has(goal))return cache.get(goal);const reverse=new Map();for(const e of edges){if(!reverse.has(e.to))reverse.set(e.to,new Set());reverse.get(e.to).add(e.from);}const dist=new Map([[goal,0]]),q=[goal];for(let i=0;i<q.length;i++)for(const from of reverse.get(q[i])||[])if(!dist.has(from)){dist.set(from,dist.get(q[i])+1);q.push(from);}cache.set(goal,dist);return dist;}
function shortest(edges,start,goal){if(start===goal)return [];const queue=[start],prior=new Map([[start,null]]),incoming=new Map();for(let i=0;i<queue.length;i++){for(const e of adjacencyFor(edges).get(queue[i])||[])if(!prior.has(e.to)){prior.set(e.to,e.from);incoming.set(e.to,e);queue.push(e.to);if(e.to===goal){const path=[];let x=goal;while(prior.get(x)!=null){path.unshift(incoming.get(x));x=prior.get(x);}return path;}}}return null;}
function predicts(s,data,target,dir,jump,desiredNight,walk=false){
 const p={...s.player},night=s.phase==='night';const platforms=data.platforms.map(q=>({...q,motion:q.motion?{...q.motion}:undefined}));const index=new CollisionIndex(platforms);let airborne=false;
 const ghosts=data.ghosts.map((config,i)=>{const actual=s.ghosts.find(g=>g.id===config.id),g=createGhost(config,i);if(actual)Object.assign(g,actual,{xNow:actual.x,yNow:actual.y,prevX:actual.x,prevY:actual.y});return g;});
 for(let t=0;t<300;t++){
  updateMovingPlatforms(platforms,s.time+t/120,1/120);if(t===0)for(const q of platforms)q.dx=q.dy=0;
  stepPlayer(p,{left:dir<0,right:dir>0,jump:jump&&t===0,walk},index.query(p.x-40,p.y-20,p.x+60,p.y+65),t>10?desiredNight:night,1/120,{width:data.width,solids:[...data.walls,...doorColliders(s.doors)]});
  const predictionWorld={player:p,night:t>10?desiredNight:night,events:s.events,checkpoints:data.checkpoints,walls:data.walls};
  if(ghosts.some(g=>updateGhost(g,predictionWorld,1/120,walk?.1:.7)))return false;
  if(!p.grounded)airborne=true;if(p.grounded&&p.supportId!==s.player.supportId)return p.supportId===target;if(jump&&airborne&&p.grounded||p.y>1740)return false;
 }
 return false;
}
try{
 let tabs;for(let i=0;i<50;i++){try{tabs=await(await fetch(`http://127.0.0.1:${debug}/json`)).json();if(tabs.some(t=>t.type==='page'))break;}catch{}await sleep(100);}
 ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});ws.onmessage=e=>{const m=JSON.parse(e.data),w=wait.get(m.id);if(w){clearTimeout(w.timer);wait.delete(m.id);m.error?w.reject(Error(JSON.stringify(m.error))):w.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);};
 await send('Runtime.enable');await send('Page.enable');
 for(let n=0;n<40;n++){try{if((await fetch(`http://127.0.0.1:${port}/`)).ok)break;}catch{}await sleep(100);}
 await send('Page.navigate',{url:`http://127.0.0.1:${port}/`});await sleep(200);let ready=false;for(let n=0;n<90;n++){if(n===25||n===55){log.push({event:'startup-reload',retry:n});await send('Page.reload');await sleep(250);}ready=await evaluate("document.readyState==='complete'&&typeof window.lastLight?.snapshot==='function'&&!!document.getElementById('start')");if(ready)break;await sleep(100);}if(!ready){log.push({event:'startup-diagnostic',page:await evaluate("({url:location.href,ready:document.readyState,title:document.title,body:document.body?.textContent?.slice(0,180)})")});throw Error('Game module readiness timed out');}await click();await sleep(100);
 let room='',data,graph,action=null,lastDeath=0,lastScene='',lastAdvance=0,completed=0,lastProgress=Date.now(),lastSupport='',stuck=0,goalWatch=null,navigation=null;
 const deadline=Date.now()+Number(process.env.PLAYTEST_MS||900000);
 while(Date.now()<deadline){
  const s=await evaluate('window.lastLight.snapshot()');
  if(s.mode==='won'){log.push({event:'ending',snapshot:s});await screenshot('ending');if(complete&&s.ending!=='complete')throw Error('Full evidence run did not reach complete ending');passed=true;console.log(`${s.ending} ending reached`);break;}
  if(s.mode==='between'){await stop();log.push({event:'chapter-complete',snapshot:s});await click();await sleep(300);room='';continue;}
  if(s.mode!=='playing')throw Error(`Unexpected mode ${s.mode}`);
  if(s.worldRevision!==2)throw Error('Expected expanded world, not retained-map save');
  const current=`${s.floor}/${s.sector}`;
  if(current!==room){if(room){completed++;if(completed>=limit){passed=true;log.push({event:'bounded-section-goal',completed,snapshot:s});break;}}room=current;data=buildSector(s.floor,s.sector,s.mechanisms);graph=audit.chapters[s.floor].sectors[s.sector];action=null;lastSupport='';lastProgress=Date.now();console.log('Section',room,graph.id);log.push({event:'section',snapshot:s});}
  if(s.deaths>lastDeath){lastDeath=s.deaths;log.push({event:'death',snapshot:s});console.log(`Death ${lastDeath}/3`,s.player.x,s.player.y);if(lastDeath>=3)throw Error('Stopped after three deaths');await stop();action=null;goalWatch=null;await sleep(1750);continue;}
  if(s.scene){await stop();action=null;const sceneKey=`${s.scene.id}/${s.scene.beat}`;if(sceneKey!==lastScene){lastScene=sceneKey;log.push({event:'scene',snapshot:s});await screenshot(`scene-${s.floor}-${s.sector}-${s.scene.id}-${s.scene.beat}`);}if(s.scene.time>1.1&&Date.now()-lastAdvance>500){await tap('KeyE');lastAdvance=Date.now();}lastProgress=Date.now();await sleep(60);continue;}
  if(!['alive','hurt'].includes(s.player.lifeState)){await stop();action=null;await sleep(30);lastProgress=Date.now();continue;}
  const p=s.player;if(p.supportId!==lastSupport){lastProgress=Date.now();lastSupport=p.supportId;stuck=0;}
  if(Date.now()-lastProgress>11000)throw Error(`No route progress for 11 seconds at ${room} / ${p.supportId}`);
  if(s.station.done&&!data.done){data=buildSector(s.floor,s.sector,s.mechanisms);graph={...graph,...graph.afterWork};}
  if(s.camera.y>650)await screenshot(`vertical-${s.floor}-${s.sector}`);
  const travel=action?.dir||(keys.has('ArrowRight')?1:keys.has('ArrowLeft')?-1:p.dir);
  const closeGhost=p.grounded&&s.ghosts.find(g=>g.spawned&&(g.phase==null||g.phase===s.phase)&&(g.x-(p.x+7))*travel>0&&Math.abs(g.x-p.x-7)<42&&Math.abs(g.y-p.y-14)<48);
  if(closeGhost&&(!action||!action.emergency)){await key('Space',false);await key('KeyC',false);await key('ArrowLeft',travel<0);await key('ArrowRight',travel>0);await key('Space',true);action={from:p.supportId,to:null,dir:travel,emergency:true,started:Date.now(),night:s.phase==='night',shiftAt:0};log.push({event:'ghost-evasion',room,x:p.x,ghost:closeGhost.id});await sleep(25);continue;}
  if(action){
   if(action.emergency&&p.grounded&&Date.now()-action.started>430){await stop();action=null;continue;}
   if(action.shiftAt&&Date.now()>=action.shiftAt){if((s.phase==='night')!==action.night)await tap('KeyX');action.shiftAt=0;}
   if(keys.has('Space')&&(p.vy>-65||Date.now()-action.started>460))await key('Space',false);
   if(p.grounded&&p.supportId!==action.from){log.push({event:'landing',room,to:p.supportId,expected:action.to,x:p.x,y:p.y});await stop();action=null;continue;}
   if(Date.now()-action.started>2700){await stop();action=null;stuck++;if(stuck>2)throw Error('Three failed controller launches at one support');continue;}
   await sleep(25);continue;
  }
  const evidence=complete?data.evidence.find(e=>!s.evidence.includes(e.id)):null;
  const light=complete&&s.floor===2&&s.sector===5&&s.station.done&&!s.events.includes('emergency-light');
  const goal=evidence||(!s.station.done?s.station:light?{x:data.exit.x-100+7,y:data.exit.y+14,light:true}:{x:data.exit.x+7,y:data.exit.y+14,exit:true});
  const goalPlatform=data.platforms.find(q=>q.phase==null&&q.x<=goal.x&&q.x+q.w>=goal.x&&Math.abs(q.y-goal.y-14)<1);
  if(!goalPlatform)throw Error(`No goal support for ${JSON.stringify(goal)}`);
  const door=s.doors.find(d=>d.phase==='closed'&&!d.locked&&Math.abs(d.x-p.x)<35&&Math.abs(d.y-p.y)<65);
  if(door){await stop();await tap('KeyE');await sleep(460);continue;}
  if(p.grounded&&p.supportId===goalPlatform.id){
   await key('KeyC',false);
   if(Math.abs(p.x+7-goal.x)<(goal.exit?15:23)){await stop();await tap('KeyE');await sleep(goal.exit?180:60);continue;}
   const dir=p.x+7<goal.x?1:-1;await key('ArrowLeft',dir<0);await key('ArrowRight',dir>0);await sleep(25);continue;
  }
  if(!p.grounded){await sleep(25);continue;}
  const unsafe=new Set();for(const g of s.ghosts)if(g.spawned&&(g.phase==null||g.phase===s.phase))for(const q of [...data.platforms,...data.walls])if(q.id!==goalPlatform.id&&Math.abs(q.y-14-g.y)<45&&q.x<g.x+60&&q.x+q.w>g.x-60)unsafe.add(q.id);
  const mask=[...unsafe].sort().join('|');if(!navigation||navigation.base!==graph.edges||navigation.mask!==mask)navigation={base:graph.edges,mask,edges:graph.edges.filter(e=>!unsafe.has(e.to))};
  let navEdges=navigation.edges,support=p.supportId,path=shortest(navEdges,support,goalPlatform.id);if(!path){navEdges=graph.edges;path=shortest(navEdges,support,goalPlatform.id);}

  if(!path?.length){
   // A newly powered lift can intercept a descent. Walk off onto a recorded
   // static landing; never reposition the browser's player or mutate its state.
   if(data.platforms.find(q=>q.id===support)?.motion){await key('ArrowRight',true);await sleep(100);continue;}
   throw Error(`No graph route from ${support} to ${goalPlatform.id}`);
  }
  const goalKey=`${room}/${evidence?.id||(!s.station.done?'work':light?'light':'exit')}`,goalDistance=distances(navEdges,goalPlatform.id).get(support);
  if(!goalWatch||goalWatch.key!==goalKey)goalWatch={key:goalKey,best:Infinity,since:Date.now()};if(goalDistance<goalWatch.best){goalWatch.best=goalDistance;goalWatch.since=Date.now();}if(Date.now()-goalWatch.since>30000)throw Error(`Goal distance has not improved for 30 seconds: ${goalKey}`);
  const edge=path[0],target=data.platforms.find(q=>q.id===edge.to)||data.walls.find(q=>q.id===edge.to);if(!target)throw Error('Unknown graph target');
  const source=data.platforms.find(q=>q.id===support)||data.walls.find(q=>q.id===support);
  const want=edge.change?!edge.night:edge.night;
  if(source.phase==null&&(s.phase==='night')!==edge.night){await stop();await tap('KeyX');await sleep(270);continue;}
  const distance=distances(navEdges,goalPlatform.id),remaining=distance.get(support);
  const candidates=(adjacencyFor(navEdges).get(support)||[]).filter(e=>distance.get(e.to)===remaining-1).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x)).slice(0,16).map(edge=>({edge}));
  let chosen=null;for(const c of candidates){const e=c.edge;if(e.night!==(s.phase==='night'))continue;if(predicts(s,data,e.to,e.dir,e.jump,e.change?!e.night:e.night,e.walk)){chosen=e;break;}}
  if(chosen){const e=chosen;await key('KeyC',!!e.walk);await key('ArrowLeft',e.dir<0);await key('ArrowRight',e.dir>0);if(e.jump)await key('Space',true);action={from:support,to:e.to,dir:e.dir,started:Date.now(),night:e.change?!e.night:e.night,shiftAt:e.change?Date.now()+95:0};await sleep(25);continue;}
  await key('KeyC',!!edge.walk);
  let jump=[edge.jump,!edge.jump].find(j=>predicts(s,data,edge.to,edge.dir,j,want,edge.walk));
  if(jump!==undefined){await key('ArrowLeft',edge.dir<0);await key('ArrowRight',edge.dir>0);if(jump)await key('Space',true);action={from:support,to:edge.to,dir:edge.dir,started:Date.now(),night:want,shiftAt:(s.phase==='night')!==want?Date.now()+95:0};}
  else{
   const delta=edge.x-p.x;if(Math.abs(delta)<2&&Math.abs(p.vx)<25){const alternative=navEdges.find(e=>e.from===support&&e.to===edge.to&&predicts(s,data,e.to,e.dir,e.jump,e.change?!e.night:e.night,e.walk));if(alternative){await key('KeyC',!!alternative.walk);await key('ArrowLeft',alternative.dir<0);await key('ArrowRight',alternative.dir>0);if(alternative.jump)await key('Space',true);action={from:support,to:alternative.to,dir:alternative.dir,started:Date.now(),night:alternative.change?!alternative.night:alternative.night,shiftAt:alternative.change?Date.now()+95:0};}else{await key('ArrowLeft',edge.dir<0);await key('ArrowRight',edge.dir>0);}}
   else{await key('ArrowLeft',delta<0);await key('ArrowRight',delta>0);}
  }
  await sleep(25);
 }
 if(!passed)throw Error('Bounded timeout before requested ending/section goal');if(errors.length)throw Error('Runtime exceptions recorded');
}catch(e){error=String(e);passed=false;console.error(error);if(ws?.readyState===1){try{log.push({event:'stopped',snapshot:await evaluate('window.lastLight.snapshot()')});await screenshot('stopped');}catch{}}}
finally{if(ws?.readyState===1){try{const stored=await evaluate("JSON.parse(localStorage.getItem('last-light-v3'))");log.push({event:'stored-save-readback',data:stored});if(passed&&limit===18&&!stored?.finished){passed=false;error='Ending was not committed to localStorage';}await send('Browser.close');for(let n=0;n<100&&chrome.exitCode==null&&chrome.signalCode==null;n++)await sleep(100);log.push({event:'browser-exit',exitCode:chrome.exitCode,signal:chrome.signalCode});}catch(e){log.push({event:'browser-close',detail:String(e)});}}
 await writeFile(`${out}/attempt.json`,JSON.stringify({kind:limit<18?'bounded partial expanded-section keyboard test':'whole expanded-game keyboard test',limit,complete,profile,continuation:!!process.env.CHROME_PROFILE,passed,error,hashes,errors,log,actions},null,2));ws?.close();if(chrome.exitCode==null&&chrome.signalCode==null)chrome.kill();server.kill();if(!passed)process.exitCode=1;}
