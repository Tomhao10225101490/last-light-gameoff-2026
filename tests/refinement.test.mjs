import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlayer,level,stepPlayer} from '../dist/core.js';
import {Simulation,FIXED_DT} from './legacy-fixture.mjs';
import {createGhost,updateGhost,ghostContact} from '../dist/enemies.js';
import {canShift} from '../dist/phase.js';

test('stable platform identities do not depend on frame copies or phase',()=>{
 for(let f=0;f<3;f++){
  const first=level(f),second=level(f);assert.deepEqual(first.map(p=>p.id),second.map(p=>p.id));
  assert.equal(new Set(first.map(p=>p.id)).size,first.length);
 }
});

test('downward-moving support carries faster than gravity without dropping its passenger',()=>{
 const platform={id:'lift',x:0,y:100,prevY:98,dx:0,dy:2,w:100,phase:null};
 const p=createPlayer(25);p.y=70;p.grounded=true;p.supportId='lift';
 stepPlayer(p,{},[platform],false,FIXED_DT);
 assert.equal(p.grounded,true);assert.equal(p.supportId,'lift');assert.equal(p.y,72);
});

test('horizontal platform carry is swept against real side walls',()=>{
 const platform={id:'lift',x:2,y:100,prevY:100,dx:8,dy:0,w:100,phase:null};
 const p=createPlayer(25);p.y=72;p.grounded=true;p.supportId='lift';
 stepPlayer(p,{},[platform],false,FIXED_DT,{solids:[{x:40,y:20,w:10,h:80}]});
 assert.ok(p.x+13<=40,`carried player entered wall at ${p.x}`);
 assert.equal(p.grounded,true);
});

test('watcher has a facing cone but retains close peripheral warning',()=>{
 const p=createPlayer(190);p.y=181;
 const g=createGhost({x:100,y:195,kind:'watcher',chaseRange:150,spawnCondition:'always'});g.facing=-1;
 const world={night:false,player:p,checkpoints:[],walls:[],events:[]};
 updateGhost(g,world,FIXED_DT);assert.equal(g.state,'patrol');
 g.facing=1;updateGhost(g,world,FIXED_DT);assert.equal(g.state,'alert');
 const close=createGhost({x:170,y:195,kind:'watcher',spawnCondition:'always'},1);close.facing=-1;
 updateGhost(close,world,FIXED_DT);assert.equal(close.state,'alert');
});

test('configured ghost collision shape governs both contact and phase rejection',()=>{
 const p=createPlayer(100);p.y=181;p.prevX=100;p.prevY=181;
 const g=createGhost({x:135,y:195,phase:'night',collisionShape:{w:48,h:16},spawnCondition:'always'});g.spawned=true;
 assert.equal(ghostContact(g,p),true);
 const world={player:p,mode:'playing',door:{phase:'closed'},night:false,shiftCooldown:0,platforms:[],walls:[],ghosts:[g]};
 assert.equal(canShift(world,true).reason,'occupied-ghost');
 assert.equal(updateGhost(g,{...world,events:[],checkpoints:[]},FIXED_DT),false);
});

test('office upper checkpoint, door and save are genuine simulation objects',()=>{
 const s=new Simulation();s.loadFloor(1);s.mode='playing';s.player.x=3930;s.player.y=98;s.player.prevY=98;
 for(let i=0;i<100;i++)s.step({right:true});
 assert.equal(s.player.lifeState,'alive');assert.equal(s.checkpointId,'lamp-1-mezzanine');
 assert.equal(s.player.supportId,'chapter-1-platform-35');assert.ok(s.player.x+13<=3980);
 assert.equal(s.room,'archive-mezzanine');
 s.step({interact:true});for(let i=0;i<75;i++)s.step({right:true});
 assert.ok(s.player.x>3980);assert.ok(s.progress.openedDoors.includes('office-fire-door'));
 s.persist();const restored=new Simulation(s.progress);
 assert.equal(restored.checkpointId,'lamp-1-mezzanine');assert.equal(restored.player.y,98);
 assert.equal(restored.player.prevY,98);assert.ok(restored.cameraY<0);
 assert.equal(restored.doors[0].phase,'open');
});

test('known emergency lamp can heal on interaction without erasing completed work',()=>{
 const s=new Simulation();s.mode='playing';s.player.hp=1;s.progress.chapterProgress[0][0]=true;
 s.step({interact:true});assert.equal(s.player.hp,3);assert.equal(s.progress.chapterProgress[0][0],true);
 assert.ok(s.drain().some(e=>e.type==='checkpoint'));
});

test('completed task emits bounded mechanical noise for hearing enemies',()=>{
 const s=new Simulation();s.mode='playing';const item=s.items[0];s.player.x=item.x-7;s.player.y=200;
 s.step({interact:true});for(let i=0;i<75;i++)s.step({});
 assert.equal(item.got,true);assert.ok(s.noiseTime>0&&s.noiseTime<=.8);
 assert.equal(s.noiseLevel,1);for(let i=0;i<100;i++)s.step({});assert.equal(s.noiseTime,0);
});
