// Fictional story. Text only: no impersonated or synthetic recorded voices.
export const STORY={
 en:{
  title:'LAST LIGHT · One More Shift',floors:['THE BOILER ROOM','GARY’S OFFICE','THE ROOFTOP'],short:['CLOSE THREE VALVES','DELIVER THE HANDOVER','WATER THREE PLANTS'],
  introTitle:'One more shift.<br>Then everybody leaves.',introCopy:'Eli, a maintenance worker, returns for the final handover.<br><br>Gary’s old recording: “Quiet the boiler. Leave my lunch by the door. Don’t forget the rooftop plants.”<br><br>The checklist says to turn off every light.<br>In the margin: “Not the one at the exit.”',start:'CLOCK IN',resume:'CONTINUE SHIFT',hint:'HORROR THEMES · E INTERACT · J JOURNAL · HOLD C TO WALK',
  story:['17:59. The day shift is a memory before the fire. Night is what remained at 18:00. Observe from solid ground.','Two lists disagree: the evacuation register says Gary left. His handover says he was still on duty.','Gary watered these plants before the fire, twelve years ago. You promised to take the next shift.'],
  task:[['Pressure falls. A service hatch stops shaking. Behind it: three measured knocks.','The cooling line settles. Under the machine noise, a voice says: “Don’t lock the door.”','Steam thins. The accident report reads “Everyone evacuated.” Gary’s duty lamp is still lit.'],['The lunchbox note: “Go ahead. I’ll finish the last part for you.” Dated twelve years ago.','You correct Gary’s evacuation record: STILL ON DUTY. He returned to release the fire doors.','Eli kneels, straightens the lid and leaves the note. Warm light appears beneath Gary’s door.']],
  roofTasks:['Water reaches the first old pot. A pale evacuation arrow turns toward the exit.','A leaf bends in the wind. This is a promise, not a way to bring somebody back.','The final plant is watered. Only the exit light is left.'],
  evidence:{'fire-order':'Fire control: Emergency closure activated at 17:59. Someone wrote on the inside: DO NOT LOCK.','gary-lamp':'Duty board: Gary’s lamp was never switched to EVACUATED.','public-list':'Public register: GARY — EVACUATED. The entry is unsigned.','handover':'Internal handover: Gary returned to release the manual fire-door interlock. Eli and the others escaped.','evacuation':'Rooftop plan: The emergency path stayed open only while its independent light had power.','emergency-circuit':'Gary’s maintenance note: “Keep the exit lamp on its own circuit. Leave a door for the last person.”'},
  upperRoute:'The fire corridor is watched. The old inspection stairs offer another way. Observe both memories from the lamp.',
  need:'Finish three tasks before the lift can leave.',tutorial:'Gold belongs to day. Blue belongs to night. Inactive platforms disappear completely.',
  lamp:'Gary’s emergency lamp remembers your completed work.',shiftRejected:'Cannot shift into an occupied space.',death:'The emergency light gathers you again.',ghost:'The shadow is an unfinished shift—not Gary.',pause:'Take a breath.',pauseCopy:'The building can wait.<br>Your completed work is saved.',next:'NEXT CHAPTER',between:'Eli: “It wasn’t a missing signature. They left out a person.”',
  normalTitle:'Off duty.',normalCopy:'The boiler is quiet. The lunch is delivered.<br>The plants have water.<br><br>18:00 becomes 18:01.<br>The street outside is ordinary again.<br>One high window remains lit.',
  completeTitle:'The last person.',completeCopy:'Gary: “You don’t have to wait for me.”<br>Eli: “I’m not waiting. I’m leaving you a door.”<br><br>The shadows turn toward the exit.<br>Gary picks up his lunchbox last.<br><br>On the final page: EVERYONE HAS LEFT.<br>You left a light on for the last person.',
  replay:'RETURN TO CHAPTER',light:'Exit light switched to independent emergency power.',journal:'HANDOVER JOURNAL',noEntries:'Records and evidence you find will appear here.',close:'RETURN',interact:'E · USE / READ',evidenceLabel:'Evidence',
 },
 zh:{
  title:'《最后一盏灯：再值一班》',floors:['锅炉房','GARY 的办公室','屋顶'],short:['关好三个阀门','完成交班与送餐','浇好三盆植物'],
  introTitle:'再值一班。<br>然后，让所有人离开。',introCopy:'成年维修兼保洁员伊莱回到即将封闭的大楼。<br><br>Gary 的旧录音：“关好锅炉。午饭帮我放门口。屋顶那几盆，别忘了浇。”<br><br>任务单写着：离开前，关掉所有灯。<br>纸角的手写提醒：出口那盏别关。',start:'开始值班',resume:'继续值班',hint:'包含恐怖主题 · E 交互 · J 日志 · 按住 C 慢行',
  story:['17:59。日相位是火灾前的工作记忆，夜相位是 18:00 凝固的废墟。先在安全处观察。','两份名单互相矛盾：公开记录说 Gary 已撤离，交班簿却写着他仍然在岗。','十二年前，Gary 还在照顾这些植物。你答应过接他的下一班。'],
  task:[['压力降低了。检修口不再震动。门后传来规律的三下敲击。','冷却管线安静了。机器声下面，有人说：“别锁门。”','蒸汽散去。事故报告写着“全员撤离”。Gary 的值班灯却还亮着。'],['饭盒旁的便条：“你先走，我替你把最后这段做完。”日期是十二年前。','你补正了撤离记录：Gary 仍在岗。他返回楼内，手动解除了消防门封闭。','伊莱蹲下，扶正盒盖，贴好便条。Gary 门下透出一小块暖光。']],
  roofTasks:['水流进第一盆旧土。苍白的疏散箭头朝向出口。','叶片在风中摇晃。浇水是完成承诺，不是让死人复活。','最后一盆也浇好了。只剩出口那盏灯。'],
  evidence:{'fire-order':'消防记录：17:59 启动紧急封闭。门内侧写着：别锁门。','gary-lamp':'值班牌：Gary 的灯从未转到“已撤离”。','public-list':'公开名单：Gary——已撤离。记录没有签名。','handover':'内部交班簿：Gary 返回楼内，解除消防门手动联锁，让伊莱和其他人逃了出去。','evacuation':'屋顶疏散图：只有独立应急灯供电时，出口线路才保持开放。','emergency-circuit':'Gary 的维修便条：“出口那盏接独立电源。给最后一个人留门。”'},
  upperRoute:'消防回廊有东西在巡逻。旧检修梯通向另一条路。先在应急灯下观察两段记忆。',
  need:'先完成三件小事，电梯才能离开。',tutorial:'金色属于白天，蓝色属于夜晚。非活动平台会完全消失。',
  lamp:'Gary 留下的应急灯记得你已经完成的工作。',shiftRejected:'目标空间被占用，无法切换。',death:'应急灯把你重新聚合。',ghost:'阴影来自没有完成的交班，不是 Gary。',pause:'喘口气吧。',pauseCopy:'大楼可以等。<br>已完成的工作已经保存。',next:'下一章',between:'伊莱：“不是缺一个签名，是漏了一个人。”',
  normalTitle:'下班了。',normalCopy:'锅炉安静，午饭送达，植物浇过水。<br><br>时钟从 18:00 跳到 18:01。<br>街道恢复正常。<br>高处仍有一扇窗亮着。',
  completeTitle:'最后一个人。',completeCopy:'Gary：“这次，不用等我。”<br>伊莱：“不是等你。是给你留门。”<br><br>影子转过身，逐个穿过打开的门。<br>Gary 最后拿起饭盒。<br><br>交班簿：所有人，已离开。<br>你为最后一个人，留了一盏灯。',
  replay:'回访章节',light:'出口灯已切换至独立应急供电。',journal:'交班日志',noEntries:'找到的记录与证据会保存在这里。',close:'返回游戏',interact:'E · 操作 / 阅读',evidenceLabel:'证据',
 }
};
