// Authored objects for the retained local baseline maps. Not the 10× expansion.
export const FLOOR_ITEMS=[
 [{x:176,y:211,kind:'valve'},{x:1860,y:150,kind:'valve'},{x:3788,y:138,kind:'valve'}],
 [{x:520,y:137,kind:'note'},{x:2074,y:96,kind:'note'},{x:4200,y:174,kind:'lunch'}],
 [{x:790,y:138,kind:'water'},{x:2702,y:112,kind:'water'},{x:4532,y:112,kind:'water'}]
];
export const FLOOR_HAZARDS=[
 [{x:930,w:34,type:'steam',day:true},{x:1540,w:38,type:'gear',day:true},{x:2280,w:36,type:'steam',day:true},{x:3120,w:42,type:'gear',day:true},{x:3480,w:34,type:'steam',day:true}],
 [{x:690,w:38,type:'copier',day:true},{x:1110,w:42,type:'wire',day:false},{x:2260,w:38,type:'copier',day:true},{x:3060,w:42,type:'wire',day:false},{x:3970,w:38,type:'copier',day:true}],
 [{x:970,w:42,type:'fan',day:true},{x:1880,w:44,type:'wire',day:false},{x:2900,w:42,type:'fan',day:true},{x:3740,w:44,type:'wire',day:false},{x:4690,w:42,type:'fan',day:true}]
];
export const FLOOR_GHOSTS=[
 [{x:1320,y:195,range:100,phase:'night',kind:'wanderer'},{x:2860,y:195,range:100,phase:'night',kind:'watcher',chaseRange:130}],
 [{x:1050,y:195,range:55,phase:'night',kind:'wanderer'},{x:2740,y:195,range:100,phase:'night',kind:'listener'},{x:3890,y:195,range:90,phase:null,kind:'watcher',moveSpeed:20}],
 [{x:1950,y:195,range:65,phase:'day',kind:'listener'},{x:2380,y:195,range:100,phase:null,kind:'watcher',moveSpeed:20},{x:4140,y:195,range:55,phase:'night',kind:'wanderer'}]
];
export const CHECKPOINTS=[
 [55,460,1220,1990,2510,3390,3940],
 [55,620,1000,1510,2170,2670,3020,3530,4320],
 [55,400,880,1340,1810,2190,2810,3180,3650,4640]
].map((xs,f)=>xs.map((x,i)=>({id:`lamp-${f}-${i}`,x,y:200})));
// Append-only checkpoint ID: existing saves keep their original lamp mapping.
CHECKPOINTS[1].push({id:'lamp-1-mezzanine',x:3930,y:98});
CHECKPOINTS[2].push({id:'lamp-2-antenna',x:2510,y:98});
export const EVIDENCE=[
 [{id:'fire-order',x:650,y:110},{id:'gary-lamp',x:2418,y:132}],
 [{id:'public-list',x:1968,y:130},{id:'handover',x:2570,y:140}],
 [{id:'evacuation',x:1725,y:98},{id:'emergency-circuit',x:3575,y:136}]
];
// Small authored, optional inspection alcove. Its reachable area must be measured,
// not multiplied by ten or presented as the six final subareas.
export function inspectionAlcove(floor){
 if(floor===1)return {platforms:[],walls:[],doors:[{id:'office-fire-door',x:3980,y:84,w:18,h:42,locked:false}]};
 if(floor!==0)return {platforms:[],walls:[],doors:[]};
 return {platforms:[
 {id:'alcove-step',x:470,y:74,w:65,phase:null,surface:'grate'},
 {id:'alcove-landing',x:370,y:22,w:88,phase:null,surface:'grate'},
 {id:'inspection-lift',x:250,y:22,w:72,phase:null,surface:'grate',motion:{y:-60,speed:.65}},
 {id:'alcove-top',x:120,y:-36,w:112,phase:null,surface:'grate'}
 ],walls:[{id:'inspection-wall',x:100,y:-100,w:12,h:64,solid:true,phase:null}],doors:[{id:'inspection-door',x:394,y:-20,w:16,h:42,locked:false}]};
}
