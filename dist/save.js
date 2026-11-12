export const SAVE_KEY='last-light-v3',SCHEMA_VERSION=3;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||a));
const strings=v=>Array.isArray(v)?[...new Set(v.filter(x=>typeof x==='string'))]:[];
export function freshSave(){return {schemaVersion:SCHEMA_VERSION,worldRevision:2,sector:0,mechanisms:[],visitedSectors:[],floor:0,hp:3,lang:'en',chapterProgress:[[],[],[]],evidence:[],openedDoors:[],events:[],checkpointId:null,finished:false,resumeMode:'menu',ending:null,settings:{master:.8,music:.7,sfx:.85,reducedEffects:false}};}
export function normalizeSave(raw){
 const v=freshSave();if(!raw||typeof raw!=='object')return v;
 v.worldRevision=raw.worldRevision===2?2:1;v.sector=Math.floor(clamp(raw.sector,0,5));v.mechanisms=strings(raw.mechanisms);v.visitedSectors=strings(raw.visitedSectors);
 v.floor=Math.floor(clamp(raw.floor,0,2));v.lang=raw.lang==='zh'?'zh':'en';v.hp=clamp(raw.hp??3,1,3);
 v.chapterProgress=[0,1,2].map(f=>[0,1,2].map(i=>!!raw.chapterProgress?.[f]?.[i]));
 if(Array.isArray(raw.got))v.chapterProgress[v.floor]=[0,1,2].map(i=>!!raw.got[i]);
 v.evidence=strings(raw.evidence);v.openedDoors=strings(raw.openedDoors);v.events=strings(raw.events);v.finished=!!raw.finished;
 v.checkpointId=typeof raw.checkpointId==='string'?raw.checkpointId:null;v.resumeMode=raw.resumeMode==='between'&&v.floor<2?'between':'menu';v.ending=['normal','complete'].includes(raw.ending)?raw.ending:null;
 if(raw.settings&&typeof raw.settings==='object')for(const k of ['master','music','sfx'])v.settings[k]=clamp(raw.settings[k]??v.settings[k],0,1);
 v.settings.reducedEffects=!!raw.settings?.reducedEffects;return v;
}
export function loadSave(storage){
 const warnings=[];
 try{
  const current=storage.getItem(SAVE_KEY);if(current){const raw=JSON.parse(current);if(raw.schemaVersion>SCHEMA_VERSION||raw.worldRevision>2){warnings.push('future-schema');return {data:freshSave(),warnings,readOnly:true};}if(raw.worldRevision==null&&storage.getItem(`${SAVE_KEY}-before-expanded-world`)==null)storage.setItem(`${SAVE_KEY}-before-expanded-world`,current);return {data:normalizeSave(raw),warnings,readOnly:false};}
  for(const key of ['last-light-v2','last-light-v1']){const text=storage.getItem(key);if(!text)continue;
   const raw=JSON.parse(text);const backup=`${key}-backup-before-v3`;
   if(storage.getItem(backup)==null)storage.setItem(backup,text); // Backup must succeed before migration.
   const data=normalizeSave(raw);storage.setItem(SAVE_KEY,JSON.stringify(data));return {data,warnings:[`migrated:${key}`],readOnly:false};
  }
 }catch(e){warnings.push(`save-unavailable:${e.name}`);return {data:freshSave(),warnings,readOnly:true};}
 return {data:freshSave(),warnings,readOnly:false};
}
export function storeSave(storage,data){storage.setItem(SAVE_KEY,JSON.stringify(normalizeSave(data)));}
export function backupBeforeRestart(storage){const text=storage.getItem(SAVE_KEY);if(text!=null)storage.setItem(`${SAVE_KEY}-before-restart-${Date.now()}`,text);}
