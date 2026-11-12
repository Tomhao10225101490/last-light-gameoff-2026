// Shared scale and real player physics for both archived local baseline and new
// sectors. This is component reachability, not enemy-aware whole-game proof.
import {createPlayer,stepPlayer} from '../dist/core.js';
import {level as baselineLevel} from '../docs/evidence/baseline/core-baseline.mjs';
import {buildSector} from '../dist/world.js';
import {CollisionIndex} from '../dist/spatial.js';
import {canShift} from '../dist/phase.js';
import {mkdir,writeFile,readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';

export function exploreGeometry(platforms,walls=[],width=1920){
 const nodes=[...platforms,...walls],byId=new Map(nodes.map(p=>[p.id,p])),index=new CollisionIndex(platforms);
 const reachable=new Set(),queue=[],edges=[];
 const first=platforms.find(p=>p.phase==null&&p.x<=55&&p.x+p.w>55&&p.y===228)||platforms[0];
 reachable.add(first.id);queue.push(first.id);
 for(let at=0;at<queue.length;at++){
  const source=byId.get(queue[at]);
  const xs=[0,.25,.5,.75,1].map(k=>source.x+3+(source.w-20)*k);
  for(const x of xs)for(const dir of [-1,1])for(const jump of [false,true])for(const change of [false,true])for(const walk of [false,true]){
   const p=createPlayer(x);p.y=source.y-28;p.prevY=p.y;p.supportId=source.id;
   if(walls.some(w=>p.x+13>w.x&&p.x+1<w.x+w.w&&p.y+27>w.y&&p.y+1<w.y+w.h))continue;
   p.vx=0; // Every edge starts from a genuinely stopped player.
   let night=source.phase==='night';
   const phaseWorld={player:p,mode:'playing',door:{phase:'closed'},night,shiftCooldown:0,platforms,walls,ghosts:[]};
   let airborne=false;
   for(let tick=0;tick<300;tick++){
    if(tick===10&&change){phaseWorld.night=night;if(canShift(phaseWorld,!night).ok)night=!night;}
    const near=index.query(p.x-40,p.y-20,p.x+60,p.y+65);
    stepPlayer(p,{left:dir<0,right:dir>0,jump:jump&&tick===0,walk},near,night,1/120,{width,solids:walls});
    if(!p.grounded)airborne=true;
    if(p.grounded&&p.supportId!==source.id){
     const target=byId.get(p.supportId);if(target){
      edges.push({from:source.id,to:target.id,x,dir,jump,night:source.phase==='night',change,walk,ticks:tick+1});
      if(!reachable.has(target.id)){reachable.add(target.id);queue.push(target.id);}
     }break;
    }
    if(jump&&airborne&&p.grounded||p.y>1800||Math.abs(p.vx)<.01&&tick>80)break;
   }
  }
 }
 return {reachable:[...reachable],edges,unreachable:nodes.filter(p=>!reachable.has(p.id)).map(p=>p.id)};
}
function intervalsUnion(xs){const sorted=xs.filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0]);const out=[];for(const [a,b] of sorted){const last=out.at(-1);if(last&&a<=last[1])last[1]=Math.max(last[1],b);else out.push([a,b]);}return out;}
export function measureSpace(platforms,reachable,walls=[]){
 const set=new Set(reachable),rows=new Map();
 for(const q of [...platforms,...walls])if(set.has(q.id)&&!q.motion){
  const y=Math.round(q.y);if(!rows.has(y))rows.set(y,[]);let pieces=[[q.x+7,q.x+q.w-7]];
  for(const wall of walls)if(y>wall.y&&y-28<wall.y+wall.h){const a=wall.x-7,b=wall.x+wall.w+7;pieces=pieces.flatMap(([l,r])=>r<=a||l>=b?[[l,r]]:[[l,Math.min(r,a)],[Math.max(l,b),r]].filter(([l,r])=>r>l));}
  rows.get(y).push(...pieces);
 }
 let walkablePixels=0;const tiles=new Map();
 for(const [y,pieces] of rows)for(const [l,r] of intervalsUnion(pieces)){
  walkablePixels+=r-l;for(let col=Math.floor(l/480);col<=Math.floor((r-.01)/480);col++){const key=`${col},${Math.floor(y/270)}`;tiles.set(key,(tiles.get(key)||0)+Math.max(0,Math.min(r,(col+1)*480)-Math.max(l,col*480)));}
 }
 return {walkablePixels,equivalent480pxRuns:walkablePixels/480,occupiedScreens:[...tiles].filter(([,n])=>n>=240).map(([id])=>id),screenRule:'480×270 grid; at least 240px reachable non-overlapping standing-centre intervals per cell; phase union, no moving-platform sweep counted'};
}
export async function audit(){
 const sources={};for(const file of ['dist/core.js','dist/world.js','dist/chapters.js','docs/evidence/baseline/core-baseline.mjs'])sources[file]=createHash('sha256').update(await readFile(file)).digest('hex');
 const report={kind:'component reachability and conservative standing-space metric; not full-game acceptance',sources,chapters:[]};
 for(let chapter=0;chapter<3;chapter++){
  const base=baselineLevel(chapter).map((p,i)=>({...p,id:`baseline-${chapter}-${i}`}));const baseGraph=exploreGeometry(base,[],[4200,4550,4900][chapter]),baseline=measureSpace(base,base.map(p=>p.id));
  const sectors=[];for(let n=0;n<6;n++){
   const world=buildSector(chapter,n),graph=exploreGeometry(world.platforms,world.walls);const metric=measureSpace(world.platforms,graph.reachable,world.walls);
   const stationPlatform=world.platforms.find(p=>p.phase==null&&p.x<=world.station.x&&p.x+p.w>world.station.x&&Math.abs(p.y-(world.station.y+14))<1);
   const changed=buildSector(chapter,n,[world.id]);const afterWork=exploreGeometry(changed.platforms.filter(p=>!p.motion),changed.walls);
   sectors.push({id:world.id,metric,stationReachable:graph.reachable.includes(stationPlatform?.id),...graph,afterWork});
   console.log(world.id,'reachable',graph.reachable.length,'/',world.platforms.length+world.walls.length,'screens',metric.occupiedScreens.length);
  }
  const finalPixels=sectors.reduce((n,s)=>n+s.metric.walkablePixels,0),finalScreens=sectors.reduce((n,s)=>n+s.metric.occupiedScreens.length,0);
  report.chapters.push({chapter:chapter+1,baseline:{...baseline,denominator:'all archived baseline surfaces, including unsampled components: conservative upper bound',unsampledComponents:baseGraph.unreachable},finalPixels,finalScreens,standingSpaceRatio:finalPixels/baseline.walkablePixels,screenRatio:finalScreens/baseline.occupiedScreens.length,sectors});
 }
 await mkdir('docs/evidence/expanded',{recursive:true});await writeFile('docs/evidence/expanded/space-audit.json',JSON.stringify(report)+'\n');
 await writeFile('docs/evidence/expanded/space-summary.json',JSON.stringify({kind:report.kind,sources,chapters:report.chapters.map(c=>({chapter:c.chapter,baseline:c.baseline,finalPixels:c.finalPixels,finalScreens:c.finalScreens,standingSpaceRatio:c.standingSpaceRatio,screenRatio:c.screenRatio,sectors:c.sectors.map(s=>({id:s.id,stationReachable:s.stationReachable,reachable:s.reachable.length,unsampled:s.unreachable,metric:s.metric}))}))},null,2)+'\n');
 console.log(JSON.stringify(report.chapters.map(({chapter,baseline,finalPixels,finalScreens,standingSpaceRatio,screenRatio})=>({chapter,baselinePixels:baseline.walkablePixels,baselineScreens:baseline.occupiedScreens.length,finalPixels,finalScreens,standingSpaceRatio,screenRatio})),null,2));return report;
}
if(process.argv[1]&&import.meta.url===new URL(process.argv[1],'file://').href)await audit();
