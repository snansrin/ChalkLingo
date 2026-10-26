'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {available,choose}=require('../ui/speech.js');
const voice=(name,lang,localService=true)=>({name,voiceURI:name,lang,localService});
test('English never falls back to Turkish',()=>{
 assert.equal(choose([voice('Turkish','tr-TR'),voice('English','en-US')],'en').name,'English');
 assert.equal(choose([voice('Turkish','tr-TR')],'en'),null);
});
test('US English is preferred and UK English is valid',()=>{
 assert.equal(choose([voice('UK','en-GB'),voice('US','en-US')],'en').name,'US');
 assert.equal(choose([voice('UK','en-GB')],'en').name,'UK');
});
test('remote voices do not pass the offline guard',()=>{
 assert.equal(choose([voice('Remote','en-US',false)],'en'),null);
 assert.deepEqual(available([voice('German','de-DE'),voice('English','en-US')],'de').map(x=>x.name),['German']);
});
test('explicit voice selection respects language',()=>{
 const voices=[voice('Alice','en-GB'),voice('Bob','en-US'),voice('Turkish','tr-TR')];
 assert.equal(choose(voices,'en','Alice').name,'Alice');
 assert.equal(choose(voices,'en','Turkish').name,'Bob');
});
test('seven languages do not use a mismatched system voice',()=>{
 for(const lang of ['en','de','fr','es','it','ru','ja']){
  assert.equal(choose([voice('TR','tr-TR'),voice('Target',lang+'-XX')],lang).name,'Target');
 }
 assert.equal(choose([voice('US','en-US')],'xx'),null);
});