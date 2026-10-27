'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const {Wordbank}=require('../ui/wordbank-core.js'),{readPack}=require('../ui/wordbank-store.cjs'),M=require('../ui/memory.js'),{createProgressStore}=require('../ui/progress-store.cjs');
const manifest=require('../ui/lexicon/manifest.json');
const samples={en:['water','su'],de:['Wasser','su'],fr:['eau','su'],es:['agua','su'],it:['acqua','su'],ru:['вода','su'],ja:['水','su']};
test('seven offline packs each have 10000 real Unicode headwords, pinned bytes and bounded pages',async()=>{
 assert.deepEqual(Object.keys(manifest.packs),Object.keys(samples));let total=0;
 for(const [language,[word,meaning]] of Object.entries(samples)){
  const data=JSON.parse(await readPack(language)),bank=new Wordbank(data);total+=manifest.packs[language].bytes;
  assert.equal(bank.language,language);assert.equal(bank.count,10000);assert.equal(new Set(data.rows.map(r=>r[0].normalize('NFC').toLowerCase())).size,10000);
  assert.ok(bank.lookup(word).meanings.includes(meaning),language);assert.equal(bank.lookup(bank.lookup(word).id).front,word);assert.equal(bank.lookup('bank:xx:'+word),null);
  assert.equal(bank.search('',0,99999).cards.length,40);assert.ok(bank.search('SU').cards.length);assert.equal(bank.pool(M.clean({})).length,20);
  assert.ok(manifest.packs[language].bytes<250000);assert.equal(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'../ui/lexicon',manifest.packs[language].source))).toString('utf8').split('\n').length,10002);
 }
 assert.ok(total<1100000);await assert.rejects(readPack('__proto__'));await assert.rejects(readPack('EN'));
});
test('70000 multilingual records, favorites and scheduler histories survive compressed persistence',()=>{
 const base=path.join(__dirname,'../.qa');fs.mkdirSync(base,{recursive:true});const dir=fs.mkdtempSync(path.join(base,'seven-progress-')),store=createProgressStore(dir),s=M.clean({});M.grade(s,'template',true,100000,'write');const r=s.records.template,skill=s.education.skills.template;delete s.records.template;delete s.education.skills.template;
 for(const l of Object.keys(samples))for(let i=0;i<10000;i++){const id='bank:'+l+':fixture'+i;s.records[id]=r;s.education.skills[id]=skill;s.education.introduced[id]=100000;s.favorites.push(id);}
 const text=JSON.stringify(s);store.save(text);const restored=M.clean(JSON.parse(store.load()));assert.equal(Object.keys(restored.records).length,70000);assert.equal(Object.keys(restored.education.skills).length,70000);assert.equal(Object.keys(restored.education.introduced).length,70000);assert.equal(restored.favorites.length,70000);assert.ok(restored.education.skills['bank:ja:fixture9999'].production.card);assert.ok(fs.statSync(path.join(dir,'learning-progress.json.gz')).size<Buffer.byteLength(text)/10);
});
