'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const engine=require('../ui/engine.js');
const data=require('../ui/lessons.js');
test('seven languages, every proficiency band and study mode has lessons',()=>{
 assert.equal(Object.keys(data.packs).length,7);
 assert.ok(data.lessons.length>=170);
 for(const language of Object.keys(data.packs))for(const level of engine.LEVELS)for(const mode of engine.MODES){
  const deck=engine.getDeck(data.lessons,{language,level,mode});
  assert.ok(deck.length>0,`${language} ${level} ${mode} missing`);
  assert.ok(deck.every(c=>c.front.trim()&&c.answer.trim()&&c.example.trim()&&c.note.trim()));
 }
});
test('all lesson IDs unique and language references valid',()=>{
 const ids=data.lessons.map(c=>c.id);
 assert.equal(new Set(ids).size,ids.length);
 for(const c of data.lessons){assert.ok(data.packs[c.language]);assert.ok(engine.LEVELS.includes(c.level));}
});
test('unknown/corrupt settings are sanitized',()=>{
 const s=engine.sanitizeSettings({language:'xx',level:'Z9',mode:'danger',interval:-99,alwaysTop:'yes',translation:false});
 assert.equal(s.language,'en');assert.equal(s.level,'A1');assert.equal(s.mode,'mix');assert.equal(s.interval,0);
 assert.equal(s.alwaysTop,false);assert.equal(s.translation,false);
});
test('new cards are chosen before seen cards, no immediate repeat',()=>{
 const cards=[{id:'a'},{id:'b'},{id:'c'}];
 let rec=engine.markSeen({},'a',100);
 const chosen=engine.selectNext(cards,rec,'a',200,()=>0);
 assert.notEqual(chosen.id,'a');assert.equal(chosen.id,'b');
 assert.equal(engine.selectNext([cards[0]],rec,'a').id,'a');
});
test('repetition schedule and again reset work',()=>{
 const now=Date.UTC(2026,9,25);
 let rec=engine.markSeen({},'en:vocab:000',now);
 rec=engine.review(rec,'en:vocab:000','good',now);
 assert.equal(rec['en:vocab:000'].interval,1);
 assert.equal(rec['en:vocab:000'].due,now+86400000);
 rec=engine.review(rec,'en:vocab:000','good',now+86400000);
 assert.equal(rec['en:vocab:000'].interval,6);
 rec=engine.review(rec,'en:vocab:000','again',now+86400000);
 assert.equal(rec['en:vocab:000'].repetitions,0);
 assert.equal(rec['en:vocab:000'].due,now+86400000+300000);
});
test('records can be reloaded safely; statistics remain bounded',()=>{
 const r=engine.normalizeRecords({'en:vocab:000':{seen:3,ease:999,due:0,learned:true},'__proto__':{bad:true},'hack':{seen:2}});
 assert.equal(Object.keys(r).length,1);
 assert.equal(r['en:vocab:000'].ease,3);
 const deck=engine.getDeck(data.lessons,{language:'en',level:'A1',mode:'vocab'});
 const info=engine.stats(deck,r);
 assert.equal(info.learned,1);assert.equal(info.seen,1);
});
