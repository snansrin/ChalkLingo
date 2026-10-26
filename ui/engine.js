/* Standalone, dependency-free selection & spaced review model. */
(function(global){
'use strict';
const LEVELS=['A1','A2','B1','B2','C1','C2'];
const MODES=['mix','vocab','sentence','grammar'];
const DEFAULTS=Object.freeze({language:'en',level:'A1',mode:'mix',interval:0,sound:false,translation:true,alwaysTop:false,reduceMotion:false,voiceId:'auto',aiEnabled:false,aiModel:'gemma3:4b'});
function sanitizeSettings(value, languages=['en','de','fr','es','it','ru','ja']){
 const v=value&&typeof value==='object'?value:{};
 const str=(key,allowed,fallback)=>allowed.includes(v[key])?v[key]:fallback;
 return {
  language:str('language',languages,DEFAULTS.language),level:str('level',LEVELS,DEFAULTS.level),
  mode:str('mode',MODES,DEFAULTS.mode),interval:[0,30,60,120,300,600,900,1800,3600,7200].includes(Number(v.interval))?Number(v.interval):0,
  notificationSound:v.notificationSound===true,lessonSound:v.lessonSound===true,
  volume:Number.isFinite(v.volume)?Math.max(0,Math.min(1,v.volume)):.35,
  tone:str('tone',['soft','bell','wood'],'soft'),
  quietEnabled:v.quietEnabled===true,quietStart:Number.isInteger(v.quietStart)&&v.quietStart>=0&&v.quietStart<24?v.quietStart:22,
  quietEnd:Number.isInteger(v.quietEnd)&&v.quietEnd>=0&&v.quietEnd<24?v.quietEnd:8,
  sessionSize:[5,10,15].includes(v.sessionSize)?v.sessionSize:5,
  sound:v.sound===true,voiceId:typeof v.voiceId==='string'&&v.voiceId.length<=180?v.voiceId:'auto',translation:v.translation!==false,alwaysTop:v.alwaysTop===true,reduceMotion:v.reduceMotion===true,
  aiEnabled:v.aiEnabled===true,aiModel:typeof v.aiModel==='string'&&v.aiModel.length<=80&&/^[a-zA-Z0-9][a-zA-Z0-9._-]*(?:\/[a-zA-Z0-9][a-zA-Z0-9._-]*)?(?::[a-zA-Z0-9][a-zA-Z0-9._-]*)?$/.test(v.aiModel)?v.aiModel:DEFAULTS.aiModel
 };
}
function getDeck(all,settings){return all.filter(x=>x.language===settings.language&&x.level===settings.level&&(settings.mode==='mix'||x.mode===settings.mode));}
function safeRecord(rec){
 if(!rec||typeof rec!=='object')return null;
 return {seen:Math.max(0,Math.min(99999,Number(rec.seen)||0)),repetitions:Math.max(0,Math.min(99999,Number(rec.repetitions)||0)),
  interval:Math.max(0,Math.min(3650,Number(rec.interval)||0)),ease:Math.max(1.3,Math.min(3,Number(rec.ease)||2.5)),
  due:Number.isFinite(rec.due)?Math.max(0,rec.due):0,learned:Boolean(rec.learned),lastSeen:Number.isFinite(rec.lastSeen)?Math.max(0,rec.lastSeen):0};
}
function normalizeRecords(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return {};
 const out={};
 for(const [key,rec] of Object.entries(value).slice(0,10000)){
  if(/^[a-z]{2}:(vocab|sentence|grammar):\d{3}$/.test(key)){const safe=safeRecord(rec);if(safe)out[key]=safe;}
 }
 return out;
}
function markSeen(records,id,now=Date.now()){
 const old=safeRecord(records[id])||{seen:0,repetitions:0,interval:0,ease:2.5,due:0,learned:false,lastSeen:0};
 return {...records,[id]:{...old,seen:old.seen+1,lastSeen:now}};
}
function review(records,id,score,now=Date.now()){
 const quality=score==='again'?1:score==='hard'?3:score==='easy'?5:4;
 const old=safeRecord(records[id])||{seen:0,repetitions:0,interval:0,ease:2.5,due:0,learned:false,lastSeen:0};
 let repetitions=old.repetitions,interval=old.interval,ease=old.ease;
 if(quality<3){repetitions=0;interval=0;}
 else{
  repetitions++;
  interval=repetitions===1?(quality===3?1/6:1):repetitions===2?(quality===3?2:6):Math.max(1,Math.round(interval*ease));
  ease=Math.max(1.3,ease+0.1-(5-quality)*(0.08+(5-quality)*0.02));
 }
 const due=now+(quality<3?5*60*1000:interval*24*60*60*1000);
 return {...records,[id]:{...old,repetitions,interval,ease,due,learned:quality>=3,lastSeen:now}};
}
function selectNext(deck,records,previousId='',now=Date.now(),random=Math.random){
 if(!deck.length)return null;
 const withoutPrevious=deck.filter(x=>x.id!==previousId);
 const pool=withoutPrevious.length?withoutPrevious:deck;
 const due=pool.filter(x=>records[x.id]?.due && records[x.id].due<=now);
 const fresh=pool.filter(x=>!records[x.id]?.seen);
 const candidates=due.length?due:fresh.length?fresh:pool;
 const sorted=[...candidates].sort((a,b)=>(records[a.id]?.lastSeen||0)-(records[b.id]?.lastSeen||0));
 const min=records[sorted[0].id]?.lastSeen||0;
 const tied=sorted.filter(x=>(records[x.id]?.lastSeen||0)===min);
 return tied[Math.min(tied.length-1,Math.floor(Math.max(0,Math.min(.999999,random()))*tied.length))];
}
function stats(deck,records,now=Date.now()){
 const seen=deck.filter(x=>(records[x.id]?.seen||0)>0).length;
 const learned=deck.filter(x=>records[x.id]?.learned).length;
 const due=deck.filter(x=>records[x.id]?.due&&records[x.id].due<=now).length;
 return {total:deck.length,seen,learned,due,pct:deck.length?Math.round(learned/deck.length*100):0};
}
const api=Object.freeze({DEFAULTS,LEVELS,MODES,sanitizeSettings,getDeck,normalizeRecords,markSeen,review,selectNext,stats});
global.ChalkEngine=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
