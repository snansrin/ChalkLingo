(function(){
'use strict';
const {lessons,packs}=window.CHALK_LESSONS;
const engine=window.ChalkEngine;
const $=id=>document.getElementById(id);
const STORAGE='chalklingo.v1';
const elements={
 board:$('board'),boardShell:$('boardShell'),lessonFront:$('lessonFront'),lessonAnswer:$('lessonAnswer'),
 lessonExample:$('lessonExample'),lessonPhonetic:$('lessonPhonetic'),cardType:$('cardType'),levelPill:$('levelPill'),
 lessonIndex:$('lessonIndex'),teacherTip:$('teacherTip'),progressText:$('progressText'),progressFill:$('progressFill'),
 modal:$('settingsOverlay')
};
let persisted={};
try{persisted=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};}catch{/* Recover from malformed storage */}
let settings=engine.sanitizeSettings(persisted.settings,Object.keys(packs));
let records=engine.normalizeRecords(persisted.records);
let current=null;
let transitioning=false;
let eraseTimer=null;
let manuallyPaused=false;
let desktopHidden=false;
let removeVisibilityListener=null;
let configuredInterval=-1;
let pendingCue=false;
const scheduler=window.ChalkRhythm.createScheduler(()=>{pendingCue=true;next();});
function quiet(){return window.ChalkRhythm.quiet(settings);}
function cue(kind){if(!quiet())window.ChalkAudio.play(kind,settings.volume);}
function mood(value){document.body.dataset.mood=value;}
function cancelTransition(){clearTimeout(eraseTimer);transitioning=false;pendingCue=false;elements.boardShell.classList.remove('is-erasing');}
function setPanel(expanded){
 document.body.classList.toggle('expanded',expanded);
 window.chalkDesktop?.setPanel(expanded).catch(()=>{});
}
let speakTimer=null;
let modalWasOpenedFrom=null;
const modeNames={vocab:'KELİME  /  VOCAB',sentence:'CÜMLE  /  SENTENCE',grammar:'GRAMER  /  GRAMMAR'};
const voiceFallback={en:'en-US',de:'de-DE',fr:'fr-FR',es:'es-ES',it:'it-IT',ru:'ru-RU',ja:'ja-JP'};
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify({settings,records}));}catch{/* Full or restricted local storage */}}
function deck(){return engine.getDeck(lessons,settings);}
function updateProgress(){
 const info=engine.stats(deck(),records);
 elements.progressText.textContent=`${info.learned} / ${info.total} öğrenildi`;
 elements.progressFill.style.width=`${info.pct}%`;
 $('seenStat').textContent=String(info.seen);
 $('learnedStat').textContent=String(info.learned);
 $('dueStat').textContent=String(info.due);
}
function setCurrent(card){
 current=card;
 if(!card){
  elements.lessonFront.textContent='Ders bulunamadı';
  elements.lessonAnswer.textContent='Ayarlarından farklı bir seviye seç.';
  elements.lessonExample.textContent='';
  elements.lessonPhonetic.textContent='';
  return;
 }
 records=engine.markSeen(records,card.id);
 persist();
 elements.cardType.textContent=modeNames[card.mode];
 elements.levelPill.textContent=`${settings.language.toUpperCase()} · ${settings.level}`;
 const isLong=card.front.length>42;
 elements.lessonFront.classList.toggle('long-word',isLong);
 elements.lessonFront.classList.toggle('japanese',card.language==='ja');
 elements.lessonFront.textContent=card.front;
 elements.lessonFront.title=card.front;
 elements.lessonPhonetic.textContent=card.phonetic;
 elements.lessonAnswer.textContent=settings.translation?card.answer:'Çeviriyi görmek için ayarlardan aç.';
 elements.lessonAnswer.classList.toggle('hidden-answer',!settings.translation);
 elements.lessonExample.textContent=card.example;
 elements.lessonExample.setAttribute('title',card.note);
 elements.teacherTip.title=card.note;
 elements.teacherTip.textContent=card.note||'Her gün küçük bir adım.';
 const list=deck();
 const index=list.findIndex(x=>x.id===card.id)+1;
 elements.lessonIndex.textContent=`${String(index).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}`;
 if(!settings.reduceMotion){
  elements.lessonFront.classList.remove('chalk-writing');
  void elements.lessonFront.offsetWidth;
  elements.lessonFront.classList.add('chalk-writing');
 }
 updateProgress();
 scheduler.reset();restartAuto();mood('teaching');
 if(pendingCue&&settings.notificationSound)cue(settings.tone);
 pendingCue=false;
 if(settings.sound&&!quiet()){clearTimeout(speakTimer);speakTimer=setTimeout(()=>{if(!quiet())speak();},600);}
}
function next(immediate=false){
 if(transitioning)return;
 scheduler.pause();clearTimeout(speakTimer);
 if(window.speechSynthesis)window.speechSynthesis.cancel();
 const show=()=>setCurrent(engine.selectNext(deck(),records,current?.id));
 if(immediate||settings.reduceMotion){show();return;}
 transitioning=true;
 elements.boardShell.classList.add('is-erasing');
 eraseTimer=setTimeout(()=>{
  show();
  elements.boardShell.classList.remove('is-erasing');
  transitioning=false;
 },480);
}
function rate(score){
 if(!current||transitioning)return;
 if(settings.lessonSound)cue(score==='good'?'correct':'retry');
 records=engine.review(records,current.id,score);
 persist();
 updateProgress();
 next();
}
function speak(){
 if(!current||!('speechSynthesis' in window))return;
 window.speechSynthesis.cancel();
 try{
  const text=current.front.replace(/[（(][^)）]+[)）]/g,'').replace(/\s*\/\s*/g,' / ');
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang=voiceFallback[current.language];
  utterance.rate=current.language==='ja'?0.83:0.87;
  utterance.pitch=1.03;utterance.volume=settings.volume;
  utterance.onstart=()=>document.body.classList.add('speaking');
  utterance.onend=utterance.onerror=()=>document.body.classList.remove('speaking');
  const candidates=window.speechSynthesis.getVoices();
  const same=candidates.find(v=>v.lang.toLowerCase()===utterance.lang.toLowerCase())||candidates.find(v=>v.lang.toLowerCase().startsWith(current.language));
  if(same)utterance.voice=same;
  window.speechSynthesis.speak(utterance);
 }catch{/* System may not provide a voice */}
}
function restartAuto(){
 if(configuredInterval!==settings.interval){configuredInterval=settings.interval;scheduler.configure(settings.interval);}
 const blocked=manuallyPaused||!elements.modal.hidden||!$('practiceOverlay').hidden||document.hidden||desktopHidden;
 if(blocked)scheduler.pause();else scheduler.resume();
 $('pauseAuto').hidden=!settings.interval;
 $('pauseAuto').textContent=manuallyPaused?'Devam et':'Duraklat';
 $('rhythmStatus').textContent=!settings.interval?'● Kendi ritminde · otomatik geçiş kapalı':manuallyPaused?'Ⅱ Öğrenme akışı duraklatıldı':
  '● '+(settings.interval<60?settings.interval+' saniyede':settings.interval/60+' dakikada')+' bir yeni keşif';
}
function fillOptions(){
 const select=$('languageSelect');
 for(const [id,item] of Object.entries(packs)){
  const option=document.createElement('option');option.value=id;option.textContent=item.name;select.append(option);
 }
}
function syncForm(){
 $('languageSelect').value=settings.language;
 $('levelSelect').value=settings.level;
 $('modeSelect').value=settings.mode;
 $('intervalSelect').value=String(settings.interval);
 $('soundToggle').checked=settings.sound;
 $('notificationToggle').checked=settings.notificationSound;$('lessonSoundToggle').checked=settings.lessonSound;
 $('volumeRange').value=String(settings.volume*100);$('toneSelect').value=settings.tone;
 $('quietToggle').checked=settings.quietEnabled;$('quietStart').value=String(settings.quietStart);$('quietEnd').value=String(settings.quietEnd);
 $('sessionSize').value=String(settings.sessionSize);
 $('translationToggle').checked=settings.translation;
 $('alwaysTopToggle').checked=settings.alwaysTop;
 $('motionToggle').checked=settings.reduceMotion;
 $('aiToggle').checked=settings.aiEnabled;
 $('aiModel').value=settings.aiModel;
 updateProgress();
}
function applySettings(){
 const old={...settings};
 cancelTransition();clearTimeout(speakTimer);window.speechSynthesis?.cancel();
 settings=engine.sanitizeSettings({
  language:$('languageSelect').value,level:$('levelSelect').value,mode:$('modeSelect').value,
  notificationSound:$('notificationToggle').checked,lessonSound:$('lessonSoundToggle').checked,
  volume:Number($('volumeRange').value)/100,tone:$('toneSelect').value,
  quietEnabled:$('quietToggle').checked,quietStart:Number($('quietStart').value),quietEnd:Number($('quietEnd').value),
  sessionSize:Number($('sessionSize').value),interval:Number($('intervalSelect').value),sound:$('soundToggle').checked,
  translation:$('translationToggle').checked,alwaysTop:$('alwaysTopToggle').checked,
  reduceMotion:$('motionToggle').checked,aiEnabled:$('aiToggle').checked,aiModel:$('aiModel').value.trim()
 },Object.keys(packs));
 document.body.classList.toggle('reduce-motion',settings.reduceMotion);
 persist();
 if(old.alwaysTop!==settings.alwaysTop&&window.chalkDesktop?.setAlwaysOnTop){
  window.chalkDesktop.setAlwaysOnTop(settings.alwaysTop).catch(()=>{});
 }
 if(old.language!==settings.language||old.level!==settings.level||old.mode!==settings.mode)next(true);
 else if(current)setCurrentWithoutCounting();
 restartAuto();
 updateProgress();
}
function setCurrentWithoutCounting(){
 if(!current)return;
 elements.lessonAnswer.textContent=settings.translation?current.answer:'Çeviriyi görmek için ayarlardan aç.';
 elements.lessonAnswer.classList.toggle('hidden-answer',!settings.translation);
}
function openSettings(){
 if(!$('practiceOverlay').hidden)return;
 setPanel(true);
 cancelTransition();clearTimeout(speakTimer);window.speechSynthesis?.cancel();document.body.classList.add('settings-open');
 scheduler.pause();
 modalWasOpenedFrom=document.activeElement;
 syncForm();
 elements.modal.hidden=false;
 $('closeSettings').focus();
}
function closeSettings(){
 applySettings();
 elements.modal.hidden=true;document.body.classList.remove('settings-open');
 setPanel(false);
 if(modalWasOpenedFrom instanceof HTMLElement)modalWasOpenedFrom.focus();
 restartAuto();
}
function exportData(){
 const data={app:'ChalkLingo',version:1,exportedAt:new Date().toISOString(),settings,records};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='chalklingo-ilerleme.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
async function importData(file){
 if(!file||file.size>5*1024*1024){window.alert('Geçerli ve 5 MB altında bir JSON dosyası seç.');return;}
 try{
  const data=JSON.parse(await file.text());
  if(data.app!=='ChalkLingo'||data.version!==1||!data.records||typeof data.records!=='object')throw new Error('Invalid backup format');
  if(!window.confirm('Mevcut ilerlemenin üzerine yedek yüklensin mi?'))return;
  settings=engine.sanitizeSettings(data.settings,Object.keys(packs));
  records=engine.normalizeRecords(data.records);
  persist();syncForm();next(true);
  document.body.classList.toggle('reduce-motion',settings.reduceMotion);
  if(window.chalkDesktop?.setAlwaysOnTop)window.chalkDesktop.setAlwaysOnTop(settings.alwaysTop).catch(()=>{});
  window.alert('Yedek geri yüklendi.');
 }catch{window.alert('Yedek açılamadı: geçersiz veya bozuk JSON dosyası.');}
}
function resetData(){
 if(!window.confirm('Tüm öğrenme ilerlemen silinecek. Devam edilsin mi?'))return;
 records={};persist();updateProgress();next(true);syncForm();
}
function attach(){
 setPanel(false);
 fillOptions();
 for(let h=0;h<24;h++)for(const id of ['quietStart','quietEnd']){const o=document.createElement('option');o.value=String(h);o.textContent=String(h).padStart(2,'0')+':00';$(id).append(o);}
 syncForm();
 $('pauseAuto').addEventListener('click',()=>{manuallyPaused=!manuallyPaused;restartAuto();});
 $('previewSound').addEventListener('click',()=>window.ChalkAudio.play($('toneSelect').value,Number($('volumeRange').value)/100));
 $('todayDate').textContent=new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'short'}).format(new Date()).toUpperCase();
 document.body.classList.toggle('reduce-motion',settings.reduceMotion);
 elements.board.addEventListener('click',()=>next());
 elements.board.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();next();}});
 $('nextBtn').addEventListener('click',()=>next());
 $('learnBtn').addEventListener('click',()=>rate('good'));
 $('repeatBtn').addEventListener('click',()=>rate('again'));
 $('speakBtn').addEventListener('click',speak);
 $('settingsBtn').addEventListener('click',openSettings);
 document.addEventListener('chalk:review',()=>{try{records=engine.normalizeRecords(JSON.parse(localStorage.getItem(STORAGE)||'{}').records);}catch{}updateProgress();});
 document.addEventListener('chalk:practiceOpened',()=>{setPanel(true);cancelTransition();scheduler.pause();clearTimeout(speakTimer);window.speechSynthesis?.cancel();mood('thinking');});
 document.addEventListener('chalk:feedback',e=>{mood(e.detail);if(settings.lessonSound)cue(e.detail);});
 document.addEventListener('chalk:practiceClosed',()=>{setPanel(false);next(true);restartAuto();});
 $('closeSettings').addEventListener('click',closeSettings);
 $('doneSettings').addEventListener('click',closeSettings);
 $('exportBtn').addEventListener('click',exportData);
 $('importBtn').addEventListener('click',()=>$('importFile').click());
 $('importFile').addEventListener('change',async e=>{const f=e.target.files?.[0];if(f)await importData(f);e.target.value='';});
 $('resetBtn').addEventListener('click',resetData);
 const visibilityChanged=()=>{
  const hidden=document.hidden||desktopHidden;
  document.body.classList.toggle('suspended',hidden);
  if(hidden){cancelTransition();scheduler.pause();clearTimeout(speakTimer);window.speechSynthesis?.cancel();}else restartAuto();
 };
 document.addEventListener('visibilitychange',visibilityChanged);
 removeVisibilityListener=window.chalkDesktop?.onVisibility(hidden=>{desktopHidden=hidden;visibilityChanged();});
 $('minimizeBtn').addEventListener('click',()=>window.chalkDesktop?.minimize());
 $('closeBtn').addEventListener('click',()=>window.chalkDesktop?.close()||window.close());
 document.addEventListener('contextmenu',e=>{e.preventDefault();if(elements.modal.hidden)openSettings();});
 elements.modal.addEventListener('click',e=>{if(e.target===elements.modal)closeSettings();});
 const focusable='button,select,input,a[href]';
 document.addEventListener('keydown',e=>{
  if(!$('practiceOverlay').hidden)return;
  if(!elements.modal.hidden){
   if(e.key==='Escape'){e.preventDefault();closeSettings();return;}
   if(e.key==='Tab'){
    const nodes=[...elements.modal.querySelectorAll(focusable)].filter(x=>!x.disabled&&x.getClientRects().length);
    if(!nodes.length)return;
    const first=nodes[0],last=nodes[nodes.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   }
   return;
  }
  if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;
  const key=e.key.toLowerCase();
  if(key==='s'){e.preventDefault();openSettings();}
  else if(key==='r'){e.preventDefault();speak();}
  else if(key==='1'){e.preventDefault();rate('again');}
  else if(key==='2'){e.preventDefault();rate('good');}
  else if(e.code==='Space'&&e.target!==elements.board&&!(e.target instanceof HTMLButtonElement)){e.preventDefault();next();}
 });
 if(window.chalkDesktop?.getAlwaysOnTop){window.chalkDesktop.getAlwaysOnTop().then(flag=>{
   if(typeof flag==='boolean'&&flag!==settings.alwaysTop)window.chalkDesktop.setAlwaysOnTop(settings.alwaysTop).catch(()=>{});
  }).catch(()=>{});}
 const initial=engine.selectNext(deck(),records);
 setCurrent(initial);
}
window.addEventListener('beforeunload',()=>{removeVisibilityListener?.();scheduler.dispose();window.speechSynthesis?.cancel();clearTimeout(speakTimer);clearTimeout(eraseTimer);});
attach();
})();
