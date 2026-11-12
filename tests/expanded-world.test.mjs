import test from 'node:test';import assert from 'node:assert/strict';
import {createCanvas} from '@napi-rs/canvas';
import {Simulation,FIXED_DT} from '../dist/simulation.js';
import {buildSector} from '../dist/world.js';
import {Art} from '../dist/art.js';import {freshSave,loadSave,SAVE_KEY} from '../dist/save.js';
import {createPlayer,stepPlayer} from '../dist/core.js';import {CollisionIndex} from '../dist/spatial.js';
import {CHAPTERS} from '../dist/chapters.js';
const ticks=(s,n,input={})=>{for(let i=0;i<n;i++)s.step(input);};
function workFixture(chapter,sector){const s=new Simulation();s.loadSector(chapter,sector);s.mode='playing';s.player.x=s.station.x-7;s.player.y=s.station.y-14;s.player.prevY=s.player.y;s.step({interact:true});return s;}

test('fresh game has six actual 2D sections per chapter; legacy data stays on retained maps',()=>{
 const s=new Simulation();assert.equal(s.expanded,true);assert.equal(s.worldHeight,1620);assert.equal(CHAPTERS.flat().length,18);
 const storage=new Map([[SAVE_KEY,JSON.stringify({schemaVersion:3,floor:1,chapterProgress:[[true],[],[]],hp:2})]]);const before=storage.get(SAVE_KEY);
 const result=loadSave({getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)});
 assert.equal(result.data.worldRevision,1);assert.equal(storage.get(`${SAVE_KEY}-before-expanded-world`),before);assert.equal(storage.get(SAVE_KEY),before);
 const legacy=new Simulation(result.data);assert.equal(legacy.expanded,false);assert.equal(legacy.worldWidth,4550);
});

test('all new lamps are physically supported in both memories',()=>{
 for(let f=0;f<3;f++)for(let k=0;k<6;k++){const d=buildSector(f,k);for(const lamp of d.checkpoints)for(const night of [false,true]){
  const p=createPlayer(lamp.x);p.y=lamp.y;p.prevY=p.y;for(let t=0;t<10;t++)stepPlayer(p,{},d.platforms,night,FIXED_DT,{width:d.width,solids:d.walls});
  assert.equal(p.grounded,true,`${d.id}/${lamp.id}`);assert.equal(p.y,lamp.y);
 }}
});

test('work is animated before permanent pressure, hazard, door and lift changes commit',()=>{
 const s=workFixture(0,1);assert.ok(s.scene);assert.equal(s.station.done,false);assert.equal(s.doors[0].locked,true);const count=s.platforms.length;
 ticks(s,100);assert.equal(s.station.done,false);s.pause();const age=s.scene.time;ticks(s,100);assert.equal(s.scene.time,age);s.resume();ticks(s,1100);
 assert.equal(s.station.done,true);assert.ok(s.progress.mechanisms.includes(s.station.id));assert.ok(s.hazards.every(h=>h.disabled));assert.equal(s.doors[0].locked,false);assert.equal(s.doors[0].phase,'closed');assert.equal(s.doors[0].unlocked,true);assert.ok(s.platforms.length>count);
 assert.equal(s.items[0].got,true);assert.ok(s.platforms.some(p=>p.powered&&p.motion));
});

test('interrupted scene restores at a safe lamp without pretending unfinished work was committed',()=>{
 const s=workFixture(1,2);ticks(s,80);const back=new Simulation(s.persist());assert.equal(back.scene,null);assert.equal(back.station.done,false);assert.equal(back.player.lifeState,'alive');assert.equal(back.progress.mechanisms.length,0);
});

test('corrected register and lunchbox are staged, not merely picked up',()=>{
 const record=workFixture(1,2);assert.equal(record.scene.id,'record');ticks(record,1500);assert.ok(record.events.includes('record-corrected'));
 const box=workFixture(1,5);assert.equal(box.scene.id,'lunchbox');ticks(box,160);assert.ok(box.scene.actors.some(p=>p.shade==='gary'));assert.equal(box.items[2].got,false);ticks(box,1300);assert.equal(box.items[2].got,true);
});

test('section doors cannot bypass unfinished work; transition has actual staged movement',()=>{
 const s=new Simulation();s.mode='playing';s.player.x=s.exitX;s.player.y=s.exitY;s.interact();assert.equal(s.door.phase,'closed');assert.ok(s.drain().some(e=>e.type==='need-work'));
 s.station.done=true;s.interact();assert.equal(s.door.phase,'opening');ticks(s,60);assert.equal(s.door.phase,'entering');ticks(s,220);assert.equal(s.sector,1);assert.equal(s.player.y,200);assert.equal(s.worldHeight,1620);
});

test('last passage warns for five seconds and respawn restarts the warning safely',()=>{
 const s=workFixture(2,5);ticks(s,1600);assert.ok(s.pursuit);assert.equal(s.pursuit.active,false);assert.ok(s.pursuit.warning>0);assert.ok(s.pursuit.x<s.player.x-200);
 s.beginDeath('fall');ticks(s,200);assert.equal(s.player.lifeState,'alive');assert.ok(s.pursuit.warning>3);assert.equal(s.scene,null);
});

test('broad-phase simulation agrees with the full solver on new-world inputs',()=>{
 const data=buildSector(0,0),index=new CollisionIndex(data.platforms),a=createPlayer(55),b=createPlayer(55);
 for(let t=0;t<900;t++){const input={right:t<300,left:t>=300&&t<600,jump:t%96===0};const near=index.query(a.x-40,a.y-20,a.x+60,a.y+65);stepPlayer(a,input,near,t%200<100,FIXED_DT,{width:data.width,solids:data.walls});stepPlayer(b,input,data.platforms,t%200<100,FIXED_DT,{width:data.width,solids:data.walls});assert.equal(a.x,b.x);assert.equal(a.y,b.y);assert.equal(a.supportId,b.supportId);}
});

test('expanded simulation produces identical outcomes with 30/60/120 render grouping',()=>{
 const results=[];for(const fps of [30,60,120]){const s=new Simulation();s.loadSector(1,4);s.mode='playing';let tick=0;for(let frame=0;frame<fps*5;frame++)for(let n=0;n<120/fps;n++,tick++)s.step({right:true,jump:tick%97===0,shift:tick%131===0});results.push({player:s.player,night:s.night,deaths:s.deaths,checkpoint:s.checkpointId});}assert.deepEqual(results[0],results[1]);assert.deepEqual(results[1],results[2]);
});

test('expanded animated complete ending keeps crowd motion continuous across its beats and saves finished state',()=>{
 const data=freshSave();data.floor=2;data.sector=5;data.mechanisms=CHAPTERS.flatMap((c,f)=>c.map(s=>`${f}/${s.id}`));data.evidence=['fire-order','gary-lamp','public-list','handover','evacuation','emergency-circuit'];data.events=['record-corrected','emergency-light'];data.chapterProgress=Array.from({length:3},()=>[true,true,true]);
 const s=new Simulation(data);s.mode='playing';s.player.x=s.exitX;s.player.y=s.exitY;s.interact();ticks(s,800);assert.equal(s.scene.id,'ending-complete');assert.ok(s.scene.actors.length>=4);const first=s.scene.actors[0].x;ticks(s,200);assert.ok(s.scene.actors[0].x>=first);ticks(s,1500);assert.equal(s.mode,'won');assert.equal(s.ending,'complete');assert.equal(s.persist().finished,true);
 const back=new Simulation(structuredClone(s.persist()));assert.equal(back.mode,'won');assert.equal(back.ending,'complete');
});

test('abyss death stays visible at the bottom of a deep vertical camera',()=>{
 const canvas=createCanvas(480,270),art=new Art(canvas);art.cam=0;art.viewTop=1374;art.t=0;art.n=0;art.c.translate(0,-1374);const p=createPlayer(55);p.y=1712;p.anim='fallDeath';p.deathTime=0;art.player(p);const pixels=art.c.getImageData(52,216,25,30).data;let visible=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]+pixels[i+1]+pixels[i+2]>80)visible++;assert.ok(visible>100,'fall sprite was incorrectly clamped into the old 270px world');
});

test('expanded artwork is identical when inactive platforms are deleted',()=>{
 const canvas=createCanvas(480,270),art=new Art(canvas);for(let f=0;f<3;f++)for(let k=0;k<6;k++)for(const night of [false,true]){
  const s=new Simulation();s.loadSector(f,k);s.night=night;s.phaseMix=.37;s.camera=480;s.cameraY=540;art.render(s,0);const full=canvas.toBuffer('image/png');s.platforms=s.platforms.filter(p=>p.phase==null||p.phase===(night?'night':'day'));art.render(s,0);assert.deepEqual(canvas.toBuffer('image/png'),full,`${f}/${k}/${night}`);
 }
});
