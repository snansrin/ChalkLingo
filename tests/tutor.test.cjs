'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const T=require('../ui/tutor.js');const L=require('../ui/lessons.js');const E=require('../ui/engine.js');
const A=require('../ui/ollama-bridge.cjs');
test('active retrieval prompts work for every language including scripts',()=>{
 for(const card of L.lessons){
  const deck=E.getDeck(L.lessons,{language:card.language,level:card.level,mode:card.mode});
  const q=T.questionFor(card,deck,()=>0.2);
  assert.ok(q.prompt.length>5);
  assert.equal(T.assess(q,card.front).status,'correct',card.id);
 }
});
test('wrong answers result in hint then reveal with review grade',()=>{
 const card=L.lessons.find(c=>c.mode==='vocab');const q=T.questionFor(card,[]);
 assert.equal(T.assess(q,'').status,'empty');
 assert.equal(T.assess(q,'wrong').status,'retry');
 assert.equal(T.assess(q,'wrong',{attempts:1}).grade,'again');
 assert.equal(T.assess(q,card.front,{attempts:1}).grade,'hard');
});
test('normalization is Unicode safe and does not fold distinct foreign characters',()=>{
 assert.equal(T.normalized('  HELLO!  '),'hello');
 assert.equal(T.normalized('İstanbul'),'istanbul');
 assert.notEqual(T.normalized('schon'),T.normalized('schön'));
 assert.equal(T.normalized('ありがとう'), 'ありがとう');
});
test('choice generation avoids duplicate distractors',()=>{
 const options=T.shuffledChoices('a',['a','b','B','c','c','d'],()=>.2);
 assert.equal(new Set(options).size,4);
});
test('AI tutor payload is constrained to local host and tightly bounded',()=>{
 const req={question:'Bunu açıklar mısın?',language:'en',level:'A1',model:'gemma3:4b',context:{front:'hello'}};
 const body=A.prepareBody(req);
 assert.equal(A.LOCAL_ENDPOINT,'http://127.0.0.1:11434/api/chat');
 assert.equal(body.stream,false);
 assert.match(JSON.stringify(body),/hello/);
 assert.throws(()=>A.prepareBody({...req,model:'http://evil.com'}));
 assert.throws(()=>A.prepareBody({...req,question:'x'.repeat(701)}));
 assert.throws(()=>A.prepareBody({...req,language:'xyz'}));
});
test('local AI chat has no arbitrary endpoint and validates reply',async()=>{
 const inp={question:'Selamı açıkla',language:'en',level:'A1',model:'gemma3:4b'};
 const result=await A.requestLocalTutor(inp,async(url,options)=>{
  assert.equal(url,A.LOCAL_ENDPOINT);assert.equal(options.redirect,'error');
  return {ok:true,headers:{get:()=>null},json:async()=>({message:{content:'Merhaba!'}})};
 });
 assert.equal(result,'Merhaba!');
});
test('settings sanitize AI model and opt-in',()=>{
 const a=E.sanitizeSettings({aiEnabled:true,aiModel:'local-model:latest'});
 assert.equal(a.aiEnabled,true);assert.equal(a.aiModel,'local-model:latest');
 assert.equal(E.sanitizeSettings({aiEnabled:'true',aiModel:'../oops?'}).aiEnabled,false);
});

test('hint-assisted recall schedules an earlier review than strong recall',()=>{
 const now=Date.UTC(2026,9,25);const good=E.review({},'en:vocab:001','good',now)['en:vocab:001'];
 const hard=E.review({},'en:vocab:001','hard',now)['en:vocab:001'];
 assert.ok(hard.due<good.due);assert.ok(hard.due>now);
});
