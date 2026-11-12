// Conservative broad phase; the original player solver remains authoritative.
export class CollisionIndex{
 constructor(platforms,cell=128){this.cell=cell;this.rebuild(platforms);}
 rebuild(platforms){this.buckets=new Map();this.dynamic=[];for(const p of platforms){if(p.motion){this.dynamic.push(p);continue;}for(let x=Math.floor(p.x/this.cell);x<=Math.floor((p.x+p.w)/this.cell);x++)for(let y=Math.floor((p.y-1)/this.cell);y<=Math.floor((p.y+(p.h||18))/this.cell);y++){const key=`${x},${y}`;if(!this.buckets.has(key))this.buckets.set(key,[]);this.buckets.get(key).push(p);}}}
 query(left,top,right,bottom){const set=new Set(this.dynamic);for(let x=Math.floor(left/this.cell);x<=Math.floor(right/this.cell);x++)for(let y=Math.floor(top/this.cell);y<=Math.floor(bottom/this.cell);y++)for(const p of this.buckets.get(`${x},${y}`)||[])set.add(p);return [...set];}
}
