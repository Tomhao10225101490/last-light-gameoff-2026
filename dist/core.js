export const GRAVITY=560, SPEED=112, JUMP=-238;
export const FLOOR_WIDTHS=[4200,4550,4900];
const P=(x,y,w,phase=null,surface='concrete')=>({x,y,w,phase,surface});
const LEVELS=[
 [P(0,228,260),P(260,228,120,'night','grate'),P(380,228,310),P(470,193,62,'day','grate'),P(548,159,58,'night','grate'),P(625,126,76,null,'grate'),P(690,228,150,'day','grate'),P(840,228,250),P(1090,228,90,'night','grate'),P(1180,228,270),
  P(1450,228,180),P(1630,228,78,'day','grate'),P(1718,196,68,'night','grate'),P(1800,164,72,'day','grate'),P(1888,228,230),P(2118,228,105,'night','grate'),P(2223,228,240),P(2310,188,85,null,'grate'),P(2410,148,72,'night','grate'),P(2482,228,170),
  P(2652,228,70,'day','grate'),P(2730,198,66,'night','grate'),P(2812,168,68,'day','grate'),P(2898,138,72,'night','grate'),P(2988,228,270),P(3258,228,92,'night','grate'),P(3350,228,220),P(3570,228,78,'day','grate'),P(3665,190,76,'night','grate'),P(3760,152,84,null,'grate'),P(3844,228,356)],
 [P(0,228,300,null,'carpet'),P(300,228,85,'day','grate'),P(402,190,75,'night','grate'),P(495,152,78,null,'carpet'),P(573,228,220,null,'carpet'),P(793,228,115,'night','grate'),P(908,228,270,null,'carpet'),P(1178,228,70,'day','grate'),P(1262,194,74,'night','grate'),P(1350,160,80,'day','grate'),P(1445,228,250,null,'carpet'),
  P(1695,228,95,'night','grate'),P(1790,228,215,null,'carpet'),P(1840,185,92,null,'carpet'),P(1950,145,78,'day','grate'),P(2042,110,74,'night','grate'),P(2120,228,245,null,'carpet'),P(2365,228,72,'day','grate'),P(2450,192,76,'night','grate'),P(2540,156,82,null,'carpet'),P(2622,228,238,null,'carpet'),
  P(2860,228,110,'night','grate'),P(2970,228,240,null,'carpet'),P(3210,228,76,'day','grate'),P(3300,188,82,'night','grate'),P(3396,148,86,'day','grate'),P(3495,228,220,null,'carpet'),P(3715,228,90,'night','grate'),P(3805,228,250,null,'carpet'),P(4055,228,76,'day','grate'),P(4148,188,84,'night','grate'),P(4245,228,305,null,'carpet'),
  P(3650,194,68,null,'carpet'),P(3734,160,70,'day','grate'),P(3820,126,72,'night','grate'),P(3908,126,112,null,'carpet'),P(4028,160,34,'day','grate')],
 [P(0,228,240),P(240,228,100,'night','grate'),P(340,228,260),P(600,228,70,'day','grate'),P(685,190,72,'night','grate'),P(772,152,78,null,'grate'),P(850,228,260),P(1110,228,90,'night','grate'),P(1200,228,230),P(1430,228,75,'day','grate'),P(1520,190,76,'night','grate'),P(1610,152,78,'day','grate'),P(1705,114,82,null,'grate'),P(1787,228,260),
  P(2047,228,105,'night','grate'),P(2152,228,250),P(2402,228,74,'day','grate'),P(2490,194,76,'night','grate'),P(2580,160,80,'day','grate'),P(2675,126,84,'night','grate'),P(2770,228,270),P(3040,228,92,'day','grate'),P(3132,228,235),P(3367,228,74,'night','grate'),P(3455,190,80,'day','grate'),P(3550,152,84,null,'grate'),P(3634,228,255),
  P(3889,228,105,'night','grate'),P(3994,228,230),P(4224,228,74,'day','grate'),P(4312,194,78,'night','grate'),P(4404,160,82,'day','grate'),P(4500,126,86,'night','grate'),P(4600,228,300),
  P(2230,194,66,null,'grate'),P(2310,160,70,'day','grate'),P(2394,126,72,'night','grate'),P(2480,126,90,null,'grate')]
];
export function level(floor){const f=Math.max(0,Math.min(2,floor|0));return LEVELS[f].map((p,i)=>({...p,id:`chapter-${f}-platform-${i}`}));}
export const worldWidth=floor=>FLOOR_WIDTHS[Math.max(0,Math.min(2,floor|0))];
export const exitX=floor=>worldWidth(floor)-82;
export const active=(p,night)=>p.phase==null||p.phase===(night?'night':'day');
export function createPlayer(x=55){return {x,y:200,prevX:x,prevY:200,vx:0,vy:0,dir:1,grounded:true,coyote:.1,buffer:0,land:0,fallStart:200,checkpoint:x,prevVx:0,surface:'concrete',hp:3,maxHp:3,invulnerable:0,lifeState:'alive',lifeTime:0,anim:'idle',animTime:0,supportId:null};}
export function stepPlayer(p,input,platforms,night,dt,options={}){
 const out={jump:false,land:false,fall:0};const originX=p.x,originY=p.y;p.prevX=p.x;p.prevY=p.y;
 const support=platforms.find(q=>q.id&&q.id===p.supportId&&active(q,night));
 if(p.grounded&&support){p.x+=support.dx||0;p.y+=support.dy||0;}
 p.land=Math.max(0,p.land-dt);p.buffer=Math.max(0,p.buffer-dt);p.coyote=p.grounded?.1:Math.max(0,p.coyote-dt);p.invulnerable=Math.max(0,(p.invulnerable||0)-dt);if(input.jump)p.buffer=.13;
 const target=(Number(!!input.right)-Number(!!input.left))*SPEED*(input.walk?.48:1);p.prevVx+=(p.vx-p.prevVx)*Math.min(1,dt*10);p.vx+=(target-p.vx)*Math.min(1,dt*(p.grounded?20:12));if(Math.abs(p.vx)>5)p.dir=p.vx>0?1:-1;
 if(p.buffer>0&&p.coyote>0){p.vy=JUMP;p.buffer=0;p.coyote=0;p.grounded=false;p.supportId=null;out.jump=true;p.fallStart=p.y;}
 if(input.release&&p.vy<-85)p.vy=-85;
 const solids=[...platforms.filter(q=>q.solid),...(options.solids||[])].filter(q=>active(q,night));
 const maxX=options.width??Math.max(...platforms.map(q=>q.x+q.w),480);const oldX=originX;p.x=Math.min(maxX-18,Math.max(1,p.x+p.vx*dt));
 for(const q of solids){if(p.y+27<=q.y||p.y+1>=q.y+(q.h||18))continue;if(oldX+13<=q.x&&p.x+13>q.x){p.x=q.x-13;p.vx=0;}else if(oldX+1>=q.x+q.w&&p.x+1<q.x+q.w){p.x=q.x+q.w-1;p.vx=0;}}
 const oldFoot=originY+28,oldHead=p.y;p.vy+=GRAVITY*dt;p.y+=p.vy*dt;p.grounded=false;p.supportId=null;
 if(p.vy<0)for(const q of solids){const bottom=q.y+(q.h||18);if(p.x+12>q.x&&p.x+2<q.x+q.w&&oldHead>=bottom&&p.y<bottom){p.y=bottom;p.vy=0;}}
 if(p.vy>=0){const surfaces=[...platforms,...(options.solids||[])].filter(q=>active(q,night)).sort((a,b)=>a.y-b.y);
 for(const q of surfaces){if(p.x+12>q.x&&p.x+2<q.x+q.w&&oldFoot<=(q.prevY??q.y)+.8&&p.y+28>=q.y){p.y=q.y-28;p.grounded=true;p.supportId=q.id??null;p.surface=q.surface||'concrete';out.land=p.vy>85;out.fall=p.vy/390;p.vy=0;if(out.land)p.land=.13;break;}}}
 return out;
}
export function updateMovingPlatforms(platforms,time,dt){for(const p of platforms){if(!p.motion)continue;p.baseX??=p.x;p.baseY??=p.y;const oldX=p.x,oldY=p.y;p.prevY=oldY;const wave=Math.sin(time*p.motion.speed+(p.motion.offset||0));p.x=p.baseX+(p.motion.x||0)*wave;p.y=p.baseY+(p.motion.y||0)*wave;p.dx=p.x-oldX;p.dy=p.y-oldY;}}
export const intersects=(p,x,y,margin=8)=>p.x<x+margin&&p.x+14>x-margin&&p.y<y+margin&&p.y+28>y-margin;
