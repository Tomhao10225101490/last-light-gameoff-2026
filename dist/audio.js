// All sound is synthesized locally. No samples, external media, or recorded voices.
export const SFX_GAIN = Object.freeze({
  footstepConcrete:.12, // soft sole, beneath the melody
  footstepGrate:.18, // a thin resonant plate needs more presence
  footstepCarpet:.075, // intentionally muffled
  jump:.16, land:.23, death:.22, shift:.30, collect:.18, door:.32, drip:.08, knock:.11, phone:.075
});
const MELODY=[0,4,7,11,7,4,2,4,7,9,7,4,0,2,4,7,5,9,12,9,7,5,4,2,0,4,7,4,2,0,-1,2];
const midi=n=>440*2**((n-69)/12);
export class Sound {
  constructor(){this.ctx=null;this.muted=false;this.focus=true;this.night=false;this.floor=0;this.menu=true;this.notes=0;this.next=0;this.phoneRang=false;this.micro=0;this.audit=[];}
  async start(){
    if(this.ctx){await this.ctx.resume();return;}
    const C=globalThis.AudioContext||globalThis.webkitAudioContext;if(!C)return;
    this.ctx=new C();const c=this.ctx;
    this.master=c.createGain();this.master.gain.value=.72;
    const compressor=c.createDynamicsCompressor();compressor.threshold.value=-20;compressor.knee.value=12;compressor.ratio.value=3;compressor.attack.value=.005;compressor.release.value=.18;
    const limiter=c.createDynamicsCompressor();limiter.threshold.value=-3;limiter.knee.value=0;limiter.ratio.value=20;limiter.attack.value=.001;limiter.release.value=.06;
    this.master.connect(compressor).connect(limiter).connect(c.destination);
    this.sfx=c.createGain();this.sfx.connect(this.master);
    this.music=c.createGain();this.music.connect(this.master);this.day=c.createGain();this.nite=c.createGain();this.day.connect(this.music);this.nite.connect(this.music);
    this.ambDay=c.createGain();this.ambNight=c.createGain();this.ambDay.connect(this.master);this.ambNight.connect(this.master);
    this.noiseBuffer=c.createBuffer(1,c.sampleRate*3,c.sampleRate);const data=this.noiseBuffer.getChannelData(0);let seed=8137;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647)*2-1;}
    this.room();this.setPhase(this.night,true);this.next=c.currentTime+.07;this.timer=setInterval(()=>this.schedule(),40);await c.resume();
  }
  gain(bus,t,g,d,a=.008){const n=this.ctx.createGain();n.gain.setValueAtTime(.00001,t);n.gain.exponentialRampToValueAtTime(Math.max(.0001,g),t+a);n.gain.exponentialRampToValueAtTime(.00001,t+d);n.connect(bus);return n;}
  tone(f,end,t,d,g=.1,type='sine',bus=this.sfx){if(!this.ctx)return;const o=this.ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(Math.max(15,f),t);o.frequency.exponentialRampToValueAtTime(Math.max(15,end),t+d);o.connect(this.gain(bus,t,g,d));o.start(t);o.stop(t+d+.01);}
  noise(t,d,g,frequency=1500,bus=this.sfx,q=.8){if(!this.ctx)return;const s=this.ctx.createBufferSource();s.buffer=this.noiseBuffer;const f=this.ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=frequency;f.Q.value=q;s.connect(f).connect(this.gain(bus,t,g,d,.004));s.start(t,Math.random()*1.5);s.stop(t+d+.02);}
  // Tiny synth kit: all composed effects below use 2–3 different sources.
  kick(t,g,d=.18){this.tone(100,36,t,d,g);}
  tick(t,g){this.noise(t,.035,g,4800);this.tone(1800,900,t,.018,g*.3,'square');}
  clunk(t,g){this.kick(t,g,.24);this.noise(t,.15,g*.7,700);this.tone(220,95,t,.16,g*.3,'triangle');}
  whirr(t,g,up=false){this.tone(up?70:380,up?380:45,t,.8,g,'sawtooth');this.noise(t,.7,g*.6,260);}
  buzz(t,g){this.tone(118,63,t,.35,g*.6,'sawtooth');this.noise(t,.3,g*.5,1600);}
  slurp(t,g){this.noise(t,.18,g,1100);this.tone(530,210,t,.19,g*.6);}
  room(){const c=this.ctx;this.roomNodes=[];const hum=(frequency,g,bus,type='sine')=>{const o=c.createOscillator(),v=c.createGain();o.frequency.value=frequency;o.type=type;v.gain.value=g;o.connect(v).connect(bus);o.start();this.roomNodes.push(o);return v;};
    this.hum=hum(48,.035,this.ambDay);hum(96,.009,this.ambDay,'triangle');const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.16;lg.gain.value=.012;lfo.connect(lg).connect(this.hum.gain);lfo.start();this.roomNodes.push(lfo);
    const n=c.createBufferSource();n.buffer=this.noiseBuffer;n.loop=true;this.wind=c.createBiquadFilter();this.wind.type='lowpass';this.wind.frequency.value=260;const v=c.createGain();v.gain.value=.06;n.connect(this.wind).connect(v).connect(this.ambNight);n.start();this.roomNodes.push(n);
    this.micro=c.currentTime+3;
  }
  setPhase(n,immediate=false){this.night=n;if(!this.ctx)return;const t=this.ctx.currentTime,d=immediate?0:.18;for(const [node,val] of [[this.day,n?0:.24],[this.nite,n?.29:0],[this.ambDay,n?.08:1],[this.ambNight,n?1:.06]]){node.gain.cancelScheduledValues(t);if(immediate){node.gain.setValueAtTime(val,t);}else{node.gain.setValueAtTime(node.gain.value,t);node.gain.linearRampToValueAtTime(val,t+d);}}}
  setFloor(f){this.floor=f;this.phoneRang=false;if(this.ctx){const t=this.ctx.currentTime;this.hum.gain.cancelScheduledValues(t);this.hum.gain.setValueAtTime(this.hum.gain.value,t);this.hum.gain.linearRampToValueAtTime([.035,.018,.009][f],t+.5);this.wind.frequency.setValueAtTime(this.wind.frequency.value,t);this.wind.frequency.linearRampToValueAtTime(f===2?900:260,t+.4);}}
  duck(d=.8){if(!this.ctx)return;const t=this.ctx.currentTime,b=this.music;b.gain.cancelScheduledValues(t);b.gain.setValueAtTime(.70794578,t);b.gain.setValueAtTime(.70794578,t+d);b.gain.linearRampToValueAtTime(1,t+d+.18);}
  nearSilence(){if(!this.ctx)return;const t=this.ctx.currentTime;this.master.gain.cancelScheduledValues(t);this.master.gain.setValueAtTime(this.master.gain.value,t);this.master.gain.linearRampToValueAtTime(.018,t+.008);this.master.gain.setValueAtTime(.018,t+.295);this.master.gain.linearRampToValueAtTime(this.muted||!this.focus?0:.72,t+.305);}
  effect(name,amount=1,surface='concrete'){
    if(!this.ctx)return;const t=this.ctx.currentTime;this.audit.push(name);if(this.audit.length>80)this.audit.shift();
    if(name==='step'){const variation=(.92+Math.random()*.16),gain=(.9+Math.random()*.2);const g=SFX_GAIN[{concrete:'footstepConcrete',grate:'footstepGrate',carpet:'footstepCarpet'}[surface]]*gain;this.noise(t,surface==='carpet'?.07:.045,g,surface==='carpet'?450:surface==='grate'?2500:1000);this.tone((surface==='grate'?330:115)*variation,70*variation,t,.065,g*.6,'triangle');if(surface==='grate')this.tone(890*variation,850*variation,t,.12,g*.18);}
    if(name==='jump'){this.noise(t,.13,SFX_GAIN.jump*.6,1000);this.tone(190,360,t,.18,SFX_GAIN.jump*.45);}
    if(name==='land'){const g=SFX_GAIN.land*Math.min(1,Math.max(.2,amount));this.kick(t,g);this.noise(t,.13,g*.55,650);}
    if(name==='death'){this.buzz(t,.14);this.tone(440,58,t,.6,.08,'triangle');this.tick(t+.18,.08);this.tick(t+.37,.04);}
    if(name==='shift'){this.tick(t,.11);this.tick(t+.065,.08);this.clunk(t+.12,SFX_GAIN.shift);this.whirr(t+.17,.025,!this.night);if(this.night){this.tone(680,540,t+.62,.23,.016);this.tone(540,480,t+.83,.22,.013);}this.duck(.8);}
    if(name==='collect'){this.slurp(t,.045);[0,4,7].forEach((v,i)=>this.tone(midi(72+v),midi(72+v),t+i*.06,.35,.08,'triangle'));}
    if(name==='door'){this.clunk(t,SFX_GAIN.door);this.whirr(t+.1,.025,true);this.tick(t+.6,.05);this.duck(.65);}
    if(name==='drip'){this.tone(1450,700,t,.11,.045);this.noise(t,.06,.025,3200);[.16,.29,.43].forEach((delay,i)=>this.tone(950,700,t+delay,.2,.016/(i+1)));}
    if(name==='knock'){this.clunk(t,.06);this.kick(t+.13,.035);}
    if(name==='phone'&&!this.phoneNear){this.tone(740,738,t,.35,.035,'triangle');this.tone(940,945,t+.08,.35,.022);}
  }
  stopPhone(){// The one-off ring never repeats, approaching cuts its short tail.
    if(this.ctx&&this.floor===1&&this.phoneRang){this.sfx.gain.cancelScheduledValues(this.ctx.currentTime);this.sfx.gain.setTargetAtTime(.1,this.ctx.currentTime,.02);this.sfx.gain.setTargetAtTime(1,this.ctx.currentTime+.25,.04);}}
  schedule(){if(!this.ctx)return;const c=this.ctx;while(this.next<c.currentTime+.14){const i=this.notes%32,raw=MELODY[i];const minor=v=>{const octave=Math.floor(v/12),pc=((v%12)+12)%12;return octave*12+({4:3,9:8,11:10}[pc]??pc);};
      this.tone(midi(60+raw),midi(60+raw),this.next,.26,.11,'triangle',this.day);
      this.tone(midi(36+[0,0,5,7][Math.floor(i/8)]),midi(36+[0,0,5,7][Math.floor(i/8)]),this.next,.16,.085,'triangle',this.day);
      if(i%2===0){let hz=midi(72+minor(raw));this.tone(hz,hz*.997,this.next,.65,.085,'sine',this.nite);this.tone(hz*2.003,hz*2,this.next,.22,.02,'sine',this.nite);}
      if(i%8===0)this.tone(midi(36+[0,0,5,7][Math.floor(i/8)]),midi(36+[0,0,5,7][Math.floor(i/8)]),this.next,1.4,.05,'sine',this.nite);
      this.next+=.235*(this.menu?1/0.9:1);this.notes++;}
    if(c.currentTime>this.micro){if(this.floor===0)this.effect(this.notes%3?'drip':'knock');else if(this.floor===1&&!this.phoneRang&&!this.menu){this.effect('phone');this.phoneRang=true;}else if(this.floor===2){this.noise(c.currentTime,1.7,.03,600,this.ambNight);}this.micro=c.currentTime+6.8+(this.notes%4)*.3;}
    if(this.night&&this.notes%16===0&&this.cricket!==this.notes){this.cricket=this.notes;for(let i=0;i<3;i++)this.tone(4100,4000,c.currentTime+i*.09,.045,.008,'sine',this.ambNight);}
  }
  mute(value=!this.muted){this.muted=value;this.applyVolume();return value;}
  setFocus(v){this.focus=v;this.applyVolume();}
  applyVolume(){if(this.ctx){const t=this.ctx.currentTime;this.master.gain.cancelScheduledValues(t);this.master.gain.setValueAtTime(this.master.gain.value,t);this.master.gain.linearRampToValueAtTime(this.muted||!this.focus?0:.72,t+.025);}}
}
