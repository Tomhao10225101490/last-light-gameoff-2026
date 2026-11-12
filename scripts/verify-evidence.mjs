// Fail rather than inherit claims from an earlier runtime or fixture.
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
const json=async p=>JSON.parse(await readFile(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const hashes={};for(const name of await readdir('dist'))hashes[name]=sha(await readFile(`dist/${name}`));
const reports={normal:'docs/evidence/expanded/normal-rc1-ready/attempt.json',complete:'docs/evidence/expanded/complete-rc1/attempt.json',revisit:'docs/evidence/expanded/revisit-rc1/report.json'};
const findings=[];for(const [name,path] of Object.entries(reports)){
 const r=await json(path);if(!r.passed)throw Error(`${name}: not passed`);for(const [file,hash] of Object.entries(hashes))if(r.hashes[file]!==hash)throw Error(`${name}: stale runtime ${file}`);
 if(name!=='revisit'){
  if(r.continuation)throw Error(`${name}: continuation is not a new-game run`);
  const end=r.log.find(e=>e.event==='ending')?.snapshot;if(end?.ending!==name||end.mechanisms.length!==18)throw Error(`${name}: incorrect ending or incomplete sections`);
  if(name==='complete'&&(end.evidence.length!==6||!end.events.includes('emergency-light')))throw Error('Complete ending requirements missing');
  const saved=r.log.find(e=>e.event==='stored-save-readback')?.data;if(!saved?.finished||saved.ending!==name)throw Error(`${name}: finish not saved`);
  findings.push({name,path,kind:r.kind,deaths:end.deaths,sections:18,evidence:end.evidence.length,seconds:(r.actions.at(-1).ms-r.actions[0].ms)/1000});
 }else findings.push({name,path,checks:r.log.map(e=>e.event)});
}
const space=await json('docs/evidence/expanded/space-summary.json');for(const [path,hash] of Object.entries(space.sources))if(sha(await readFile(path))!==hash)throw Error(`Space audit stale: ${path}`);
for(const c of space.chapters)if(c.screenRatio<10||c.standingSpaceRatio<10||c.sectors.some(s=>!s.stationReachable))throw Error(`Chapter ${c.chapter} failed geometry gate`);
const audio=await json('media/audio-metrics.json');if(audio.clippedSamples||audio.nonFiniteSamples)throw Error('Invalid audio render');
const report={status:'functional gates verified; subjective listening and external-device review pending',runtimeSha256:hashes,findings,space:space.chapters.map(c=>({chapter:c.chapter,screenRatio:c.screenRatio,standingSpaceRatio:c.standingSpaceRatio,occupiedScreens:c.finalScreens})),audio:{seconds:audio.duration,peakDb:audio.peakDb,clippedSamples:audio.clippedSamples,nonFiniteSamples:audio.nonFiniteSamples,subjectiveListening:audio.subjectiveListening},unverified:['subjective headphone/speaker listening','physical touch-device play','full Firefox/Safari run','final external art/design quality sign-off']};
await mkdir('docs/evidence/expanded/checks',{recursive:true});await writeFile('docs/evidence/expanded/checks/acceptance.json',JSON.stringify(report,null,2)+'\n');console.log(report.status);for(const f of findings)console.log(f.name,'passed',f.deaths==null?'':`${f.deaths} deaths`);
