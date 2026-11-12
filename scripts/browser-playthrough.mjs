// Bounded normal-keyboard browser attempt. No simulation stepping, coordinates,
// save mutation, teleporting or debug jumps inside the browser.
import {spawn} from 'node:child_process';import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {level,stepPlayer,worldWidth} from '../dist/core.js';
import {routesFor} from './playtest-routes.mjs';
const runtimeHashes={};for(const file of await readdir('dist'))runtimeHashes[file]=createHash('sha256').update(await readFile(`dist/${file}`)).digest('hex');
const complete=process.env.ENDING==='complete';const out=process.env.EVIDENCE_DIR||(complete?'docs/evidence/dev2/complete':'docs/evidence/dev2/normal');await mkdir(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const port=Number(process.env.PORT||8792),debug=Number(process.env.DEBUG_PORT||9232);
const server=spawn('python3',['-m','http.server',String(port),'-d','dist'],{stdio:'ignore'});
const browser=spawn(process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--disable-gpu','--autoplay-policy=no-user-gesture-required',`--remote-debugging-port=${debug}`,`--user-data-dir=/tmp/last-light-route-${process.pid}`,'--window-size=1280,1100',`http://127.0.0.1:${port}`],{stdio:'ignore'});
let ws,id=0;const waiting=new Map(),log=[],actions=[],pressed=new Set(),runtimeErrors=[],captures=new Set();let error,endingReached=false;
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id,timer=setTimeout(()=>{waiting.delete(n);reject(Error(`timeout ${method}`));},6000);waiting.set(n,{resolve,reject,timer});ws.send(JSON.stringify({id:n,method,params}));});
try{
 let tabs;for(let n=0;n<50;n++){try{tabs=await(await fetch(`http://127.0.0.1:${debug}/json`)).json();if(tabs.some(t=>t.type==='page'))break;}catch{}await sleep(120);}
 ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});ws.onmessage=e=>{const m=JSON.parse(e.data),w=waiting.get(m.id);if(w){clearTimeout(w.timer);waiting.delete(m.id);m.error?w.reject(Error(JSON.stringify(m.error))):w.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')runtimeErrors.push(m.params.exceptionDetails);};
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const key=async(code,down)=>{if(pressed.has(code)===down)return;if(down)pressed.add(code);else pressed.delete(code);actions.push({ms:Date.now(),code,down});await send('Input.dispatchKeyEvent',{type:down?'keyDown':'keyUp',code,key:code==='Space'?' ':code});};
 const tap=async code=>{await key(code,true);await sleep(12);await key(code,false);};
 const click=async(selector='#start')=>{const box=await evaluate(`(()=>{let b=document.querySelector(${JSON.stringify(selector)});b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',...box,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',...box,button:'left',clickCount:1});};
 await send('Runtime.enable');await send('Page.enable');for(let n=0;n<30;n++){try{if((await fetch(`http://127.0.0.1:${port}/`)).ok)break;}catch{}await sleep(100);}await send('Page.navigate',{url:`http://127.0.0.1:${port}/`});await sleep(900);await click();await sleep(400);
 const routes=routesFor(complete);
 let floor=-1,index=0,jumping=false,jumpStart=0,shiftAfter=0,desiredNight=false,lastInteract=0,lastDeath=0;const deadline=Date.now()+Number(process.env.PLAYTEST_MS||180000);
 while(Date.now()<deadline){
  const s=await evaluate('window.lastLight.snapshot()');if(s.mode==='won'){log.push({event:'ending',snapshot:s});const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(`${out}/ending.png`,Buffer.from(shot.data,'base64'));if(complete&&s.ending!=='complete')throw Error('Expected complete ending but got normal');console.log(`${s.ending} ending reached.`);endingReached=true;
   if(process.env.VERIFY_REVISIT==='1'){
    await key('ArrowRight',false);await key('Space',false);await click();await sleep(100);await click('#visit-entries button:nth-of-type(2)');await sleep(150);
    const revisit=await evaluate('window.lastLight.snapshot()');if(revisit.floor!==1||revisit.mode!=='playing'||revisit.evidence.length!==s.evidence.length)throw Error('Chapter revisit lost progress or failed to open office');
    await tap('KeyJ');const entries=await evaluate("({open:document.getElementById('journal-dialog').open,count:document.querySelectorAll('#journal-entries p').length})");if(!entries.open||entries.count<16)throw Error('Complete journal did not retain all clues, tasks and corrected register');
    log.push({event:'revisit-and-journal',snapshot:revisit,entries});let shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(`${out}/journal-after-ending.png`,Buffer.from(shot.data,'base64'));
    await click('#journal-close');await send('Page.reload');await sleep(700);const restored=await evaluate('window.lastLight.snapshot()');if(restored.floor!==1||restored.evidence.length!==6||!restored.events.includes('record-corrected')||!restored.events.includes('emergency-light'))throw Error('Reload after revisit discarded completed story work');
    await click();await sleep(100);const resumed=await evaluate('window.lastLight.snapshot()');if(resumed.mode!=='playing'||resumed.floor!==1)throw Error('Revisited chapter did not resume after reload');log.push({event:'revisit-reload-resume',snapshot:resumed});
   }
   break;}
  if(s.mode==='between'){log.push({event:'chapter-complete',snapshot:s});await key('ArrowRight',false);await click();await sleep(300);continue;}
  if(s.mode!=='playing')throw Error(`unexpected ${s.mode}`);
  if(s.floor!==floor){floor=s.floor;index=0;jumping=false;console.log(`Chapter ${floor+1}: normal keyboard attempt`);}
  if(s.deaths>lastDeath){lastDeath=s.deaths;log.push({event:'death',snapshot:s});console.log(`Death ${lastDeath}/3 at ${Math.round(s.player.x)}`);if(lastDeath>=3)throw Error('Stopped after three deaths; no infinite retry.');await key('ArrowRight',false);await key('Space',false);await sleep(1700);const respawn=await evaluate('window.lastLight.snapshot()');const m=level(respawn.floor),r=routes[respawn.floor];const support=m.findIndex(q=>q.phase===null&&Math.abs(respawn.player.y+28-q.y)<3&&respawn.player.x>=q.x&&respawn.player.x<q.x+q.w);index=Math.max(0,r.indexOf(support)+1);continue;}
  const p=s.player;
  const landmark=p.grounded&&p.supportId==='chapter-1-platform-35'?'office-mezzanine':p.grounded&&p.supportId==='chapter-2-platform-37'?'roof-walkway':null;
  if(landmark&&!captures.has(landmark)){captures.add(landmark);log.push({event:'landmark',landmark,snapshot:s});const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(`${out}/${landmark}.png`,Buffer.from(shot.data,'base64'));}
  if(!['alive','hurt'].includes(p.lifeState)){pressed.clear();await sleep(30);continue;}
  if(jumping&&(p.vy>=-60||Date.now()-jumpStart>470)){await key('Space',false);jumping=false;}
  const map=level(floor),route=routes[floor];
  while(index<route.length){const q=map[route[index]];if(p.grounded&&p.supportId===q.id){index++;if(index%5===0)log.push({event:'waypoint',floor,index,x:p.x});}else break;}
  const evidenceIds=[['fire-order','gary-lamp'],['public-list','handover'],['evacuation','emergency-circuit']];
  const evidencePoints=complete?[[{x:650,y:110},{x:2418,y:132}],[{x:1968,y:130},{x:2570,y:140}],[{x:1725,y:98},{x:3575,y:136}]][floor].filter((_,i)=>!s.evidence.includes(evidenceIds[floor][i])):[];
  const item=s.items.find(i=>!i.got&&Math.abs(i.x-(p.x+7))<22&&Math.abs(i.y-(p.y+14))<24)||evidencePoints.find(i=>Math.abs(i.x-(p.x+7))<19&&Math.abs(i.y-(p.y+14))<20);
  if(complete&&floor===2&&Math.abs(p.x-4718)<25&&!s.events.includes('emergency-light')){await key('ArrowRight',false);await tap('KeyE');await sleep(80);continue;}
  const closedDoor=s.doors.find(d=>d.phase==='closed'&&Math.abs(p.x-d.x)<36&&Math.abs(p.y-d.y)<55);
  if(closedDoor){await key('ArrowRight',false);await key('Space',false);await tap('KeyE');await sleep(470);continue;}
  if(item&&Date.now()-lastInteract>250){await key('ArrowRight',false);await tap('KeyE');lastInteract=Date.now();await sleep(580);pressed.clear();continue;}
  if(index>=route.length){await key('ArrowRight',true);if(p.x>worldWidth(floor)-115){if(!s.items.every(i=>i.got))throw Error('Exit reached with missing tasks');await tap('KeyE');await sleep(200);}await sleep(30);continue;}
  const target=map[route[index]];
  if(p.x>target.x+target.w+15)throw Error(`Missed required waypoint ${floor}:${route[index]}`);
  if(shiftAfter&&Date.now()>=shiftAfter){if((s.phase==='night')!==desiredNight)await tap('KeyX');shiftAfter=0;}
  const phase=s.phase==='night';let want=target.phase?target.phase==='night':phase;
  const onNeutral=map.some(q=>q.phase===null&&p.grounded&&Math.abs(p.y+28-q.y)<2&&p.x+10>q.x&&p.x<q.x+q.w);
  if(onNeutral&&target.phase==='night'&&target.y===p.y+28&&target.x-p.x>65)want=phase;
  if(onNeutral&&s.ghosts.some(g=>g.phase!=null&&g.phase===(phase?'night':'day')&&g.x>p.x&&g.x-p.x<130))want=!phase;
  if(s.ghosts.some(g=>g.spawned&&(g.phase===null||g.phase===(phase?'night':'day'))&&g.x>p.x&&g.x-p.x<42)&&p.grounded&&!jumping){await key('Space',true);jumping=true;jumpStart=Date.now();}
  if(!target.phase&&p.x>target.x&&floor===0&&[930,1540,2280,3120,3480].some(x=>x-p.x>0&&x-p.x<90))want=true;
  if(want!==phase&&!jumping&&onNeutral&&target.y>=p.y+27)await tap('KeyX');
  if(p.grounded&&!jumping&&target.x-p.x<135){
   // Predict an honest full jump from the observed player state. Prediction is
   // outside the browser; only key events are sent to the game.
   const q={...p};let lands=false;for(let tick=0;tick<150;tick++){const n=tick>10?want:phase;stepPlayer(q,{right:true,jump:tick===0},map,n,1/120);if(tick>3&&q.grounded&&q.x+10>target.x&&q.x<target.x+target.w-4&&Math.abs(q.y+28-target.y)<1){lands=true;break;}if(q.y>330)break;}
   const support=map.find(q=>(q.phase===null||q.phase===(phase?'night':'day'))&&Math.abs(p.y+28-q.y)<2&&p.x+2<q.x+q.w&&p.x+12>q.x);
   const gap=target.x-(support? support.x+support.w:target.x);
   if(lands&&(target.y<p.y+27||(gap>1&&Math.abs(target.y-(p.y+28))<2))){await key('Space',true);jumping=true;jumpStart=Date.now();if(want!==phase){desiredNight=want;shiftAfter=Date.now()+95;}}
  }
  // Avoid walking off a disappearing floor before an accepted jump.
  await key('ArrowRight',true);await sleep(25);
 }
 if(!endingReached)throw Error('Bounded attempt ended before the ending; not a pass.');if(runtimeErrors.length)throw Error('Runtime exceptions were recorded.');
}catch(e){error=String(e);console.error(error);if(ws?.readyState===1){try{const r=await send('Runtime.evaluate',{expression:'window.lastLight.snapshot()',returnByValue:true});log.push({event:'stopped',snapshot:r.result.value});const shot=await send('Page.captureScreenshot',{format:'png'});await writeFile(`${out}/stopped.png`,Buffer.from(shot.data,'base64'));}catch{}}}finally{await writeFile(`${out}/attempt.json`,JSON.stringify({kind:'normal-input browser attempt',runtimeHashes,runtimeErrors,passed:!error,error,log,actions},null,2));ws?.close();browser.kill();server.kill();if(error)process.exitCode=1;}
