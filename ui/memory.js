(function(root){
'use strict';
const DAY=86400000;
const Journey=root.MochiJourney||(typeof module!=='undefined'?require('./journey.js'):null);
const normalize=s=>String(s).normalize('NFKC').toLocaleLowerCase('en').replace(/[.!?,。！？]/g,'').replace(/\s+/g,' ').trim();
function clean(raw){
 const v=raw&&typeof raw==='object'?raw:{};
 const finite=n=>Number.isFinite(Number(n))?Math.max(0,Math.min(999999,Math.floor(Number(n)))):0;
 const records=Object.create(null);for(const [id,r] of Object.entries(v.records||{}).slice(0,5000))if(r&&typeof r==='object'&&Number.isFinite(r.due))records[id]={due:Math.max(0,r.due),streak:Math.min(20,finite(r.streak)),attempts:finite(r.attempts),best:Math.min(20,Math.max(finite(r.best),finite(r.streak))),lapses:finite(r.lapses),lastWrong:Number.isFinite(r.lastWrong)?Math.max(0,r.lastWrong):0,lastCorrect:Number.isFinite(r.lastCorrect)?Math.max(0,r.lastCorrect):0};
 const result={records,xp:Math.max(0,Math.min(9999999,Math.floor(Number(v.xp)||0))),days:Array.isArray(v.days)?v.days.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)).slice(-365):[],settings:{language:['en','de','fr','es','it','ru','ja'].includes(v.settings?.language)?v.settings.language:'en',level:['A1','A2','B1','B2','C1','C2'].includes(v.settings?.level)?v.settings.level:'A1',interval:[0,60,300,600,1800,3600].includes(v.settings?.interval)?v.settings.interval:600,sound:v.settings?.sound===true,motion:v.settings?.motion!==false,theme:['dawn','dusk','mint'].includes(v.settings?.theme)?v.settings.theme:'dawn'},...Journey.cleanExtras(v)};
 Journey.syncRewards(result);return result;
}
function dateKey(now){const d=new Date(now);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function grade(state,id,correct,now=Date.now(),mode='recall'){
 const previous=state.records[id]||{streak:0,attempts:0};const streak=correct?previous.streak+1:0;
 const interval=correct?[1,3,7,14,30,60,120][Math.min(streak-1,6)]*DAY:60000;
 state.records[id]={...previous,streak,attempts:previous.attempts+1,due:now+interval,best:Math.max(previous.best||0,streak),lapses:(previous.lapses||0)+(correct?0:1),lastWrong:correct?(previous.lastWrong||0):now,lastCorrect:correct?now:(previous.lastCorrect||0)};state.xp+=correct?12:2;
 Journey.record(state,id,correct,mode,now);
 const today=dateKey(now);if(!state.days.includes(today))state.days.push(today);return interval;
}
function select(deck,state,now=Date.now(),exclude){
 const pool=deck.filter(x=>x.id!==exclude);const list=pool.length?pool:deck;
 return list.slice().sort((a,b)=>{const ar=state.records[a.id],br=state.records[b.id];const rank=r=>!r?1:r.due<=now?0:2;return rank(ar)-rank(br)||(ar?.due||0)-(br?.due||0);})[0];
}
function available(deck,state,now=Date.now()){return deck.filter(x=>!state.records[x.id]||state.records[x.id].due<=now);}
const api={normalize,clean,grade,select,available,dateKey,DAY};root.MochiMemory=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);

