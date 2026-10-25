(function(root){
'use strict';
const DEFAULTS=Object.freeze({lang:'en',level:'A1',mode:'mix',auto:0,animation:true,top:false});
const MODES=['mix','vocab','sentence','grammar'],AUTOS=[0,30,60,120,300];
function sanitizeConfig(raw){
 const s=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 return {
  lang:Object.hasOwn(ChalkData.LANGS,s.lang)?s.lang:DEFAULTS.lang,
  level:ChalkData.LEVELS.includes(s.level)?s.level:DEFAULTS.level,
  mode:MODES.includes(s.mode)?s.mode:DEFAULTS.mode,
  auto:AUTOS.includes(Number(s.auto))?Number(s.auto):0,
  animation:typeof s.animation==='boolean'?s.animation:true,
  top:typeof s.top==='boolean'?s.top:false
 };
}
function candidates(cards,config){return cards.filter(c=>c.lang===config.lang&&c.level===config.level&&(config.mode==='mix'||c.kind===config.mode))}
function choose(cards,config,records,lastId,now=Date.now()){
 const pool=candidates(cards,config);if(!pool.length)return null;
 const options=pool.length>1?pool.filter(c=>c.id!==lastId):pool;
 const due=options.filter(c=>records[c.id]&&Number(records[c.id].due)<=now);
 const unseen=options.filter(c=>!records[c.id]);
 const source=due.length?due:unseen.length?unseen:options;
 return source[Math.floor(Math.random()*source.length)];
}
function review(records,id,known,now=Date.now()){
 const old=records[id]&&typeof records[id]==='object'?records[id]:{};
 const previous=Math.max(0,Math.min(365,Number(old.interval)||0));
 const next=known?(previous===0?1:Math.min(365,Math.ceil(previous*2.35))):0;
 return {...records,[id]:{interval:next,due:now+(known?next*86400000:300000),seen:(Number(old.seen)||0)+1,known:!!known}};
}
function safeRecords(raw,cards){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
 const valid=new Set(cards.map(c=>c.id)),out=Object.create(null);
 for(const [id,v] of Object.entries(raw)){
  if(!valid.has(id)||!v||typeof v!=='object')continue;
  if(!Number.isFinite(v.due)||!Number.isFinite(v.interval))continue;
  out[id]={due:Math.max(0,Math.min(1e16,v.due)),interval:Math.max(0,Math.min(365,v.interval)),seen:Math.max(0,Math.min(1e6,Number(v.seen)||0)),known:v.known===true};
 }
 return out;
}
const api={DEFAULTS,sanitizeConfig,candidates,choose,review,safeRecords};
root.ChalkEngine=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);