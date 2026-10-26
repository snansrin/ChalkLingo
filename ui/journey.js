(function(root){
'use strict';
const LANGUAGES=['en','de','fr','es','it','ru','ja'],LEVELS=['A1','A2','B1','B2','C1','C2'];
const REWARDS=[
 {id:'plain',name:'Sade Mochi',icon:'♡',threshold:0,description:'İlk günden senin.'},
 {id:'leaf',name:'Filiz tacı',icon:'♧',threshold:3,description:'3 farklı kelimeyi doğru hatırla.'},
 {id:'blossom',name:'Çiçek tacı',icon:'✿',threshold:10,description:'10 farklı kelimeyi doğru hatırla.'},
 {id:'explorer',name:'Gezgin şapkası',icon:'⌂',threshold:20,description:'20 farklı kelimeyi doğru hatırla.'},
 {id:'stars',name:'Yıldız arkadaşı',icon:'✧',threshold:35,description:'35 farklı kelimeyi doğru hatırla.'}
];
const bounded=(n,max=999999)=>Number.isFinite(Number(n))?Math.max(0,Math.min(max,Math.floor(Number(n)))):0;
function cleanCard(card){
 if(!card||typeof card!=='object'||!/^user:[a-z0-9-]{1,60}$/.test(card.id)||!LANGUAGES.includes(card.language)||!LEVELS.includes(card.level))return null;
 const text=(key,max)=>typeof card[key]==='string'?card[key].normalize('NFKC').trim().slice(0,max):'';
 const front=text('front',150),answer=text('answer',200);if(!front||!answer)return null;
 return {id:card.id,language:card.language,level:card.level,mode:'vocab',front,answer,example:text('example',400)||front,note:text('note',300)||'Kendi kelime defterinden.',phonetic:text('phonetic',100),archived:card.archived===true};
}
function cleanExtras(v={}){
 const cards=new Map();for(const raw of (Array.isArray(v.journal)?v.journal:[]).slice(0,500)){const card=cleanCard(raw);if(card)cards.set(card.id,card);}
 const journey=v.journey&&typeof v.journey==='object'?v.journey:{};
 const logs=(Array.isArray(journey.logs)?journey.logs:[]).slice(-2000).filter(x=>x&&typeof x.id==='string'&&x.id.length<=100&&Number.isFinite(x.at)&&typeof x.correct==='boolean').map(x=>({id:x.id,at:Math.max(0,x.at),correct:x.correct,mode:['write','build','listen','recall'].includes(x.mode)?x.mode:'recall'}));
 return {schemaVersion:2,journal:[...cards.values()],favorites:[...new Set((Array.isArray(v.favorites)?v.favorites:[]).filter(x=>typeof x==='string'&&x.length<=100))].slice(0,1000),journey:{logs,highWater:bounded(journey.highWater,5000),goal:[3,5,10].includes(journey.goal)?journey.goal:5,unlocked:[...new Set(['plain',...(Array.isArray(journey.unlocked)?journey.unlocked:[]).filter(id=>REWARDS.some(r=>r.id===id))])],accessory:REWARDS.some(r=>r.id===journey.accessory)?journey.accessory:'plain'}};
}
function dayKey(now=Date.now()){const d=new Date(now);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function today(state,now=Date.now()){return [...new Set(state.journey.logs.filter(x=>x.correct&&dayKey(x.at)===dayKey(now)).map(x=>x.id))];}
function syncRewards(state){const count=Object.values(state.records).filter(r=>(r.best||r.streak)>0).length;state.journey.highWater=Math.max(state.journey.highWater,count);const fresh=[];for(const r of REWARDS)if(state.journey.highWater>=r.threshold&&!state.journey.unlocked.includes(r.id)){state.journey.unlocked.push(r.id);fresh.push(r);}if(!state.journey.unlocked.includes(state.journey.accessory))state.journey.accessory='plain';return fresh;}
function record(state,id,correct,mode,now){state.journey??=cleanExtras().journey;state.journey.logs.push({id,correct,mode,at:now});state.journey.logs=state.journey.logs.slice(-2000);return syncRewards(state);}
function queue(deck,state,now=Date.now(),limit=5){
 const available=deck.filter(x=>!state.records[x.id]||state.records[x.id].due<=now);
 const pool=available.length?available:deck;
 const rank=x=>!state.records[x.id]?1:state.records[x.id].due<=now?0:2;
 return {cards:pool.slice().sort((a,b)=>rank(a)-rank(b)||(state.records[a.id]?.due||0)-(state.records[b.id]?.due||0)).slice(0,limit),practiceOnly:!available.length};
}
function mistakes(deck,state){return deck.filter(x=>{const r=state.records[x.id];return r&&r.lastWrong>r.lastCorrect;}).sort((a,b)=>(state.records[b.id].lapses||0)-(state.records[a.id].lapses||0));}
function notePractice(state,id,correct,now=Date.now()){const r=state.records[id];if(!r)return;if(correct)r.lastCorrect=now;else{r.lastWrong=now;r.lapses=(r.lapses||0)+1;}}
function summary(deck,state,now=Date.now()){const list=deck.filter(x=>!x.archived);return{total:list.length,due:list.filter(x=>state.records[x.id]?.due<=now).length,fresh:list.filter(x=>!state.records[x.id]).length,growing:list.filter(x=>(state.records[x.id]?.best||state.records[x.id]?.streak)>0).length,today:today(state,now).length,goal:state.journey.goal,mistakes:mistakes(list,state).length};}
const api={REWARDS,LANGUAGES,LEVELS,cleanCard,cleanExtras,dayKey,today,syncRewards,record,queue,mistakes,notePractice,summary};root.MochiJourney=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
