import {phaseActive} from './phase.js';
export function createGhost(config,index=0){
 const x=config.x,y=config.y;return {...config,id:config.id||`ghost-${index}`,kind:config.kind||['wanderer','watcher','listener'][index%3],phase:config.phase??null,
 patrolPath:config.patrolPath||[{x:x-(config.range||90),y},{x:x+(config.range||90),y}],speed:config.moveSpeed||24,alertDelay:config.alertDelay??.7,chaseRange:config.chaseRange||150,collisionShape:config.collisionShape||{w:12,h:16},spawnCondition:config.spawnCondition||'after-tutorial',
 home:{x,y},facing:-1,xNow:x,yNow:y,prevX:x,prevY:y,state:'dormant',stateTime:0,pathIndex:0,target:null,cooldown:0,seed:index*2.1,spawned:false};
}
function sightBlocked(g,p,walls,night){
 const y=p.y+14;return walls.some(w=>phaseActive(w,night)&&w.x<Math.max(g.xNow,p.x)&&w.x+w.w>Math.min(g.xNow,p.x)&&y>w.y&&y<w.y+w.h);
}
export function updateGhost(g,world,dt,noise=0){
 g.prevX=g.xNow;g.prevY=g.yNow;g.cooldown=Math.max(0,g.cooldown-dt);
 const p=world.player;g.spawned=g.spawnCondition==='always'||p.x>500||world.events.includes('tutorial');
 const atLamp=world.checkpoints.some(c=>Math.hypot(p.x-c.x,p.y-c.y)<66);
 if(!g.spawned||!phaseActive(g,world.night)||g.cooldown>0){g.state='dormant';g.stateTime=0;return false;}
 if(g.state==='dormant')g.state='patrol';g.stateTime+=dt;
 const dx=p.x+7-g.xNow,dy=p.y+14-g.yNow,range=Math.hypot(dx,dy);
 // Watchers look along their patrol direction; close peripheral detection stays
 // active. They cannot keep a player locked behind their back across the room.
 const inView=g.kind!=='watcher'||range<38||dx*g.facing>=0;
 const visible=inView&&range<g.chaseRange&&Math.abs(dy)<60&&!sightBlocked(g,p,world.walls||[],world.night);
 const noticed=!atLamp&&['alive','hurt'].includes(p.lifeState)&&(g.kind==='watcher'?visible:g.kind==='listener'?visible&&noise>.4:false);
 if(noticed&&['patrol','return','search'].includes(g.state)){g.state='alert';g.stateTime=0;g.target={x:p.x+7,y:g.kind==='watcher'?g.home.y:p.y+14};}
 if(g.state==='alert'&&g.stateTime>=g.alertDelay){g.state='chase';g.stateTime=0;}
 if(g.state==='chase'){
  if(atLamp||!visible||g.kind==='listener'&&noise<.2){g.state='search';g.stateTime=0;}else g.target={x:p.x+7,y:g.kind==='watcher'?g.home.y:p.y+14};
 }
 if(g.state==='search'&&g.stateTime>1.1){g.state='return';g.stateTime=0;g.target=null;}
 let destination;
 if(g.state==='patrol'){destination=g.patrolPath[g.pathIndex];if(Math.hypot(destination.x-g.xNow,destination.y-g.yNow)<4)g.pathIndex=(g.pathIndex+1)%g.patrolPath.length;}
 else if(g.state==='return'){destination=g.home;if(Math.hypot(g.xNow-g.home.x,g.yNow-g.home.y)<4){g.state='patrol';g.stateTime=0;}}
 else if(g.state==='chase'||g.state==='search')destination=g.target;
 if(destination){const vx=destination.x-g.xNow,vy=destination.y-g.yNow,length=Math.hypot(vx,vy)||1,travel=Math.min(length,g.speed*(g.state==='chase'?1.65:1)*dt);const nx=g.xNow+vx/length*travel,ny=g.yNow+vy/length*travel;
  const obstructed=(world.walls||[]).some(w=>phaseActive(w,world.night)&&nx+8>w.x&&nx-8<w.x+w.w&&ny+17>w.y&&ny-17<w.y+w.h);
  if(!obstructed){if(Math.abs(nx-g.xNow)>.001)g.facing=nx>g.xNow?1:-1;g.xNow=nx;g.yNow=ny;}else if(g.state==='patrol')g.pathIndex=(g.pathIndex+1)%g.patrolPath.length;
 }
 // Lamps are a real safe zone, not generic damage invulnerability.
 return !atLamp&&ghostContact(g,p);
}
export function ghostContact(g,p){
 // Relative swept AABB slab test prevents tunnelling; visual aura is excluded.
 const ax=(p.prevX??p.x)+7-(g.prevX??g.xNow),ay=(p.prevY??p.y)+14-(g.prevY??g.yNow);
 const bx=p.x+7-g.xNow,by=p.y+14-g.yNow;let lo=0,hi=1;
 const shape=g.collisionShape||{w:12,h:16};
 for(const [start,end,extent] of [[ax,bx,(14+shape.w)/2],[ay,by,(28+shape.h)/2]]){const d=end-start;if(Math.abs(d)<1e-9){if(Math.abs(start)>=extent)return false;continue;}let t0=(-extent-start)/d,t1=(extent-start)/d;if(t0>t1)[t0,t1]=[t1,t0];lo=Math.max(lo,t0);hi=Math.min(hi,t1);if(lo>hi)return false;}
 return true;
}
