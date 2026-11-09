export const W=1450, GRAVITY=560, SPEED=108, JUMP=-235;
export function level(floor){return [
{x:0,y:228,w:240,phase:null,surface:floor===1?'carpet':'concrete'},
{x:240,y:228,w:140,phase:'night',surface:'grate'},
{x:380,y:228,w:280,phase:null,surface:floor===1?'carpet':'concrete'},
{x:466,y:193,w:56,phase:'day',surface:'grate'},
{x:531,y:159,w:53,phase:'night',surface:'grate'},
{x:595,y:126,w:65,phase:null,surface:'grate'},
{x:660,y:228,w:150,phase:'day',surface:'grate'},
{x:810,y:228,w:250,phase:null,surface:floor===1?'carpet':'grate'},
{x:960,y:193,w:85,phase:'night',surface:'grate'},
{x:1060,y:228,w:130,phase:'night',surface:'grate'},
{x:1190,y:228,w:260,phase:null,surface:'concrete'}];}
export const active=(p,night)=>p.phase===null||p.phase===(night?'night':'day');
export function createPlayer(x=55){return {x,y:200,vx:0,vy:0,dir:1,grounded:true,coyote:.1,buffer:0,land:0,fallStart:200,checkpoint:x,prevVx:0,surface:'concrete'};}
export function stepPlayer(p,input,platforms,night,dt){
 const out={jump:false,land:false,fall:0};p.land=Math.max(0,p.land-dt);p.buffer=Math.max(0,p.buffer-dt);p.coyote=p.grounded?.1:Math.max(0,p.coyote-dt);if(input.jump)p.buffer=.13;
 const target=(Number(!!input.right)-Number(!!input.left))*SPEED;p.prevVx+=(p.vx-p.prevVx)*Math.min(1,dt*10);p.vx+=(target-p.vx)*Math.min(1,dt*(p.grounded?20:12));if(Math.abs(p.vx)>5)p.dir=p.vx>0?1:-1;
 if(p.buffer>0&&p.coyote>0){p.vy=JUMP;p.buffer=0;p.coyote=0;p.grounded=false;out.jump=true;p.fallStart=p.y;}
 if(input.release&&p.vy< -85)p.vy=-85;
 p.x=Math.min(W-18,Math.max(1,p.x+p.vx*dt));const oldFoot=p.y+28;p.vy+=GRAVITY*dt;p.y+=p.vy*dt;p.grounded=false;
 if(p.vy>=0){for(const q of platforms){if(active(q,night)&&p.x+12>q.x&&p.x+2<q.x+q.w&&oldFoot<=q.y+.8&&p.y+28>=q.y){p.y=q.y-28;p.grounded=true;p.surface=q.surface;out.land=p.vy>85;out.fall=p.vy/390;p.vy=0;if(out.land)p.land=.13;if(q.phase===null&&q.y===228)p.checkpoint=Math.min(q.x+q.w-22,Math.max(q.x+8,p.x));break;}}}
 return out;
}
export const intersects=(p,x,y,margin=8)=>p.x<x+margin&&p.x+14>x-margin&&p.y<y+margin&&p.y+28>y-margin;
