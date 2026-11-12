import {RAMPS} from './art.js';
import {phaseActive} from './phase.js';
import {sceneText} from './cinema.js';
const ACCENTS=['#d6ad74','#aec3a3','#9bbfc4'];
export function sectorBackdrop(a,s){
 const c=a.c,night=s.night,f=s.floor,open=f===2&&[3,4,5].includes(s.sector),base=night?['#26353b','#283c3c','#203544'][f]:['#52615a','#657265','#738c8b'][f];
 a.rect(0,0,480,246,base);
 if(open){for(let band=0;band<6;band++)a.rect(0,band*35,480,35,night?['#24384e','#293f55','#30495d','#3b5565','#486269','#526c6c'][band]:['#99b3ad','#abc1b5','#b7c9b7','#c7ceb5','#c6c5a5','#aeb79b'][band]);
  for(let i=-1;i<14;i++){const x=i*44-(s.camera*.12%44),h=20+(i*19+70)%55;a.rect(x,176-h,38,h,night?'#2b4352':'#6e8580');a.line(x+3,175-h,30,night?'#627a7c':'#9aa994');for(let n=0;n<3;n++)a.rect(x+6+n*9,183-h,2,4,night?'#d8ba83':'#b4bd9d');}
  if(night){a.rect(394-s.camera*.015,28,10,13,'#e3d6ab');a.rect(399-s.camera*.015,26,8,11,'#30495d');}
 }else{
  const ox=-Math.floor(s.camera*.16)%48,oy=-Math.floor(s.cameraY*.12)%34;
  for(let row=-1;row<9;row++)for(let col=-1;col<12;col++){const x=col*48+ox+(row%2?24:0),y=row*34+oy;a.line(x,y,47,night?'#3b5051':'#87917c');a.rect(x+47,y,1,33,night?'#20363b':'#465d56');if((row+col+s.sector)%4===0)a.line(x+11,y+23,13,night?'#34494c':'#697a67');}
 }
 c.globalAlpha=.12;a.rect(0,0,480,246,ACCENTS[f]);c.globalAlpha=1;
}
export function sectorDecor(a,s){
 const r=RAMPS,f=s.floor,accent=ACCENTS[f];
 for(const p of s.props||[]){const x=p.x-a.cam,y=p.y;if(x<-220||x>650||y<s.cameraY-150||y>s.cameraY+350)continue;
  // Furnishings sit behind the playable layer. No silhouette, support, glow or
  // marker is attached to a phase platform; inactive geometry is never consulted.
  a.box(x-170,y-123,332,19,r.iron);a.label(`${s.sector+1} / ${s.sectorData.spec.en.toUpperCase()}`,x-159,y-111,accent,6);
  if(f===0){
   if(s.sector===0){a.box(x-125,y-52,39,91,r.teal);a.line(x-119,y-33,26,r.iron[3]);a.rect(x-91,y-7,2,5,r.gold[1]);a.box(x+75,y-70,32,28,r.iron);a.label(s.night?'18:00':'17:59',x+79,y-54,r.gold[0],6);a.box(x-57,y+7,79,7,r.rust);}
   else if(s.sector===1){a.box(x-148,y-25,70,62,r.rust);a.box(x-74,y-49,64,86,r.iron);for(let k=0;k<3;k++){a.line(x-140,y-13+k*16,53,r.gold[2]);a.rect(x-67+k*16,y-39,4,58,r.iron[3]);}a.pipe(x+75,y-102,9,139,true);}
   else if(s.sector===2||s.sector===5){a.box(x-105,y-81,96,118,r.teal);a.box(x-97,y-68,80,27,r.iron);for(let k=0;k<6;k++)a.rect(x-91+k*12,y-60,3,12,r.rust[2]);a.valve(x-56,y-17,12);a.pipe(x+30,y-116,12,153,true);a.pipe(x+42,y-53,86,7);a.box(x+73,y-74,25,16,r.gold);a.label(s.station.done?'SAFE':'PSI',x+77,y-63,r.gold[3],6);}
   else if(s.sector===3){a.box(x-95,y-100,60,135,r.iron);a.rect(x-86,y-91,42,113,'#315464');const h=s.station.done?78:25;a.rect(x-84,y+20-h,38,h,'#6f9d9d');a.pipe(x+24,y-104,9,139,true);a.fan(x+86,y-40,18);}
   else{a.pipe(x-150,y-95,315,8);a.box(x-87,y-76,70,30,r.iron);a.line(x-80,y-65,56,r.gold[2]);a.rect(x-88,y-43,3,75,r.iron[2]);a.rect(x-20,y-43,3,75,r.iron[3]);a.box(x+57,y-48,45,82,r.teal);}
  }else if(f===1){
   if(s.sector===0||s.sector===1){a.desk(x-130,y+20,0);a.desk(x+35,y+20,1);a.box(x-38,y-95,42,105,r.teal);a.label('DUTY',x-32,y-77,r.cloth[0],6);}
   else if(s.sector===2){for(let i=0;i<4;i++){a.box(x-147+i*76,y-90,60,121,r.teal);for(let j=0;j<5;j++){a.line(x-141+i*76,y-73+j*21,47,r.iron[3]);a.rect(x-126+i*76,y-77+j*21,14,3,r.gold[1]);}}a.label('2014 / FIRE RECORDS',x-105,y-99,r.cloth[0],6);}
   else if(s.sector===3){a.box(x-135,y-24,100,60,r.cloth);a.box(x+32,y-58,65,93,r.teal);a.rect(x+48,y-25,18,2,r.iron[3]);a.box(x-63,y-41,16,15,r.blue);a.rect(x-130,y-29,83,3,r.gold[0]);}
   else if(s.sector===4){a.box(x-110,y-92,56,126,r.iron);a.rect(x-104,y-84,44,112,'#233943');a.box(x+49,y-82,55,116,r.rust);a.label('RELEASE',x+53,y-61,r.gold[0],6);a.rect(x+68,y-27,7,30,r.iron[2]);a.rect(x+62,y-29,20,6,r.gold[1]);if(s.night)for(let i=0;i<5;i++)a.rect(x-42+i*8,y-84+i*15,10,28,'#283b3e');}
   else{a.desk(x-111,y+19,0);a.box(x+57,y-90,58,125,r.rust);a.box(x+65,y-81,41,16,r.gold);a.label('GARY',x+70,y-69,r.gold[3],7);a.rect(x+96,y-27,4,3,r.gold[0]);a.label('ONE MORE SHIFT?',x-125,y-83,r.cloth[0],6);}
  }else{
   if(s.sector===0){a.box(x-125,y-67,105,101,r.iron);a.fan(x-75,y-21,28);a.pipe(x+20,y-115,13,150,true);}
   else if(s.sector===1){a.box(x-89,y-115,112,147,r.iron);a.rect(x-80,y-105,94,126,'#315664');const level=s.station.done?93:29;a.rect(x-77,y+16-level,88,level,'#77a39e');a.pipe(x+61,y-95,10,128,true);a.label('RESERVOIR',x-64,y-83,r.cloth[0],6);}
   else if(s.sector===2){a.box(x-148,y+15,287,21,r.rust);for(let n=0;n<5;n++){const px=x-129+n*52,grown=s.station.done;a.box(px,y+7,27,14,r.teal);a.rect(px+12,y-(grown?44:9),3,grown?53:18,r.cloth[2]);a.rect(px+(n%2?3:15),y-(grown?29:3),13,5,grown?r.cloth[0]:r.cloth[2]);if(grown)a.box(px+9,y-50,9,8,r.gold);}}
   else if(s.sector===3){a.pipe(x-120,y-107,9,141,true);a.pipe(x+94,y-107,9,141,true);a.line(x-120,y-99,221,r.iron[2]);a.box(x-55,y-63,83,28,r.iron);a.label('FIRE STAIRS >',x-49,y-46,r.gold[0],6);}
   else if(s.sector===4){a.rect(x-5,y-124,5,158,r.iron[2]);for(let n=0;n<5;n++){a.line(x-74+n*9,y-111+n*22,149-n*18,r.iron[0]);a.rect(x-74+n*9,y-111+n*22,2,6,r.rust[1]);}a.box(x-119,y-42,62,74,r.iron);}
   else{a.box(x-97,y-94,58,128,r.iron);a.rect(x-89,y-86,42,112,'#253a43');a.label('HOME',x-84,y-65,r.gold[0],7);a.pipe(x+66,y-105,8,139,true);a.box(x+48,y-116,45,16,r.gold);if(s.events.includes('emergency-light'))a.glow(x+70,y-109,90,110,'#f5d69c',.1);}
  }
 }
}
export function memoryPerson(a,p){
 const x=p.x-a.cam,y=p.y,walk=Math.sin(a.t*9+p.x*.03)*2,col=p.shade==='gary'?RAMPS.cloth:RAMPS.blue;
 a.c.save();a.c.globalAlpha=p.shade==='gary'?.8:.47;
 a.box(x+2,y+4,9,8,RAMPS.skin);a.box(x+1,y+12,12,11,col);a.rect(x+2+walk,y+23,4,5,col[3]);a.rect(x+9-walk,y+23,4,5,col[3]);a.rect(x-2,y+(p.pose==='hold'?7:15),4,p.pose==='hold'?14:9,col[1]);a.rect(x+12,y+15,3,9,col[1]);
 if(p.shade==='gary'){a.box(x+1,y+1,12,4,RAMPS.cloth);a.line(x+2,y+1,8,RAMPS.gold[0]);}if(p.lunch)a.box(x+14,y+18,11,8,RAMPS.gold);a.c.restore();
}
export function sectorActors(a,s){
 const station=s.station,x=station.x-a.cam,y=station.y;
 if(station.kind==='water'||station.kind==='growth'){a.box(x-8,y-5,16,18,RAMPS.blue);a.pipe(x+8,y-4,10,4);}
 else if(station.scene==='phone'){a.box(x-13,y-3,26,11,RAMPS.iron);a.rect(x-15,y-9,30,5,RAMPS.rust[station.done?2:0]);}
 else if(['archive','handover'].includes(station.kind)){a.box(x-10,y-8,20,23,RAMPS.cloth);a.label(station.done?'OK':'?',x-4,y+6,RAMPS.cloth[3],7);}
 else a.valve(x,y,10);
 a.label(station.done?'DONE':'[E]',x-10,y-18,station.done?'#adc7a7':'#f2d397',6);
 for(const p of s.echoes||[])if(phaseActive(p,s.night)&&Math.abs(p.y-s.player.y)<280)memoryPerson(a,{...p,shade:'echo',pose:'waiting'});
 if(s.pursuit?.active)a.ghost({xNow:s.pursuit.x,yNow:s.pursuit.y,spawned:true,kind:'watcher',state:'chase',seed:0,facing:1},true);
 if(s.scene){for(const p of s.scene.actors)memoryPerson(a,p);const k=Math.min(1,s.scene.time/2);
  if(s.scene.id==='lunchbox'){const px=s.scene.origin.x-a.cam+17+(s.scene.beat>1?68:s.scene.beat===1?68*k:0);a.box(px,s.scene.origin.y+20,13,8,RAMPS.gold);}
  if(s.scene.id==='fire-door'){const p=s.scene.origin;a.swingDoor({x:p.x+88,y:p.y-13,w:29,h:42,openness:s.scene.beat>1?1:s.scene.beat===1?k:0});}
 }
}
export function cinemaOverlay(a,s){
 if(!s.scene)return;a.rect(0,0,480,14,'#182c33');a.label('17:59 / 18:00  ·  A MEMORY, NOT A CURSE',13,10,'#b9bba4',6);
 const lines=a.wrap(sceneText(s),442,8),h=Math.max(35,lines.length*12+13),top=244-h;a.rect(8,top,464,h,'#152b32f2');a.line(8,top,464,'#ad9b72');lines.forEach((line,i)=>a.label(line,18,top+14+i*12,'#e7dfbb',8));
}
