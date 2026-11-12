// Component reachability audit using the real stepPlayer, NOT full gameplay proof.
// Controlled initial positions deliberately exercise every adjacent route segment.
import {level,createPlayer,stepPlayer} from '../dist/core.js';
import {writeFile,mkdir} from 'node:fs/promises';
import {OFFICE_BYPASS,ROOF_BYPASS} from './playtest-routes.mjs';
const routes=[
 [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
 Array.from({length:32},(_,i)=>i),Array.from({length:34},(_,i)=>i)
];
const result=[];
const variants=[...routes.map((route,floor)=>({route,floor,name:'original-route'})),{floor:1,route:OFFICE_BYPASS,name:'office-upper-route'},{floor:2,route:ROOF_BYPASS,name:'roof-upper-route'}];
for(const {floor,route,name} of variants){
 const map=level(floor),segments=[];
 for(let i=1;i<route.length;i++){
  const from=map[route[i-1]],to=map[route[i]],success=[];
  if(to.x<from.x+from.w&&to.y>=from.y){segments.push({from:route[i-1],to:route[i],kind:'overlapping/downstream',verified:false});continue;}
  for(let x=Math.max(from.x,to.x-108);x<Math.min(from.x+from.w-10,to.x-12);x+=3){
   let found=false;
   for(const changeAt of [0,12,24,36]){
    const p=createPlayer(x);p.y=from.y-28;p.vx=112;p.grounded=true;let night=from.phase==='night';if(!from.phase)night=to.phase==='night';
    for(let tick=0;tick<170;tick++){
     if(tick===changeAt&&to.phase)night=to.phase==='night';
     stepPlayer(p,{right:true,jump:tick===0},map,night,1/120);
     if(tick>3&&p.grounded&&p.x+12>to.x&&p.x<to.x+to.w&&Math.abs(p.y+28-to.y)<1){found=true;break;}
     if(p.y>330)break;
    }
    if(found)break;
   }
   if(found)success.push(x);
  }
  segments.push({from:route[i-1],to:route[i],successfulLaunchSamples:success.length,launchRange:success.length?[success[0],success.at(-1)]:null,verified:success.length>0});
 }
 result.push({chapter:floor+1,route:name,kind:'physics components; obstacles/enemies/interactions excluded',segments});
}
await mkdir('docs/evidence/current',{recursive:true});await writeFile('docs/evidence/current/jump-audit.json',JSON.stringify(result,null,2)+'\n');
const failed=result.flatMap(f=>f.segments.filter(s=>s.verified===false&&s.kind!=='overlapping/downstream').map(s=>({chapter:f.chapter,...s})));
console.log(JSON.stringify({checked:result.reduce((n,r)=>n+r.segments.filter(s=>s.successfulLaunchSamples!=null).length,0),failed},null,2));if(failed.length)process.exitCode=1;
