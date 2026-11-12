import {SCENES} from './chapters.js';
export function beginScene(world,id,purpose='work'){
 const beats=SCENES[id];if(!beats)return false;
 world.scene={id,purpose,beat:0,time:0,total:0,beats:beats.length,origin:{x:world.player.x,y:world.player.y},actors:[]};
 world.player.vx=0;world.player.vy=0;world.player.anim=['lunchbox','plants'].includes(id)?'interact':'door';
 world.player.lifeState='cinematic';world.emit('clear-input');world.emit('scene-beat',{id,beat:0});return true;
}
export function updateScene(world,input,dt){
 const s=world.scene;if(!s)return false;s.time+=dt;s.total+=dt;
 const ending=s.id.startsWith('ending-'),duration=ending?4.2:3.6;
 const minimum=ending?3.9:s.id==='lunchbox'&&s.beat===1?2.1:.9;
 if(s.time>=duration||(input.interact&&s.time>minimum)){
  s.beat++;s.time=0;if(s.beat>=s.beats){world.scene=null;world.player.lifeState='alive';world.player.anim='idle';world.emit('scene-finished',{id:s.id,purpose:s.purpose});return true;}
  world.emit('scene-beat',{id:s.id,beat:s.beat});
 }
 s.actorTime??=0;s.garyTime??=0;if(s.beat>=1)s.actorTime+=dt;if(s.beat>=2)s.garyTime+=dt;
 const p=s.origin,walk=(offset,speed=25,elapsed=s.actorTime)=>({x:p.x+offset+elapsed*speed,y:p.y,pose:'walk',shade:'echo'});
 s.actors=[];
 if(s.id==='fire-door'){
  s.actors.push({x:p.x+72,y:p.y,pose:'hold',shade:'gary'});
  if(s.beat>=1)for(let i=0;i<4;i++)s.actors.push(walk(-130+i*35,52));
 }else if(s.id==='lunchbox')s.actors.push({x:p.x+92,y:p.y,pose:'receive',shade:'gary'});
 else if(ending){
  if(s.id==='ending-complete'&&s.beat>=1){for(let i=0;i<4;i++)s.actors.push(walk(-240+i*42,31));if(s.beat>=2)s.actors.push({...walk(-75,22,s.garyTime),shade:'gary',lunch:true});}
  if(s.beat===s.beats-1)world.player.x=p.x+s.time*22;
 }
 return false;
}
export function sceneText(world){const s=world.scene;return s?SCENES[s.id][s.beat][world.lang==='zh'?1:0]:'';}
