// Test navigation only. Runtime never consumes these routes or moves a player.
export const OFFICE_BYPASS=[26,32,33,34,35,36,29,30,31];
export const ROOF_BYPASS=[15,34,35,36,37,18,19];
export function routesFor(complete=false){return [
 complete?Array.from({length:31},(_,i)=>i):[0,1,2,6,7,8,9,10,11,12,13,14,15,16,19,20,21,22,23,24,25,26,27,28,29,30],
 [...Array.from({length:26},(_,i)=>i),...OFFICE_BYPASS],
 [...Array.from({length:15},(_,i)=>i),...ROOF_BYPASS,...Array.from({length:14},(_,i)=>i+20)]
];}
