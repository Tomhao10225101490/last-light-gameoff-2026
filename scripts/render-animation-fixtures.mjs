// Component-state animation evidence. Initial state control is declared and must
// not be used as full-game playthrough evidence.
import {createCanvas} from '@napi-rs/canvas';import {mkdir,writeFile} from 'node:fs/promises';import {Simulation} from '../dist/simulation.js';import {Art} from '../dist/art.js';
const root='docs/evidence/components';await mkdir(root,{recursive:true});
const manifest={kind:'controlled component fixtures, not input playthrough',sequences:[]};
for(const kind of ['ghost','fall','hazard']){
 const s=new Simulation();s.start();s.player.x=700;s.camera=520;s.checkpointId='lamp-0-2';if(kind==='ghost'){s.night=true;s.phaseMix=1;s.ghosts[0].xNow=s.player.x+12;s.ghosts[0].yNow=s.player.y+14;s.ghosts[0].spawned=true;}s.beginDeath(kind,s.ghosts[0]);const frames=[];
 for(let frame=0;frame<18;frame++){const canvas=createCanvas(480,270);new Art(canvas).render(s,0);const name=`${kind}-${String(frame).padStart(2,'0')}.png`;await writeFile(`${root}/${name}`,canvas.toBuffer('image/png'));frames.push({file:name,time:frame/10,state:s.player.lifeState});for(let tick=0;tick<12;tick++)s.step({});}
 manifest.sequences.push({name:kind,frames});
}
const s=new Simulation();s.start();s.items.forEach(i=>i.got=true);s.player.x=s.exitX-10;s.camera=s.exitX-240;s.interact();const frames=[];
for(let frame=0;frame<15;frame++){const canvas=createCanvas(480,270);new Art(canvas).render(s,0);const name=`lift-${String(frame).padStart(2,'0')}.png`;await writeFile(`${root}/${name}`,canvas.toBuffer('image/png'));frames.push({file:name,time:frame/10,state:s.door.phase});for(let tick=0;tick<12;tick++)s.step({});}manifest.sequences.push({name:'lift',frames});
await writeFile(`${root}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');console.log(`Rendered declared component sequences in ${root}`);
