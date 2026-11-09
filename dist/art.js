// Native 480×270 pixel artwork. Four-value ramps, one upper-left light.
// No per-pixel noise: wear marks are deterministic connected clusters.
export const RAMPS={teal:['#9db8a1','#628e82','#355c59','#193c40'],brick:['#b4a782','#7c8069','#4e6259','#263f40'],iron:['#adb9a0','#6d9189','#3e6264','#1d3c43'],rust:['#e4bb78','#b17d54','#754f3e','#403b35'],gold:['#ffdfa0','#dcad66','#946e49','#513f37'],blue:['#a6c2bd','#648e98','#3d5b70','#243b4b'],cloth:['#d4d2a0','#9ba97e','#657b62','#354e48'],skin:['#ffe0a2','#dfb57b','#aa7955','#654d3c']};
const blend=(a,b,t)=>{const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);return '#'+[16,8,0].map(s=>Math.round(((x>>s)&255)*(1-t)+((y>>s)&255)*t).toString(16).padStart(2,'0')).join('');};
export class Art{
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d',{alpha:false});this.c.imageSmoothingEnabled=false;this.t=0;this.n=0;this.cam=0;}
 rect(x,y,w,h,col){this.c.fillStyle=col;this.c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
 line(x,y,w,col){this.rect(x,y,w,1,col);}
 box(x,y,w,h,r){this.rect(x,y,w,h,r[3]);this.rect(x,y,w-1,h-1,r[1]);this.line(x,y,w-1,r[0]);this.rect(x,y,1,h-1,r[0]);this.rect(x+w-2,y+1,1,h-2,r[2]);this.line(x+1,y+h-2,w-2,r[2]);}
 label(s,x,y,color='#e9d8a7',size=6){this.c.fillStyle=color;this.c.font=`${size}px monospace`;this.c.fillText(s,Math.round(x),Math.round(y));}
 glow(x,y,rx,ry,color='#efc679',alpha=.15){const c=this.c;c.save();c.globalCompositeOperation='lighter';c.globalAlpha=alpha;c.translate(x,y);c.scale(rx,ry);let g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,color);g.addColorStop(1,'#102c3000');c.fillStyle=g;c.beginPath();c.arc(0,0,1,0,Math.PI*2);c.fill();c.restore();}
 pipe(x,y,w,h,vertical=false,r=RAMPS.iron){this.box(x,y,w,h,r);if(vertical){for(let yy=y+12;yy<y+h;yy+=36){this.rect(x-2,yy,w+4,4,r[3]);this.rect(x-2,yy,w+3,1,r[0]);this.rect(x+1,yy+5,2,6,RAMPS.rust[2]);this.rect(x+2,yy+9,1,5,RAMPS.rust[3]);}}else{for(let xx=x+18;xx<x+w;xx+=43){this.rect(xx,y-2,4,h+4,r[3]);this.rect(xx,y-2,1,h+3,r[0]);this.rect(xx+1,y+h+2,2,5,RAMPS.rust[2]);}}}
 valve(x,y,r=9){const k=r/9;const rr=(dx,dy,w,h,col)=>this.rect(x+dx*k,y+dy*k,Math.max(1,w*k),Math.max(1,h*k),col);const p=RAMPS.rust;
   rr(-5,-9,10,3,p[1]);rr(-8,-6,3,12,p[1]);rr(-5,6,10,3,p[3]);rr(5,-6,3,12,p[3]);rr(-7,-7,3,3,p[0]);rr(5,-7,3,3,p[1]);rr(-7,5,3,3,p[2]);rr(5,5,3,3,p[3]);rr(-4,-8,8,1,p[0]);rr(-7,-4,1,8,p[0]);
   for(let k=0;k<4;k++){const a=k*Math.PI/2+.4;for(let d=1;d<r-2;d++)this.rect(x+Math.cos(a)*d,y+Math.sin(a)*d,2,2,k<2?p[2]:p[1]);}this.box(x-2,y-2,4,4,RAMPS.gold);}
 window(x,y,w,h,id){const c=this.c,n=this.n;this.box(x-3,y-3,w+6,h+6,RAMPS.iron);const day=['#cfcd9d','#aebd9b','#90a89d','#718d8c'],night=['#536c81','#405c70','#304a61','#243d51'];this.rect(x,y,w,h,blend(day[1],night[2],n));for(let j=0;j<4;j++){this.rect(x,y+j*h/4,w,h/4,blend(day[j],night[j],n));}
   // Restrained checker dithering only along broad sky band boundaries.
   for(let k=0;k<2;k++)for(let xx=0;xx<w;xx+=2)this.rect(x+xx+(k%2),y+h/2+k,1,1,blend(day[1],night[1],n));
   this.rect(x+8,y+14,w/2,3,blend('#e2ddbd','#526e7b',n));this.rect(x+13+(this.t*1.2+id*11)%(w-24),y+10,14,2,blend('#e8dfb9','#526d79',n));
   for(let k=0;k<5;k++){let yy=y+h-13-(k*7+id*13)%20;this.rect(x+k*18-4,yy,20,h-(yy-y),blend('#748b81','#243e50',n));this.rect(x+k*18-2,yy-2,16,2,blend('#a0a58b','#3d5365',n));for(let z=0;z<3;z++){this.rect(x+k*18+z*5,yy+5,2,3,blend('#c5bb83','#e8c27b',n));}}
   if(n>0){c.globalAlpha=n;this.rect(x+w-20,y+8,7,7,'#e6dfad');this.rect(x+w-17,y+6,5,7,night[0]);c.globalAlpha=1;}
   this.rect(x+w/2-1,y,3,h,RAMPS.iron[3]);this.line(x,y+h/2,w,RAMPS.iron[2]);this.rect(x-2,y+h,w+4,4,RAMPS.iron[3]);this.line(x-2,y+h,w+4,RAMPS.iron[0]);}
 fan(x,y,r=13){this.box(x-r-3,y-r-3,r*2+6,r*2+6,RAMPS.iron);this.rect(x-r,y-r,r*2,r*2,RAMPS.iron[3]);for(let k=0;k<4;k++){const angle=this.t*(1-this.n*.94)*5+k*Math.PI/2;for(let d=2;d<r-1;d++){const bx=x+Math.cos(angle)*d,by=y+Math.sin(angle)*d;this.rect(bx-1,by-1,4,4,RAMPS.iron[k<2?2:1]);if(d%2===0)this.rect(bx-1,by-1,2,1,RAMPS.iron[0]);}}this.box(x-2,y-2,4,4,RAMPS.rust);this.rect(x-r,y-r,1,r*2,RAMPS.iron[0]);}
 desk(x,y,id){this.box(x,y,56,5,RAMPS.rust);this.rect(x+3,y+5,3,23,RAMPS.iron[2]);this.rect(x+48,y+5,3,23,RAMPS.iron[3]);this.box(x+34,y+6,16,20,RAMPS.teal);this.line(x+37,y+12,10,RAMPS.teal[3]);this.rect(x+39,y+10,4,1,RAMPS.gold[1]);this.box(x+4,y-15,19,13,RAMPS.iron);this.rect(x+6,y-13,14,8,blend('#aac49b','#476364',this.n));this.label(id%2?'17:59':'SAVE',x+7,y-7,'#436660',4);this.rect(x+11,y-2,4,2,RAMPS.iron[2]);for(let i=0;i<3;i++){this.rect(x+28+i%2,y-2-i*2,15-i*2,2,i===2?'#d4cda9':'#a9ad92');this.line(x+30,y-3-i*2,8,'#eef0cc');}this.box(x+45,y-8,5,7,RAMPS.gold);}
 lamp(x,y){this.rect(x-1,y-18,2,17,RAMPS.iron[3]);this.box(x-10,y,21,4,RAMPS.iron);this.rect(x-7,y+4,15,2,blend('#e7ddb0','#ffdda2',this.n));if(this.n>.05){this.glow(x,y+6,40,16,'#efd293',.24*this.n);this.glow(x,y+58,55,39,'#efb968',.17*this.n);}}
 wall(floor,cam){const r=RAMPS.brick;this.rect(0,0,480,270,blend('#526e66','#233e45',this.n));const par=cam*.24;for(let row=0;row<7;row++)for(let i=-1;i<18;i++){const v=(i*7+row*11+30)%3,x=i*36-(par%36)+(row%2?18:0),y=row*32;this.rect(x,y,35,31,blend([r[1],'#78816b','#737d68'][v],['#344e4d','#314b4b','#2d484a'][v],this.n));this.line(x,y,35,blend('#919781','#3c5753',this.n));this.rect(x+34,y+1,1,30,blend(r[2],r[3],this.n));if(v===1){this.rect(x+24,y+20,6,2,blend('#637261','#294448',this.n));this.rect(x+26,y+18,4,2,blend('#637261','#294448',this.n));}if(v===2){this.line(x+3,y+4,10,blend('#9a9d80','#47605a',this.n));}}
   if(floor===2){for(let band=0;band<5;band++)this.rect(0,band*31,480,31,blend(['#a7baa3','#b7c4a6','#c6cba5','#cfd0a7','#b8b99b'][band],['#233a51','#293f56','#30495d','#3b5565','#4c676d'][band],this.n));
   for(let i=-1;i<14;i++){const x=i*43-((cam*.12)%43),h=25+(i*17+80)%44;this.rect(x,153-h,37,h,blend('#738d88','#233f51',this.n));this.line(x+2,151-h,29,blend('#9aa494','#3d5965',this.n));for(let j=0;j<3;j++)this.rect(x+7+j*8,160-h,3,5,blend('#b8b38b','#dfbd7b',this.n));}
   this.rect(0,153,480,59,blend('#7b8d7a','#3a5455',this.n));this.line(0,153,480,blend('#b5b79b','#778c80',this.n));
   const moonX=345-cam*.035;this.c.globalAlpha=this.n;this.rect(moonX,22,13,16,'#e0dcb1');this.rect(moonX-2,25,17,10,'#e0dcb1');this.rect(moonX+5,21,9,13,'#30495d');this.c.globalAlpha=1;
   this.rect(30+(this.t*2)%450,52,35,3,blend('#e4dfba','#536b77',this.n));this.rect(37+(this.t*2)%450,49,18,3,blend('#e4dfba','#536b77',this.n));}
   // Far layer: same windows in two shifts, changing skyline and offices.
   for(let i=-1;floor!==2&&i<7;i++){let x=i*116-((cam*.12)%116)+23;this.window(x,31,76,floor===2?92:66,i+5);}
   // Mid layer: pipes, fans, desks. Different dressing on every floor.
   const mid=cam*.56;for(let i=-1;i<7;i++){const x=i*142-(mid%142);if(floor===0){this.pipe(x+12,7,8,203,true);this.pipe(x+20,111,100,6);this.valve(x+16,139);const variant=((i%3)+3)%3;this.box(x+56,variant===1?144:131,66,variant===1?64:77,variant===2?RAMPS.iron:RAMPS.teal);this.box(x+62,variant===1?151:143,53,variant===1?19:29,RAMPS.iron);this.rect(x+66,variant===1?154:147,45,variant===1?11:21,RAMPS.iron[3]);for(let k=0;k<6;k++)this.rect(x+70+k*7,variant===1?155:151,2,variant===1?8:13,RAMPS.rust[2]);this.label(['PRESSURE','HOT WATER','UNIT 03'][variant],x+70,185,'#adc3a1',5);if(variant===0){this.box(x+80,120,16,12,RAMPS.iron);this.valve(x+88,126,4);}if(variant===1){this.pipe(x+72,125,8,19,true);this.rect(x+102,192,7,7,RAMPS.rust[2]);this.rect(x+99,196,4,5,RAMPS.rust[2]);}if(variant===2){this.box(x+68,190,21,10,RAMPS.rust);this.label('03',x+72,197,RAMPS.gold[0],5);}this.rect(x+70,190,20,3,RAMPS.gold[2]);this.box(x+97,180,11,11,RAMPS.iron);this.line(x+99,185,7,RAMPS.gold[1]);this.rect(x+60,variant===1?144:131,60,2,RAMPS.teal[0]);for(let k=0;k<3;k++)this.rect(x+65+k*11,201,7,2,RAMPS.rust[2]);}
     else if(floor===1){this.desk(x+20,200,i);this.pipe(x,12,142,4);if(i===2){this.box(x+98,119,35,90,RAMPS.rust);this.box(x+103,128,25,11,RAMPS.gold);this.label('GARY',x+106,136,RAMPS.gold[3],6);this.rect(x+124,169,3,2,RAMPS.gold[0]);this.label('BACK MON.',x+103,153,'#c1b78d',4);}}
     else{this.box(x+20,156,75,54,RAMPS.iron);if(i%2===0)this.fan(x+56,180,19);else{for(let v=0;v<6;v++){this.box(x+26,161+v*7,62,4,RAMPS.iron);}this.pipe(x+38,136,8,20,true);}this.pipe(x+98,130,12,80,true);this.pipe(x+92,127,25,6);this.box(x+16,207,83,5,RAMPS.rust);}}
   for(let i=0;i<5;i++){let x=i*143-((cam*.38)%143)+60;this.lamp(x,18);const c=this.c;c.strokeStyle=RAMPS.iron[3];c.lineWidth=2;c.beginPath();c.moveTo(x-43,0);c.quadraticCurveTo(x-30+Math.sin(this.t*.8+i)*3,38,x-15,4);c.stroke();}
   this.rect(0,212,480,30,blend('#3e5c54','#203c40',this.n));this.line(0,213,480,blend('#87947b','#435b54',this.n));
 }
 platform(p){const {x,y,w,phase,surface}=p,xx=x-this.cam,c=this.c;const active=phase===null||phase===(this.n>.5?'night':'day');if(xx>500||xx+w< -20)return;c.save();if(!active)c.globalAlpha=.2;const r=phase==='night'?RAMPS.blue:phase==='day'?RAMPS.gold:RAMPS.iron;
   if(phase){this.box(xx,y,w,7,r);for(let k=0;k<w-6;k+=12){this.rect(xx+3+k,y+3,6,2,r[2]);this.rect(xx+3+k,y,3,1,r[0]);}if(!active){this.label(phase==='night'?'NIGHT':'DAY',xx+3,y-4,r[0],5);this.rect(xx,y+9,w,1,r[1]);}}
   else{this.box(xx,y,w,18,surface==='carpet'?RAMPS.teal:RAMPS.iron);this.rect(xx+1,y+3,w-2,4,blend('#798b77','#4c685e',this.n));for(let k=0;k<w;k+=24){const variant=Math.floor((x+k)/24)%3;this.line(xx+k+3,y+2,variant===0?14:variant===1?8:18,'#b4b79a');this.rect(xx+k+19,y+8,3,3,RAMPS.iron[3]);this.rect(xx+k+19,y+8,2,1,RAMPS.rust[0]);this.rect(xx+k+20,y+11,2,4,RAMPS.rust[2]);if(surface==='grate'){for(let j=0;j<3;j++)this.rect(xx+k+3+j*5,y+7,2,7,RAMPS.iron[3]);}else if(variant===1){this.rect(xx+k+5,y+12,9,2,RAMPS.iron[3]);this.rect(xx+k+8,y+10,6,3,RAMPS.iron[3]);}}}
   c.restore();}
 item(item,index){if(item.got)return;const x=item.x-this.cam,y=item.y+Math.sin(this.t*2+index)*2;this.glow(x,y,15,15,'#f3c982',.16);if(item.kind==='valve'){this.valve(x,y,6);}else if(item.kind==='lunch'){this.box(x-6,y-4,13,10,RAMPS.gold);this.box(x-2,y-7,5,3,RAMPS.iron);this.rect(x-5,y-1,11,2,RAMPS.rust[2]);}else if(item.kind==='water'){this.box(x-5,y-4,10,10,RAMPS.blue);this.rect(x+5,y-4,6,2,RAMPS.blue[0]);this.rect(x+9,y-6,3,3,RAMPS.blue[1]);this.rect(x-2,y-7,5,2,RAMPS.blue[0]);}else{this.box(x-5,y-6,10,13,RAMPS.cloth);this.line(x-3,y-2,6,RAMPS.cloth[2]);this.line(x-3,y+1,5,RAMPS.cloth[2]);}
   this.rect(x-1,y-14,2,2,RAMPS.gold[0]);this.label(''+(index+1),x-1,y-18,'#e5d6a4',5);
 }
 player(p){const c=this.c,x=Math.round(p.x-this.cam),y=Math.round(p.y),t=this.t;let frame=0,squash=0,bob=0,legs=[0,0],arm=0;
   if(p.land>0){squash=p.land>.07?2:1;}else if(!p.grounded){frame=p.vy<0?10:11;legs=p.vy<0?[-3,1]:[2,-2];arm=p.vy<0?-4:2;}else if(Math.abs(p.vx)>5){frame=Math.floor(t*11)%6;legs=[[-3,3],[-2,1],[0,0],[3,-3],[1,-2],[0,0]][frame];bob=[0,-1,-2,0,-1,-2][frame];arm=legs[0];}else{frame=Math.floor(t*2)%4;bob=frame===2?-1:0;}
   c.save();c.translate(x+7,y+28);c.scale(p.dir,1);c.translate(-7,-28+squash+bob);this.rect(0,26,15,2,'#193e3f');
   this.box(2+legs[0],21,5,6-squash,RAMPS.blue);this.box(8+legs[1],21,5,6-squash,RAMPS.blue);this.box(1+legs[0],26-squash,7,2,RAMPS.rust);this.box(8+legs[1],26-squash,7,2,RAMPS.rust);
   this.box(2,12,11,11-squash,RAMPS.blue);this.rect(3,12,3,9-squash,RAMPS.blue[0]);this.rect(6,15,5,5,RAMPS.blue[2]);this.line(5,16,5,RAMPS.blue[0]);this.box(0,13+arm/2,4,8,RAMPS.cloth);this.box(11,13-arm/2,4,8,RAMPS.cloth);this.box(12,19-arm/2,3,4,RAMPS.skin);
   this.box(3,4,10,9,RAMPS.skin);this.rect(3,4,3,6,RAMPS.skin[2]);this.rect(9,8,5,3,RAMPS.skin[1]);this.rect(7,11,5,2,RAMPS.skin[2]);if(!(frame===3&&p.grounded&&Math.abs(p.vx)<5)){this.rect(10,7,2,2,RAMPS.blue[3]);}else this.line(10,8,2,RAMPS.skin[3]);
   const lag=this.capLag||0;this.capLag=Math.abs(p.vx)>5?Math.sin(t*11):0;this.box(2,1,11,4,RAMPS.cloth);this.line(3,1,7,RAMPS.cloth[0]);this.box(9+lag,4,7,2,RAMPS.cloth);this.box(12+lag,3,3,3,RAMPS.gold);
   const key=this.keyLag||0;this.keyLag=Math.sin(t*5-(p.prevVx??0)*.008)*2;this.rect(4,21,1,4,RAMPS.gold[1]);this.rect(4+key,24,3,2,RAMPS.gold[0]);this.rect(-2,16+Math.sin(t*2),2,7,RAMPS.rust[1]);this.rect(-4,22+Math.sin(t*2),5,3,RAMPS.cloth[2]);
   c.restore();
   if(this.n>.05){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.12*this.n;let hx=x+(p.dir===1?19:-3),hy=y+6;const g=c.createLinearGradient(hx,hy,hx+p.dir*70,hy+18);g.addColorStop(0,'#ffe5a4');g.addColorStop(1,'#ffe5a400');c.fillStyle=g;c.beginPath();c.moveTo(hx,hy);c.lineTo(hx+p.dir*82,hy-15);c.lineTo(hx+p.dir*76,hy+35);c.closePath();c.fill();c.restore();}
 }
 elevator(x,ready,floor){x-=this.cam;const glow=.6+Math.sin(this.t*2)*.15;this.box(x-3,145,35,83,RAMPS.iron);this.rect(x,150,29,77,RAMPS.iron[3]);this.box(x+2,153,12,72,RAMPS.teal);this.box(x+15,153,12,72,RAMPS.teal);this.line(x+4,157,8,RAMPS.teal[0]);this.rect(x+12,163,1,52,RAMPS.teal[3]);this.box(x,137,29,8,RAMPS.gold);this.label(floor===2?'HOME':'LIFT',x+5,143,RAMPS.gold[3],5);this.box(x+37,177,8,15,RAMPS.iron);this.rect(x+40,181,2,3,ready?'#e9ce89':'#b7815d');this.glow(x+14,141,35,18,ready?'#edcb84':'#8aa58d',glow*.18);if(ready){this.label('[E]',x+9,130,'#ead9aa',7);this.glow(x+15,220,30,13,'#edcb84',.18);} }
 render(s,dt){this.t=s.time;this.n=s.phaseMix;this.cam=Math.floor(s.camera);const c=this.c;c.imageSmoothingEnabled=false;this.wall(s.floor,this.cam);
   // Floor dressing at world positions tells a small, lived-in story.
   for(const p of s.platforms)this.platform(p);
   // A visible hazard, with the same active envelope as its collision.
   const hx=886-this.cam,awake=!s.night&&Math.sin(this.t*2)>.1;
   this.box(hx-5,223,38,5,RAMPS.rust);for(let k=0;k<5;k++)this.rect(hx-3+k*7,223,3,2,RAMPS.gold[1]);
   if(s.floor===0){this.pipe(hx+8,212,9,12,true);if(awake)for(let k=0;k<4;k++){const h=(this.t*32+k*9)%37;this.rect(hx+5+Math.sin(k+this.t*3)*3,211-h,13+k*2,4,'#c2ccb0');this.rect(hx+9,207-h,8,3,'#e0d9b8');}}
   else if(s.floor===1){this.box(hx-2,210,32,14,RAMPS.iron);this.rect(hx+2,213,24,6,RAMPS.iron[3]);for(let k=0;k<4;k++)this.rect(hx+4+k*6+(awake?Math.floor(this.t*12)%3:0),214,3,4,RAMPS.rust[awake?1:2]);}
   else{this.fan(hx+13,210,13);}
   this.label(awake?'!':'z',hx+11,195,awake?'#f0c389':'#a5bdba',7);
   // A lunch note, a chipped safety placard, a discarded glove: authored clusters.
   this.box(413-this.cam,202,24,17,RAMPS.gold);this.label('MIND',416-this.cam,209,RAMPS.gold[3],4);this.label('THE GAP',415-this.cam,215,RAMPS.gold[3],4);
   this.rect(1240-this.cam,226,27,2,RAMPS.iron[3]);this.rect(1250-this.cam,223,12,3,RAMPS.iron[3]);
   for(let i=0;i<7;i++){let x=i*201+32-this.cam;if(x< -50||x>520)continue;if(s.floor===0){this.pipe(x,207,17,20,true);let steam=(this.t*11+i*7)%31;for(let k=0;k<3;k++){let yy=202-steam-k*8;this.rect(x+3+Math.sin(this.t+i+k)*3,yy,6+k*2,3,blend('#a5b4a0','#637b78',this.n));}this.rect(x-6,226,35,2,RAMPS.iron[3]);}else if(s.floor===1){this.box(x,216,12,12,RAMPS.rust);this.rect(x+2,215,8,2,RAMPS.rust[0]);this.label('LATE',x,208,'#c5c5a0',5);}else{this.box(x,215,14,13,RAMPS.rust);this.rect(x+6,202,2,14,RAMPS.cloth[2]);this.rect(x+1+Math.sin(this.t)*.5,204,6,3,RAMPS.cloth[1]);this.rect(x+8,200,6,4,RAMPS.cloth[0]);}}
   if(this.n>0){c.globalAlpha=this.n*.18;this.rect(0,0,480,246,'#17384d');c.globalAlpha=1;}
   for(let i=0;i<s.items.length;i++)this.item(s.items[i],i);
   this.elevator(1354,s.items.every(i=>i.got),s.floor);this.player(s.player);
   for(const p of s.particles){this.rect(p.x-this.cam,p.y,p.size??2,p.size??2,p.color);}
   // Near foreground parallax: frame-edge pipes, never obscuring the path.
   for(let i=-1;i<4;i++){const x=i*390-((this.cam*1.13)%390)-12;this.pipe(x,-4,9,68,true,[RAMPS.iron[1],RAMPS.iron[2],RAMPS.iron[3],'#19393f']);this.pipe(x,63,34,7,false,[RAMPS.iron[1],RAMPS.iron[2],RAMPS.iron[3],'#19393f']);}
   this.rect(0,246,480,24,'#17383d');this.line(0,246,480,'#49665f');for(let i=0;i<3;i++){this.box(12+i*12,253,7,7,s.items[i].got?RAMPS.gold:RAMPS.iron);}this.label(s.lang==='zh'?s.shortZh:s.short,56,259,'#b4c6af',6);this.label(`${s.items.filter(i=>i.got).length}/3`,450,259,'#e9c28a',7);
   if(s.messageTimer>0){const w=Math.min(458,s.message.length*3.8+18);this.rect((480-w)/2,29,w,22,'#19393fe8');this.line((480-w)/2,29,w,'#a8a783');this.label(s.message,(480-w)/2+9,43,'#e8dfb9',7);}
   if(s.flash>0){c.globalAlpha=s.flash*.22;this.rect(0,0,480,246,'#e7d7ad');c.globalAlpha=1;}
   if(s.soundFlash>0){this.box(447,6,26,16,RAMPS.iron);this.label(s.muted?'M OFF':'M ON',450,17,'#f0d399',5);}
   if(s.transition>0){c.globalAlpha=s.transition;this.rect(0,0,480,270,'#102c30');c.globalAlpha=1;}
 }
}
