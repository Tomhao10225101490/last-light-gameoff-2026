import test from 'node:test';
import assert from 'node:assert/strict';
import {createCanvas} from '@napi-rs/canvas';
import {Simulation,FIXED_DT} from './legacy-fixture.mjs';
import {Art} from '../dist/art.js';
import {createPlayer,stepPlayer,updateMovingPlatforms,level,intersects} from '../dist/core.js';
import {CHECKPOINTS,FLOOR_ITEMS,EVIDENCE} from '../dist/level-data.js';
import {canShift,commitShift} from '../dist/phase.js';
import {damage,kill} from '../dist/player-state.js';
import {createGhost,updateGhost,ghostContact} from '../dist/enemies.js';
import {createDoor,useDoor,updateDoor,doorBlocks,doorColliders} from '../dist/doors.js';
import {loadSave,storeSave,freshSave,SAVE_KEY} from '../dist/save.js';
const ticks=(s,n,input={})=>{for(let i=0;i<n;i++)s.step(input);};
const playing=()=>{const s=new Simulation();s.start();s.drain();return s;};
function pixels(s){const canvas=createCanvas(480,270),art=new Art(canvas);art.render(s,0);return canvas.toBuffer('image/png');}

test('inactive platform output exactly equals deletion, even during colour transition',()=>{
 for(const night of [false,true])for(const mix of [0,.1,.49,.51,.9,1]){
 const a=playing();a.night=night;a.phaseMix=mix;a.time=1.25;a.camera=210;a.shiftFx=.17;
 const b=playing();Object.assign(b,{night,phaseMix:mix,time:a.time,camera:a.camera,shiftFx:a.shiftFx});b.platforms=b.platforms.filter(p=>!p.phase||p.phase===(night?'night':'day'));
 assert.deepEqual(pixels(a),pixels(b),`night=${night}, mix=${mix}`);
 }
});
test('phase authority is atomic; disappearing foot platform causes real fall',()=>{
 const s=playing();s.player.x=275;s.player.y=200;s.night=true;s.phaseMix=1;assert.ok(commitShift(s).ok);assert.equal(s.night,false);assert.equal(s.phaseMix,1);ticks(s,35);assert.ok(s.player.y>220);
});
test('phase refuses newly appearing platform/ghost overlap without damage',()=>{
 const s=playing();s.player.x=280;s.player.y=220;assert.equal(canShift(s,true).reason,'occupied-platform');assert.equal(s.player.hp,3);s.player.y=100;s.ghosts=[createGhost({x:287,y:114,phase:'night',spawnCondition:'always'})];s.ghosts[0].spawned=true;assert.equal(canShift(s,true).reason,'occupied-ghost');assert.equal(s.night,false);
});
test('HP damage immunity never prevents ghost kill; death count is idempotent',()=>{
 const s=playing();assert.equal(damage(s,100),true);assert.equal(s.player.hp,2);assert.equal(damage(s,100),false);assert.ok(kill(s,'ghost'));assert.equal(s.player.hp,0);assert.equal(s.player.lifeState,'dying');assert.equal(kill(s,'fall'),false);assert.equal(s.deaths,1);
});
test('dying and respawning are separate, paused state does not advance, total 1.55 seconds',()=>{
 const s=playing();s.beginDeath('ghost');ticks(s,60);assert.equal(s.player.lifeState,'dying');s.pause();ticks(s,200);assert.ok(Math.abs(s.player.lifeTime-.5)<1e-9);s.resume();ticks(s,50);assert.equal(s.player.lifeState,'respawning');assert.equal(s.player.hp,3);ticks(s,80);assert.equal(s.player.lifeState,'alive');assert.equal(s.deaths,1);
});
test('respawn resets enemies, effects and stale interactions at a real emergency lamp',()=>{
 const s=playing();s.checkpointId='lamp-0-2';s.ghosts[0].state='chase';s.ghosts[0].target={x:1,y:1};s.particles.push({platformId:'old'});s.beginDeath('fall');ticks(s,112);assert.equal(s.player.x,1220);assert.equal(s.night,false);assert.equal(s.particles.length,0);assert.equal(s.ghosts[0].target,null);assert.ok(s.ghosts[0].cooldown>0);assert.ok(s.checkpoints.some(c=>c.x===s.player.x));
});
test('ghost swept collision catches crossing but ignores decorative aura',()=>{
 const g=createGhost({x:100,y:114,phase:null});g.prevX=80;g.xNow=140;const p=createPlayer(100);p.y=100;p.prevY=100;assert.ok(ghostContact(g,p));g.prevX=g.xNow=180;assert.equal(ghostContact(g,p),false);
});
test('watcher alerts before pursuit, loses sight behind solid wall, respects safe lamp',()=>{
 const s=playing();s.player.x=700;s.player.y=200;const g=createGhost({x:780,y:214,kind:'watcher',phase:null,spawnCondition:'always',alertDelay:.5});g.spawned=true;s.ghosts=[g];updateGhost(g,s,FIXED_DT);assert.equal(g.state,'alert');for(let i=0;i<62;i++)updateGhost(g,s,FIXED_DT);assert.equal(g.state,'chase');s.walls=[{x:740,y:150,w:12,h:80,phase:null}];updateGhost(g,s,FIXED_DT);assert.equal(g.state,'search');s.player.x=55;for(let i=0;i<180;i++)assert.equal(updateGhost(g,s,FIXED_DT),false);
});
test('listener responds to running but not silence',()=>{
 const s=playing();s.player.x=700;const g=createGhost({x:760,y:214,kind:'listener',phase:null,spawnCondition:'always'});updateGhost(g,s,FIXED_DT,0);assert.equal(g.state,'patrol');updateGhost(g,s,FIXED_DT,.7);assert.equal(g.state,'alert');
});
test('door opening blocks until wide enough; threshold closing reopens',()=>{
 const d=createDoor({x:100,y:150,w:16,h:78});assert.ok(useDoor(d));assert.equal(useDoor(d),false);const p=createPlayer(55);for(let i=0;i<20;i++)updateDoor(d,p,FIXED_DT);assert.ok(doorBlocks(d));for(let i=0;i<30;i++)updateDoor(d,p,FIXED_DT);assert.equal(d.phase,'open');assert.equal(doorColliders([d]).length,0);assert.ok(useDoor(d));p.x=100;updateDoor(d,p,FIXED_DT);assert.equal(d.phase,'opening');
});
test('side wall and ceiling collisions are solid, not visual-only',()=>{
 let p=createPlayer(55);const ground=[{x:0,y:228,w:300,phase:null}],wall={x:90,y:150,w:10,h:78,phase:null};for(let i=0;i<100;i++)stepPlayer(p,{right:true},ground,false,FIXED_DT,{solids:[wall]});assert.ok(p.x<=77);
 p=createPlayer(55);const roof={x:40,y:160,w:50,h:10,phase:null};for(let i=0;i<25;i++)stepPlayer(p,{jump:i===0},ground,false,FIXED_DT,{solids:[roof]});assert.ok(p.y>=170);
});
test('moving platforms carry grounded passenger and release cleanly when phase vanishes',()=>{
 const platform={id:'lift',x:30,y:228,w:90,phase:null,motion:{x:30,speed:1}},p=createPlayer(55);p.supportId='lift';for(let i=0;i<60;i++){updateMovingPlatforms([platform],(i+1)*FIXED_DT,FIXED_DT);stepPlayer(p,{},[platform],false,FIXED_DT);}assert.ok(p.x>65);platform.phase='night';for(let i=0;i<30;i++)stepPlayer(p,{},[platform],false,FIXED_DT);assert.ok(p.y>210);
});
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),m};};
test('legacy save migration preserves original and backs up before writing schema v3',()=>{
 const storage=memory(),legacy=JSON.stringify({floor:1,got:[true,false,true],lang:'zh',hp:2});storage.setItem('last-light-v2',legacy);const r=loadSave(storage);assert.equal(storage.getItem('last-light-v2-backup-before-v3'),legacy);assert.equal(storage.getItem('last-light-v2'),legacy);assert.equal(r.data.schemaVersion,3);assert.deepEqual(r.data.chapterProgress[1],[true,false,true]);assert.equal(r.data.lang,'zh');storeSave(storage,r.data);assert.equal(loadSave(storage).data.hp,2);
});
test('future-schema and failed migration backup do not overwrite saves',()=>{
 const storage=memory();storage.setItem(SAVE_KEY,JSON.stringify({schemaVersion:99}));const r=loadSave(storage);assert.equal(r.readOnly,true);assert.equal(JSON.parse(storage.getItem(SAVE_KEY)).schemaVersion,99);
 const blocked={getItem:k=>k==='last-light-v2'?'{}':null,setItem:()=>{throw Error('quota');}};assert.equal(loadSave(blocked).readOnly,true);
});
test('tasks persist through death; interaction is safe and emits completion only once',()=>{
 const s=playing();s.player.x=170;s.interact();assert.equal(s.player.lifeState,'interacting');ticks(s,80);assert.equal(s.items[0].got,true);assert.equal(s.log.filter(e=>e.type==='task').length,1);s.beginDeath('fall');ticks(s,190);assert.equal(s.items[0].got,true);assert.equal(s.persist().chapterProgress[0][0],true);
});
test('fixed simulation outcomes match render rates 30/60/120',()=>{
 const results=[];for(const fps of [30,60,120]){const s=playing();let accumulator=0,tick=0;for(let frame=0;frame<fps;frame++){accumulator+=1/fps;while(accumulator>=FIXED_DT-1e-10){s.step({right:true,jump:tick===18,release:tick===60});tick++;accumulator-=FIXED_DT;}}results.push({x:s.player.x,y:s.player.y,tick});}assert.deepEqual(results[0],results[1]);assert.deepEqual(results[1],results[2]);
});
