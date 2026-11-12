import {CHAPTERS,SECTOR_WIDTH,SECTOR_HEIGHT,tilePosition} from './chapters.js';
import {unlockDoor} from './doors.js';
export const WORLD_REVISION=2;
const EVIDENCE_IDS=[['fire-order','gary-lamp'],['public-list','handover'],['evacuation','emergency-circuit']];
export function buildSector(chapter,sector,mechanisms=[]){
 const spec=CHAPTERS[chapter][sector],prefix=`${chapter}/${spec.id}`,done=mechanisms.includes(prefix);
 const platforms=[],walls=[],hazards=[],checkpoints=[],props=[],doors=[],ghosts=[];
 const add=(id,x,y,w,phase=null,extra={})=>platforms.push({id:`${prefix}/${id}`,x,y,w,phase,surface:chapter===1?'carpet':'grate',...extra});
 for(let row=0;row<6;row++)for(let col=0;col<4;col++){
  const {x,y}=tilePosition(col,row),kind=spec.plan[row][col],id=`${col}-${row}`;
  props.push({id,kind,x:x+210,y:y-85,chapter,tone:spec.tone});
  if(kind==='O')add(`${id}-floor`,x,y,420);
  else {
   add(`${id}-west`,x,y,158);
   if(kind==='R'){add(`${id}-east`,x+262,y,64);add(`${id}-far-east`,x+362,y,58);}else add(`${id}-east`,x+262,y,158);
   add(`${id}-memory`,x+168,y,84,(row+col+sector)%2?'night':'day');
   if(kind==='B'){
    add(`${id}-stool`,x+38,y-34,64);add(`${id}-shelf`,x+112,y-68,64);add(`${id}-balcony`,x+188,y-102,148);
   }else if(kind==='L'){
    add(`${id}-step`,x+104,y-34,64);add(`${id}-walkway`,x+182,y-68,160);
   }else if(kind==='R'){
    walls.push({id:`${prefix}/${id}-machine`,x:x+326,y:y-38,w:36,h:38,solid:true,phase:null});
    hazards.push({id:`${prefix}/${id}-hazard`,x:x+280,y:y-18,w:25,h:18,type:chapter===0?'steam':chapter===1?'wire':'fan',day:row%2===0,disabled:done,period:3.6,warning:.8});
   }
  }
 }
 // Stairwells are explicitly placed by the section plan, with real ascent/descent.
 // Wide neutral landings allow a phase decision without a forced mid-air guess.
 for(const [col,row] of spec.links){const y=(row+1)*270+228;for(let n=0;n<9;n++){const sx=col*480+392-n*44,sy=y-(n+1)*30;
  if(platforms.some(p=>p.phase==null&&sy>=p.y&&sy-p.y<28&&p.x<=sx+3&&p.x+p.w>=sx+61))continue;
  add(`stair-${col}-${row}-${n}`,sx,sy,64);
 }}
 for(let row=0;row<6;row++){
  const col=[0,3,1,2,0,3][(row+sector)%6],p=tilePosition(col,row);
  checkpoints.push({id:`${prefix}/lamp-${row}`,x:p.x+14,y:p.y-28,sector});
 }
 // Always keep the arrival lamp first, independent of decorative room layout.
 const first={id:`${prefix}/arrival`,x:55,y:200,sector};checkpoints.unshift(first);
 const work=tilePosition(...spec.work),station={id:prefix,x:work.x+88,y:work.y-14,scene:spec.scene,kind:spec.mechanic,done};
 const returnLift={id:`${prefix}/return-lift`,x:220,y:1438,w:92,phase:null,surface:'grate',motion:{y:110,speed:.4,offset:0},powered:true};
 if(done){platforms.push(returnLift);add('permanent-return',678,1038,84);}
 doors.push({id:`${prefix}/exit-door`,x:1772,y:1536,w:18,h:42,locked:!done,requires:prefix});
 // Safe upper detours in the furnished tiles, and neutral stairwells, are actual
 // geometry around these encounters. No contact-damage grace period is added.
 if(sector>0){const a=tilePosition((sector+1)%4,2);ghosts.push({id:`${prefix}/patrol`,x:a.x+392,y:a.y-33,range:16,phase:'night',kind:'wanderer',spawnCondition:'always',moveSpeed:18});}
 if(sector>1){const a=tilePosition(sector%4,4);ghosts.push({id:`${prefix}/observer`,x:a.x+392,y:a.y-33,range:16,phase:chapter===1?null:'night',kind:chapter===0?'listener':'watcher',spawnCondition:'always',moveSpeed:18,chaseRange:120,alertDelay:.9});}
 const evidence=[];if(sector===2||sector===4){const p=tilePosition(sector===2?1:2,3);evidence.push({id:EVIDENCE_IDS[chapter][sector===2?0:1],x:p.x+65,y:p.y-14});}
 return {revision:WORLD_REVISION,id:prefix,spec,sector,width:SECTOR_WIDTH,height:SECTOR_HEIGHT,platforms,walls,hazards,checkpoints,props,doors,ghosts,station,evidence,entry:{x:55,y:200},exit:{x:1830,y:1550},done};
}
// Discrete work changes collision, hazards and powered machinery together.
export function applyWork(world){
 const station=world.station;if(station.done)return false;station.done=true;
 if(!world.progress.mechanisms.includes(station.id))world.progress.mechanisms.push(station.id);
 for(const h of world.hazards)h.disabled=true;
 for(const d of world.doors)if(d.requires===station.id){d.locked=false;unlockDoor(d);}
 const powered=buildSector(world.floor,world.sector,world.progress.mechanisms).platforms.filter(p=>p.powered||p.id.endsWith('/permanent-return'));
 for(const p of powered)if(!world.platforms.some(q=>q.id===p.id))world.platforms.push(p);
 world.collisionIndex?.rebuild(world.platforms);
 return true;
}
