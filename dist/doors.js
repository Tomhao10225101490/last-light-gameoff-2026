import {overlaps} from './phase.js';
export function createDoor(config){return {...config,phase:config.locked?'locked':'closed',openness:0,progress:0,unlocked:!config.locked};}
export function useDoor(d){
 if(d.phase==='locked'||d.phase==='opening'||d.phase==='closing')return false;
 d.phase=d.phase==='closed'?'opening':'closing';d.progress=0;return true;
}
export function unlockDoor(d){d.unlocked=true;if(d.phase==='locked')d.phase='closed';}
export function doorBlocks(d){return d.openness<.82;}
export function updateDoor(d,player,dt){
 if(d.phase==='opening'){d.openness=Math.min(1,d.openness+dt/.4);if(d.openness===1)d.phase='open';}
 else if(d.phase==='closing'){
  // Reopen instead of crushing or trapping a player in the threshold.
  if(overlaps(player,{x:d.x-3,y:d.y,w:d.w+6,h:d.h})){d.phase='opening';return;}
  d.openness=Math.max(0,d.openness-dt/.4);if(d.openness===0)d.phase='closed';
 }
 d.progress=d.openness;
}
export function doorColliders(doors){return doors.filter(doorBlocks).map(d=>({x:d.x,y:d.y,w:d.w,h:d.h,solid:true,phase:null,id:d.id}));}
