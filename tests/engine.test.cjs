'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const data=require('../ui/lessons.js');
const engine=require('../ui/engine.js');
test('seven study languages, six levels, 212 curated sample cards',()=>{
 assert.equal(Object.keys(data.LANGS).length,7);
 assert.equal(data.LEVELS.length,6);
 assert.equal(data.cards.length,212);
 assert.equal(new Set(data.cards.map(x=>x.id)).size,212);
});
test('all study languages, levels, and modes include lessons',()=>{
 for(const lang of Object.keys(data.LANGS)){
  for(const level of data.LEVELS){
   for(const mode of ['mix','vocab','sentence','grammar']){
    assert.ok(engine.candidates(data.cards,{lang,level,mode}).length,lang+' '+level+' '+mode);
   }
  }
 }
});
test('meaning, example and translation are present',()=>{
 for(const c of data.cards){assert.ok(c.id&&c.front&&c.answer&&c.example);assert.ok(data.LEVELS.includes(c.level))}
});
test('settings are validated against allowlists',()=>{
 assert.deepEqual(engine.sanitizeConfig({lang:'bad',level:'X1',mode:'evil',auto:2,top:'yes'}),engine.DEFAULTS);
 assert.equal(engine.sanitizeConfig({lang:'ja',level:'C2',mode:'grammar',auto:30}).lang,'ja');
});
test('review scheduling moves correct answers further away',()=>{
 const t=Date.now(),once=engine.review({},'en:v:1',true,t);
 assert.equal(once['en:v:1'].interval,1);
 const twice=engine.review(once,'en:v:1',true,t);
 assert.ok(twice['en:v:1'].due>once['en:v:1'].due);
 const fail=engine.review(twice,'en:v:1',false,t);
 assert.equal(fail['en:v:1'].interval,0);
 assert.equal(fail['en:v:1'].due,t+300000);
});
test('card selection does not immediately repeat with a larger pool',()=>{
 const cfg={lang:'en',level:'A1',mode:'vocab'},first=engine.choose(data.cards,cfg,{},null);
 assert.ok(first);assert.notEqual(engine.choose(data.cards,cfg,{},first.id).id,first.id);
});
test('untrusted imported progress is sanitized',()=>{
 const clean=engine.safeRecords({'en:v:0':{interval:1,due:3000,seen:2,known:true},'evil':{interval:1,due:0},'en:v:1':{interval:'no',due:'bad'}},data.cards);
 assert.deepEqual(Object.keys(clean),['en:v:0']);
});