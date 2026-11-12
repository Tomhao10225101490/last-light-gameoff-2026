// Gameplay phase is discrete. Background colour interpolation never decides collision.
export const phaseActive=(object,night)=>object.phase==null||object.phase===(night?'night':'day');
export const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+(a.w??14)>b.x&&a.y<b.y+b.h&&a.y+(a.h??28)>b.y;
export function canShift(world,targetNight){
 const p=world.player;
 if(p.lifeState!=='alive'&&p.lifeState!=='hurt')return {ok:false,reason:'player-state'};
 if(world.mode!=='playing'||world.door?.phase!=='closed'||world.shiftCooldown>0)return {ok:false,reason:'locked'};
 const body={x:p.x+1,y:p.y+1,w:12,h:26};
 const solid=world.platforms.find(q=>q.phase!=null&&phaseActive(q,targetNight)&&!phaseActive(q,world.night)&&overlaps(body,{...q,h:q.h??7}));
 if(solid)return {ok:false,reason:'occupied-platform'};
 const blocker=(world.walls||[]).find(q=>phaseActive(q,targetNight)&&overlaps(body,q));
 if(blocker)return {ok:false,reason:'occupied-wall'};
 const ghost=world.ghosts.find(g=>g.spawned!==false&&phaseActive(g,targetNight)&&Math.abs(p.x+7-(g.xNow??g.x))<(14+(g.collisionShape?.w??12))/2+1&&Math.abs(p.y+14-(g.yNow??g.y))<(28+(g.collisionShape?.h??16))/2+1);
 if(ghost)return {ok:false,reason:'occupied-ghost'};
 return {ok:true};
}
export function commitShift(world){
 const target=!world.night,result=canShift(world,target);if(!result.ok){world.shiftRejected=.16;return result;}
 world.night=target;world.shiftCooldown=.24;world.shiftFx=.22;world.shifts++;
 // Effects are player-bound only; no platform-bound particles survive a phase commit.
 world.particles=world.particles.filter(p=>!p.platformId);
 return result;
}
