// Real Chrome/CDP smoke test. No coordinate injection or save editing.
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.EVIDENCE_DIR||'docs/evidence/browser';
await mkdir(out,{recursive:true});
const port=Number(process.env.PORT||8791),debug=Number(process.env.DEBUG_PORT||9231);
const chrome=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const server=spawn('python3',['-m','http.server',String(port),'-d',process.env.SERVE_DIR||'dist'],{cwd:root,stdio:'ignore'});
const browser=spawn(chrome,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--autoplay-policy=no-user-gesture-required',`--remote-debugging-port=${debug}`,`--user-data-dir=/tmp/last-light-check-${process.pid}`,'--window-size=1280,1100',`http://127.0.0.1:${port}/`],{stdio:'ignore'});
let socket;const errors=[],logs=[];let next=0;const waiting=new Map();
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++next;const timer=setTimeout(()=>{waiting.delete(id);reject(Error(`CDP timeout: ${method}`));},8000);waiting.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));});
try{
 let tabs;for(let i=0;i<40;i++){try{tabs=await(await fetch(`http://127.0.0.1:${debug}/json`)).json();if(tabs.some(t=>t.type==='page'))break;}catch{}await delay(150);}
 const tab=tabs?.find(t=>t.type==='page');if(!tab)throw Error('Chrome did not start');
 socket=new WebSocket(tab.webSocketDebuggerUrl);await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
 socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const w=waiting.get(m.id);if(w){clearTimeout(w.timer);waiting.delete(m.id);m.error?w.reject(Error(JSON.stringify(m.error))):w.resolve(m.result);}}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);};
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(`${out}/${name}.png`,Buffer.from(r.data,'base64'));};
 const tap=async code=>{await send('Input.dispatchKeyEvent',{type:'keyDown',code,key:code==='Space'?' ':code});await delay(80);await send('Input.dispatchKeyEvent',{type:'keyUp',code,key:code==='Space'?' ':code});};
 await send('Runtime.enable');await send('Page.enable');await delay(700);await shot('01-menu');
 const box=await evaluate("(()=>{const b=document.getElementById('start');b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()");
 await send('Input.dispatchMouseEvent',{type:'mousePressed',...box,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',...box,button:'left',clickCount:1});await delay(400);
 logs.push({step:'start',snapshot:await evaluate('window.lastLight.snapshot()')});
 if(logs[0].snapshot.mode!=='playing')throw Error('Start did not enter playing');
 for(let n=0;n<14;n++){if(!(await evaluate('window.lastLight.snapshot().scene')))break;await delay(1000);}if((await evaluate('window.lastLight.snapshot().scene')))throw Error('Opening scene exceeded its bounded duration');
 await shot('02-day');await tap('KeyX');await delay(60);await shot('03-phase-transition');await delay(300);logs.push({step:'night',snapshot:await evaluate('window.lastLight.snapshot()')});if(logs.at(-1).snapshot.phase!=='night')throw Error('Phase hotkey failed');await shot('04-night');
 await tap('Escape');logs.push({step:'pause',snapshot:await evaluate('window.lastLight.snapshot()')});if(logs.at(-1).snapshot.mode!=='paused')throw Error('Pause failed');await shot('05-paused');await tap('Escape');await delay(200);
 await send('Input.dispatchKeyEvent',{type:'keyDown',code:'ArrowRight',key:'ArrowRight'});await delay(600);await send('Input.dispatchKeyEvent',{type:'keyUp',code:'ArrowRight',key:'ArrowRight'});logs.push({step:'movement',snapshot:await evaluate('window.lastLight.snapshot()')});if(logs.at(-1).snapshot.mode!=='playing'||logs.at(-1).snapshot.player.x<=logs[0].snapshot.player.x)throw Error('Resume/movement failed');
 const timing=await send('Runtime.evaluate',{expression:"new Promise(resolve=>{const ds=[];let prev;function sample(t){if(prev!=null)ds.push(t-prev);prev=t;if(ds.length>=180){const a=ds.slice().sort((a,b)=>a-b);resolve({samples:a.length,medianMs:a[Math.floor(a.length/2)],p95Ms:a[Math.floor(a.length*.95)],maxMs:a.at(-1),over33ms:ds.filter(x=>x>33.4).length,scope:'active entrance scene, desktop headless Chrome; not full-map/physical-device profiling'});}else requestAnimationFrame(sample);}requestAnimationFrame(sample);})",awaitPromise:true,returnByValue:true});logs.push({step:'entrance-frame-sampling',timings:timing.result.value});
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});await delay(200);await shot('06-mobile');
 logs.push({step:'mobile-layout',metrics:await evaluate('({viewport:innerWidth,document:document.documentElement.scrollWidth,touch: getComputedStyle(document.querySelector(".touch")).display})')});
 if(logs.at(-1).metrics.document>logs.at(-1).metrics.viewport)throw Error('Mobile horizontal overflow');
 if(errors.length)throw Error(`${errors.length} browser exceptions`);
 await writeFile(`${out}/report.json`,JSON.stringify({kind:'smoke, NOT full playthrough',logs,errors},null,2));console.log(`Chrome smoke passed; evidence: ${out}`);
}catch(e){await writeFile(`${out}/report.json`,JSON.stringify({error:String(e),logs,errors},null,2));console.error(e);process.exitCode=1;
}finally{socket?.close();browser.kill();server.kill();}
