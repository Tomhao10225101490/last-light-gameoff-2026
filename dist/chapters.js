// Authored chapter spaces. Each plan is a 4-column / 6-storey building section,
// not six copies of the old corridor. Letters select traversable room structures;
// links place stairwells, and work changes the section's actual route machinery.
const section=(id,en,zh,plan,links,work,scene,mechanic,tone)=>({id,en,zh,plan:plan.split('/'),links,work,scene,mechanic,tone});
export const CHAPTERS=[
 [
  section('duty-room','Duty rooms','值班室','OBSR/SLBR/BSDL/RBSL/LSRB/BR SO'.replace(' ',''),[[0,0],[3,1],[1,2],[2,3],[0,4],[3,4]], [1,0], 'duty-signoff','power','amber'),
  section('loading','Loading passage','装卸通道','RLSB/BSRL/SRLB/LBRS/RSBL/SLBO',[[2,0],[0,1],[3,2],[1,3],[2,4],[0,3]], [2,2], 'freight','pressure','copper'),
  section('steam-hall','Steam hall','蒸汽大厅','SBRL/RSLB/LRBS/BSLR/SLRB/RBLO',[[3,0],[1,1],[0,2],[3,3],[1,4],[2,1]], [1,3], 'relief','steam','rust'),
  section('cooling-shaft','Cooling shaft','冷却井','BLRS/RSBL/SLRB/LRBS/BRSL/RLSO',[[0,0],[2,1],[3,2],[0,3],[2,4],[1,3]], [2,4], 'coolant','water','blue'),
  section('return-bridge','Return inspection bridge','回程检修桥','LSBR/SBRL/RLBS/BRSL/SRLB/LBSO',[[1,0],[3,1],[0,2],[2,3],[3,4],[0,4]], [3,2], 'bridge','bridge','steel'),
  section('valve-hall','Main valve hall','主阀大厅','RBSL/LRSB/BSLR/SLBR/RLBS/SBLO',[[2,0],[0,1],[2,2],[3,3],[1,4],[0,2]], [3,5], 'main-valve','pressure','gold')
 ],[
  section('lift-lobby','Lift lobby','电梯前厅','OSLB/BRLS/LBSR/RSLB/SRBL/BLSO',[[0,0],[2,1],[3,2],[1,3],[0,4],[3,0]], [1,1], 'register','power','sage'),
  section('work-maze','Work maze','工位迷宫','LBSR/RBSL/SLRB/BRLS/LRSB/SBLO',[[3,0],[1,1],[0,2],[2,3],[3,4],[1,4]], [2,3], 'public-list','doors','teal'),
  section('archive','Archive mezzanine','档案夹层','BLRS/SRBL/RLSB/LBSR/BRSL/LSRO',[[1,0],[3,1],[2,2],[0,3],[2,4],[0,1]], [2,4], 'record','archive','paper'),
  section('pantry','Pantry','茶水间','RSLB/LBRS/BRSL/SLRB/RBLS/LSBO',[[2,0],[0,1],[3,2],[1,3],[3,4],[0,4]], [1,2], 'phone','water','olive'),
  section('fire-corridor','Fire corridor','消防回廊','SLBR/RBLS/LSRB/BRSL/SBLR/RLSO',[[0,0],[3,1],[1,2],[2,3],[0,4],[2,2]], [2,4], 'fire-door','doors','ember'),
  section('gary-office','Gary’s office','Gary 的办公室','BRSL/LSRB/RBLS/SLBR/LRSB/BLSO',[[3,0],[1,1],[2,2],[0,3],[1,4],[3,3]], [3,5], 'lunchbox','handover','warm')
 ],[
  section('machine-room','Roof machine room','屋顶机房','ORBS/SLBR/BRSL/LRSB/RSBL/BL SO'.replace(' ',''),[[1,0],[3,1],[0,2],[2,3],[3,4],[0,4]], [2,1], 'roof-power','power','slate'),
  section('water-tower','Water tower','水塔','BLRS/RSLB/SBRL/LBRS/RSBL/SLBO',[[0,0],[2,1],[3,2],[1,3],[2,4],[0,2]], [2,4], 'reservoir','water','aqua'),
  section('greenhouse','Greenhouse','温室','LRSB/BSLR/RBLS/SLRB/BRSL/LSBO',[[2,0],[0,1],[1,2],[3,3],[0,4],[3,1]], [1,3], 'plants','growth','fern'),
  section('exterior','Exterior inspection route','楼外检修道','SRBL/LBSR/BRLS/RSLB/LSRB/RBLO',[[3,0],[1,1],[0,2],[2,3],[3,4],[0,3]], [2,2], 'evacuation','bridge','storm'),
  section('antenna','Antenna bridges','天线桥','RBSL/SLRB/LBRS/BRSL/RSBL/LSBO',[[1,0],[3,1],[2,2],[0,3],[2,4],[3,2]], [1,4], 'circuit','power','violet'),
  section('beacon','Exit beacon','出口信标','BSRL/LRSB/RBLS/SLBR/BRSL/OLSO',[[2,0],[0,1],[3,2],[1,3],[0,4],[3,4]], [0,5], 'last-door','exit','dawn')
 ]
];
export const SCENES={
 'duty-signoff':[['Eli turns to today’s page, not the damaged register from twelve years ago.','Eli 翻到今天这一页，不是十二年前那本受损的登记册。'],['He signs his own name. He is here to complete a handover, not to take Gary’s place.','他签下自己的名字。他来交班，不是来代替 Gary。'],['The standby circuit engages. The return lift lights up.','备用回路接通。回程升降台亮起来了。']],
 clock:[['Eli checks the clock. 17:59. A coat, a key, one unfinished shift.','Eli 看了看时钟。17:59。一件外套，一把钥匙，还有没交完的班。'],['The second hand stops. In the other memory, the wall is burned. 18:00.','秒针停住。另一段记忆里，墙已经烧黑。18:00。'],['“I am alive. I came to finish the handover.”','“我还活着。我是来交班的。”']],
 freight:[['The loading gate is held by pressure, not a lock. Eli turns the bypass wheel.','装卸闸门不是锁住了，是被压力顶住。Eli 转动旁通阀。'],['A hiss, then a clear passage. The service lift begins moving again.','一声泄压，通道露出来。检修升降台重新运行。']],
 relief:[['The pipe knocks three times. Eli waits for the needle to fall.','管道敲了三下。Eli 等着压力表回落。'],['Steam clears from the lower gallery. Someone has left a handprint on the release.','下层廊道的蒸汽散去。泄压柄上留着一个手印。']],
 coolant:[['Cold water travels down the glass gauge. The stalled pump catches.','冷水沿玻璃水位计落下。停转的水泵重新咬合。'],['The return lift rises. This is a way back, not another dead end.','回程升降台升起。这是归路，不是又一个死胡同。']],
 bridge:[['Eli braces the inspection bridge. Its far latch finally seats.','Eli 撑住检修桥。另一端的锁舌终于落进槽里。'],['The direct return route stays open in both memories.','两段记忆里的直接回程路都保持开放。']],
 'main-valve':[['Three pressure lines settle into the green. The boiler is safe to leave.','三条压力线回到绿色。锅炉可以交班了。'],['A name is scratched under the wheel: GARY — RELEASE FIRST.','阀轮下刻着一个名字：GARY——先放行。']],
 register:[['Eli signs the present-day duty book. The handwriting is his own.','Eli 在今天的值班本上签字。那是他自己的笔迹。'],['Twelve years earlier, another signature ends in a torn line.','十二年前，另一个签名被撕裂的纸边截断。']],
 'public-list':[['The public evacuation list says everyone left. One line is suspiciously neat.','公开疏散名单写着所有人都离开了。有一行干净得不自然。'],['Eli opens the inner work ring. The archive can now be reached from either side.','Eli 打开内侧工位环路。档案室现在两边都能走到。']],
 record:[['GARY — EVACUATED. The time is earlier than the fire-door release.','GARY——已撤离。记录时间比消防门放行还早。'],['Eli crosses out the error. RETURNED TO RELEASE DOORS. STATUS UNCONFIRMED.','Eli 划掉错误。返回放行消防门。去向未确认。'],['“You were still here. I will not write you out again.”','“那时你还在这里。我不会再把你漏掉。”']],
 phone:[['A telephone rings in the empty pantry. Eli lifts the receiver.','空茶水间的电话响了。Eli 拿起听筒。'],['Gary, in the memory: “The last door. Do not let it lock.”','记忆里的 Gary：“最后那扇门。别让它锁上。”'],['Eli: “I heard you. I will leave it open.” The ringing stops.','Eli：“听见了。我会把它留着。”铃声停了。']],
 'fire-door':[['18:00. Gary pulls the manual release while smoke fills the corridor.','18:00。烟涌进回廊，Gary 拉下手动放行柄。'],['The fire doors open. People run past him toward the stairs. He holds the lever.','消防门打开。人们从他身边奔向楼梯。他仍握着拉柄。'],['The record called him evacuated. This is what it missed.','记录说他已经撤离。这就是被漏掉的部分。']],
 lunchbox:[['Eli kneels beside the narrow door gap and sets down the lunchbox.','Eli 在窄门缝边蹲下，放下便当盒。'],['He slides it through. A hand receives it. No attack. Just a long pause.','他把盒子推进去。一只手接住了。没有袭击，只有长久的停顿。'],['Gary: “One more shift?” Eli: “No. This is the handover.”','Gary：“再值一班？”Eli：“不。这次是交班。”']],
 'roof-power':[['The roof fans stop fighting the emergency supply. Eli isolates the motor line.','屋顶风机不再争抢应急电源。Eli 断开电机支路。'],['The beacon has its own circuit now, but its final switch is still off.','信标现在有了独立回路，但最后的开关还没打开。']],
 reservoir:[['Water rises through the tower’s sight glass. A float lifts the lower walkway.','水沿水塔的观察管上升。浮筒托起下层步道。'],['There is enough for the plants and enough to keep the return pump running.','这些水够浇花，也够让回程泵继续运转。']],
 plants:[['Eli waters the three planters, slowly. Leaves lift out of the dust.','Eli 慢慢浇过三个花槽。叶子从灰里抬起来。'],['The trellis lowers into a bridge. Beyond it, the exterior door can open.','支架落成一座桥。桥外的楼外检修门可以打开了。']],
 evacuation:[['The emergency route drawing ends at a door that was marked sealed.','应急疏散图通向一扇被标成封死的门。'],['Gary’s pencil arrow points through it. Eli resets the exterior latch.','Gary 的铅笔箭头穿过了那扇门。Eli 复位楼外门闩。']],
 circuit:[['The lamp circuit is independent of the building’s main switch.','照明回路独立于大楼总闸。'],['Eli leaves the final choice at the exit: a lamp can stay on after everyone leaves.','Eli 把最后的选择留在出口：所有人离开后，灯也可以继续亮。']],
 'last-door':[['The shutters begin their closing cycle. A warning bell sounds before anything moves.','卷闸进入关闭周期。还没有东西靠近，预警铃先响了。'],['“Do not wait in the corridor. I have the release.”','“别在走廊里等。我握着放行柄。”'],['The exit is to the right. Run when you are ready.','出口在右边。准备好就走。']],
 'ending-normal':[['Eli holds the door until the emergency latch catches.','Eli 扶着门，直到应急锁舌卡住。'],['Behind him, the building is quiet. The handover is complete, but one line remains uncertain.','身后的大楼安静了。班交完了，还有一行记录未能确认。'],['He goes home. The door does not lock behind him.','他回家了。身后的门没有锁上。']],
 'ending-complete':[['Eli switches the exit lamp to its independent supply and holds the door.','Eli 把出口灯接到独立电源上，扶住门。'],['The waiting figures turn toward the light. One by one, they step outside.','等候的身影转向灯光。一个接一个，跨出门外。'],['Gary takes his lunchbox and comes last. Eli: “I am leaving you a door.”','Gary 拿起便当，最后走来。Eli：“我在给你留门。”'],['The corrected last page reads: EVERYONE HAS LEFT. The lamp stays on.','修正后的最后一页写着：所有人都已离开。灯仍亮着。']]
};
export const SECTOR_WIDTH=1920,SECTOR_HEIGHT=1620;
export function tilePosition(col,row){return {x:col*480+30,y:row*270+228};}
