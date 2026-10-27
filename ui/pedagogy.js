(function(root){
'use strict';
const F=root.FSRS||(typeof module!=='undefined'?require('./vendor/fsrs.js'):null);
const DAY=86400000,SKILLS=['recognition','production','context','listening','assembly'];
const skillFor=mode=>({recall:'recognition',write:'production',build:'assembly',listen:'listening'})[mode]|| (SKILLS.includes(mode)?mode:'recognition');
// Stable ts-fsrs 5.4.2 / FSRS-6. Defaults are population parameters, not fitted learner parameters.
const scheduler=F.fsrs({request_retention:.9,maximum_interval:365,enable_fuzz:false,enable_short_term:true,learning_steps:['1m','10m'],relearning_steps:['10m']});
const time=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=8640000000000000;
const count=n=>Number.isInteger(n)&&n>=0&&n<=1000000;
const validID=id=>typeof id==='string'&&id.length>0&&id.length<=100&&!['__proto__','constructor','prototype'].includes(id);
function cleanCard(c){
 if(!c||!time(c.due)||!time(c.last_review)||!Number.isFinite(c.stability)||c.stability<=0||c.stability>36500||!Number.isFinite(c.difficulty)||c.difficulty<1||c.difficulty>10||![1,2,3].includes(c.state)||!['reps','lapses','learning_steps','elapsed_days','scheduled_days'].every(k=>count(c[k])))return null;
 return Object.fromEntries(['due','last_review','stability','difficulty','state','reps','lapses','learning_steps','elapsed_days','scheduled_days'].map(k=>[k,c[k]]));
}
function clean(raw){
 const v=raw&&typeof raw==='object'?raw:{},skills=Object.create(null),introduced=Object.create(null);
 for(const [id,at] of Object.entries(v.introduced||{}).slice(0,20000))if(validID(id)&&time(at))introduced[id]=at;
 for(const [id,record] of Object.entries(v.skills||{}).slice(0,20000)){
  if(!validID(id)||!record||typeof record!=='object')continue;
  const result=Object.create(null);
  for(const skill of SKILLS){const r=record[skill],card=cleanCard(r?.card);if(!card)continue;
   result[skill]={card,correct:count(r.correct)?r.correct:0,lastCorrect:time(r.lastCorrect)?r.lastCorrect:0,lastWrong:time(r.lastWrong)?r.lastWrong:0,firstCorrect:time(r.firstCorrect)?r.firstCorrect:0,days:[...new Set((Array.isArray(r.days)?r.days:[]).filter(d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)))].slice(-30)};
  }if(Object.keys(result).length)skills[id]=result;
 }
 return {version:1,skills,introduced};
}
function day(now){const d=new Date(now);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function record(state,id,skill){return state.education?.skills?.[id]?.[skillFor(skill)];}
function due(state,id,skill,now=Date.now()){const r=record(state,id,skill);return !r||r.card.due<=now;}
function review(state,id,mode,correct,now=Date.now()){
 if(!validID(id)||!time(now)||typeof correct!=='boolean')return 0;
 state.education??=clean();const skill=skillFor(mode),old=record(state,id,skill);
 // Early practice cannot manufacture additional reviews or delayed mastery.
 if(old&&(old.card.due>now||old.card.last_review>=now))return 0;
 const card=old?{...old.card,due:new Date(old.card.due),last_review:new Date(old.card.last_review)}:F.createEmptyCard(new Date(now));
 const next=scheduler.next(card,new Date(now),correct?F.Rating.Good:F.Rating.Again).card;
 const stored={...next,due:next.due.getTime(),last_review:next.last_review.getTime()};
 state.education.skills[id]??=Object.create(null);
 state.education.skills[id][skill]={card:stored,correct:(old?.correct||0)+(correct?1:0),firstCorrect:correct?(old?.correct?old.firstCorrect:now):(old?.firstCorrect||0),lastCorrect:correct?now:(old?.lastCorrect||0),lastWrong:correct?(old?.lastWrong||0):now,days:correct?[...new Set([...(old?.days||[]),day(now)])].slice(-30):(old?.days||[])};
 return Math.max(1,stored.due-now);
}
function passed(state,id){return ['production','context'].every(skill=>{const r=record(state,id,skill);return r&&r.correct>0&&r.lastCorrect>r.lastWrong;});}
function retained(state,id){return ['production','context'].every(skill=>{const r=record(state,id,skill);return r&&r.correct>=2&&r.days.length>=2&&r.lastCorrect-r.firstCorrect>=DAY&&r.lastCorrect>r.lastWrong;});}
function activeUnit(course,state){return course.units.find(u=>!u.cards.every(c=>passed(state,c.id)))||course.units.at(-1);}
function plan(course,state,now=Date.now()){
 const unit=activeUnit(course,state),all=course.units.flatMap(u=>u.cards),tasks=[];
 // Only taught content is tested. All previous units remain in the review pool.
 for(const c of all.filter(c=>Object.hasOwn(state.education.introduced,c.id)))for(const skill of ['production','context','recognition'])if(due(state,c.id,skill,now))tasks.push({id:c.id,skill,reason:record(state,c.id,skill)?'Zamanı gelen tekrar':'Öğretilen hedefin sıradaki becerisi'});
 tasks.sort((a,b)=>(record(state,a.id,a.skill)?.card.due??Number.MAX_SAFE_INTEGER)-(record(state,b.id,b.skill)?.card.due??Number.MAX_SAFE_INTEGER));
 const ready=tasks.slice(0,8),newLimit=tasks.length>=8?0:tasks.length?1:3;
 const fresh=unit.cards.filter(c=>!Object.hasOwn(state.education.introduced,c.id)).slice(0,newLimit);
 const result=fresh.map(c=>({id:c.id,skill:'learn',reason:unit.goal}));
 result.push(...ready);
 for(const skill of ['recognition','production','context'])for(const c of fresh)result.push({id:c.id,skill,reason:'Yeni hedef · ilk alıştırma'});
 return {unit:unit.id,tasks:result,due:tasks.length,fresh:fresh.length};
}
function duration(ms){if(ms<3600000)return `${Math.max(1,Math.round(ms/60000))} dakika`;if(ms<DAY)return `${Math.round(ms/3600000)} saat`;return `${Math.round(ms/DAY)} gün`;}
const api={SKILLS,DAY,skillFor,clean,record,due,review,passed,retained,activeUnit,plan,duration};root.MochiPedagogy=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
