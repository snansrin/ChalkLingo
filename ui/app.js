(function(){
'use strict';
const {cards,LANGS}=ChalkData;
const {sanitizeConfig,choose,review,safeRecords,candidates}=ChalkEngine;
const $=id=>document.getElementById(id);
const STORE_SETTINGS='chalklingo.settings.v1',STORE_RECORDS='chalklingo.records.v1';
const get=(key)=>{try{return JSON.parse(localStorage.getItem(key))}catch{return null}};
let cfg=sanitizeConfig(get(STORE_SETTINGS));
let records=safeRecords(get(STORE_RECORDS),cards);
let current=null,timer=null,transition=null;
const save=()=>{try{localStorage.setItem(STORE_SETTINGS,JSON.stringify(cfg));localStorage.setItem(STORE_RECORDS,JSON.stringify(records))}catch{status('Depolama kullanılamıyor')}};
const status=message=>{$('statusLabel').textContent=message};
const kindLabel={vocab:'KELİME / VOCAB',sentence:'CÜMLE / SENTENCE',grammar:'DİL BİLGİSİ / GRAMMAR'};
const modeLabel={mix:'Karma ders',vocab:'Kelimeler',sentence:'Cümleler',grammar:'Dil bilgisi'};
const today=new Intl.DateTimeFormat('tr-TR',{day:'2-digit',month:'short'}).format(new Date()).toUpperCase();
$('dateLabel').textContent=today;
function refreshCounts(){
 const selected=Object.values(records).filter(r=>r.known).length;
 $('counter').textContent=selected+' ÖĞRENİLDİ';
 $('languageLabel').textContent=LANGS[cfg.lang][0];
 $('modeLabel').textContent=modeLabel[cfg.mode];
 const pool=candidates(cards,cfg);
 $('positionLabel').textContent=String(pool.indexOf(current)+1).padStart(2,'0')+' / '+pool.length;
}
function render(card){
 if(!card)return status('Bu filtrede ders yok.');
 current=card;
 $('kindLabel').textContent=kindLabel[card.kind];
 $('levelLabel').textContent=card.lang.toUpperCase()+' · '+card.level;
 $('lessonFront').textContent=card.front;
 $('lessonAnswer').textContent=card.answer;
 $('lessonExample').textContent=card.example||'';
 $('lessonNote').textContent=card.note||'';
 const surface=$('lessonContent');
 surface.classList.remove('writing');
 void surface.offsetWidth;
 surface.classList.add('writing');
 refreshCounts();
 status(records[card.id]?.known?'Tekrar zamanı!':'Yeni bir şey öğren ✨');
}
function next(immediate=false){
 if(transition)clearTimeout(transition);
 const upcoming=choose(cards,cfg,records,current?.id);
 if(!upcoming)return;
 const board=$('board');
 if(immediate||!cfg.animation||matchMedia('(prefers-reduced-motion: reduce)').matches){render(upcoming);return}
 board.classList.add('erasing');
 transition=setTimeout(()=>{board.classList.remove('erasing');render(upcoming);transition=null},370);
}
function mark(known){
 if(!current)return;
 records=review(records,current.id,known);
 save();
 status(known?'Harika! Tekrar için kaydettim.':'5 dakika sonra tekrar edeceğiz.');
 next();
}
function speak(){
 if(!current)return;
 if(!('speechSynthesis'in window)){status('Bu cihazda konuşma desteği yok.');return}
 speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(current.kind==='grammar'?current.example:current.front);
 utterance.lang=LANGS[current.lang][1];utterance.rate=.83;
 const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(current.lang==='ja'?'ja':current.lang));
 if(voice)utterance.voice=voice;
 speechSynthesis.speak(utterance);
 status('Telaffuzu dinle ve tekrar et.');
}
function setTimer(){
 if(timer){clearInterval(timer);timer=null}
 if(cfg.auto)timer=setInterval(()=>{if(document.visibilityState==='visible'&&!$('settingsPanel').classList.contains('open'))next()},cfg.auto*1000);
}
function openSettings(){
 $('settingsPanel').classList.add('open');$('settingsPanel').setAttribute('aria-hidden','false');$('closeSettings').focus();
}
function closeSettings(){
 $('settingsPanel').classList.remove('open');$('settingsPanel').setAttribute('aria-hidden','true');$('settingsButton').focus();
}
function applyConfig(){
 for(const [id,key] of [['language','lang'],['level','level'],['mode','mode'],['auto','auto']])$(id).value=cfg[key];
 $('animation').checked=cfg.animation;
 $('alwaysTop').checked=cfg.top;
 document.body.classList.toggle('reduce-motion',!cfg.animation);
 setTimer();
}
for(const [id,key] of [['language','lang'],['level','level'],['mode','mode'],['auto','auto']]){
 $(id).addEventListener('change',()=>{cfg=sanitizeConfig({...cfg,[key]:$(id).value});save();applyConfig();current=null;next(true)});
}
$('animation').addEventListener('change',()=>{cfg.animation=$('animation').checked;save();applyConfig()});
$('alwaysTop').addEventListener('change',async()=>{
 cfg.top=$('alwaysTop').checked;save();
 try{await window.chalkDesktop?.setTop(cfg.top)}catch{status('Üstte tutma yalnızca masaüstü uygulamasında çalışır.')}
});
$('board').addEventListener('click',()=>next());
$('board').addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();next()}});
$('learnedButton').addEventListener('click',()=>mark(true));
$('againButton').addEventListener('click',()=>mark(false));
$('speechButton').addEventListener('click',speak);
$('settingsButton').addEventListener('click',openSettings);
$('closeSettings').addEventListener('click',closeSettings);
document.addEventListener('contextmenu',event=>{event.preventDefault();openSettings()});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){closeSettings();return}
 if(event.target.matches('INPUT,SELECT,TEXTAREA'))return;
 if(event.key.toLowerCase()==='s'){openSettings();return}
 if($('settingsPanel').classList.contains('open'))return;
 if(event.key===' '){event.preventDefault();next()}
 else if(event.key==='1')mark(false);
 else if(event.key==='2')mark(true);
 else if(event.key.toLowerCase()==='r')speak();
});
$('minimizeButton').addEventListener('click',()=>window.chalkDesktop?.minimize());
$('closeButton').addEventListener('click',()=>window.chalkDesktop?.close());
$('exportButton').addEventListener('click',()=>{
 const json=JSON.stringify({version:1,settings:cfg,records},null,2);
 const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='chalklingo-ilerleme.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),3000);status('Yedek oluşturuldu.');
});
$('importButton').addEventListener('click',()=>$('importFile').click());
$('importFile').addEventListener('change',async()=>{
 const f=$('importFile').files?.[0];if(!f)return;
 if(f.size>1_000_000){status('Dosya çok büyük.');return}
 try{
  const json=JSON.parse(await f.text());
  if(json.version!==1||!json.settings||!json.records)throw Error('Geçersiz biçim');
  cfg=sanitizeConfig(json.settings);records=safeRecords(json.records,cards);
  save();applyConfig();current=null;next(true);status('İlerleme içe aktarıldı.');
 }catch{status('Yedek dosyası okunamadı.')}
 $('importFile').value='';
});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')window.speechSynthesis?.cancel?.()});
applyConfig();next(true);
})();