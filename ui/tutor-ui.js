/** Accessible interactive classroom layered over the compact chalkboard. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 const tutor=window.ChalkTutor, lessons=window.CHALK_LESSONS.lessons,engine=window.ChalkEngine;
 const dialog=$('practiceOverlay'),prompt=$('practicePrompt'),typeInput=$('practiceInput'),choices=$('practiceChoices'),feedback=$('practiceFeedback');
 let card=null,question=null,attempts=0,usedHint=false,finished=false,selected='',lastFocus=null;
 let stats={attempted:0,correct:0};
 let goal=5;
 const storageKey='chalklingo.v1';
 function data(){try{const parsed=JSON.parse(localStorage.getItem(storageKey)||'{}');return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};}catch{return {};}}
 function updateReview(id,grade){
   const current=data();const records=engine.normalizeRecords(current.records);
   current.records=engine.review(records,id,grade);
   try{localStorage.setItem(storageKey,JSON.stringify(current));}catch{/* storage disabled */}
   document.dispatchEvent(new CustomEvent('chalk:review',{detail:{id,grade}}));
 }
 function deck(){const s=engine.sanitizeSettings(data().settings,Object.keys(window.CHALK_LESSONS.packs));return engine.getDeck(lessons,s);}
 function setText(el,value){el.textContent=value||'';}
 function open(){
   lastFocus=document.activeElement;
   dialog.hidden=false;
   document.dispatchEvent(new Event('chalk:practiceOpened'));
   document.body.classList.add('practicing');
   stats={attempted:0,correct:0};goal=engine.sanitizeSettings(data().settings).sessionSize;
   next();
   $('practiceClose').focus();
 }
 function close(){
   dialog.hidden=true;document.body.classList.remove('practicing');
   if(lastFocus instanceof HTMLElement)lastFocus.focus();
   document.dispatchEvent(new Event('chalk:practiceClosed'));
 }
 function render(){
   $('sessionSummary').hidden=true;$('practiceContinue').textContent='Sonraki alıştırma →';
   $('sessionFill').style.width=(stats.attempted/goal*100)+'%';
   finished=false;attempts=0;usedHint=false;selected='';
   $('practiceContinue').hidden=true;$('practiceCheck').hidden=false;
   $('practiceHint').hidden=false;
   feedback.className='practice-feedback';setText(feedback,'Önce kendin hatırlamayı dene.');
   const lang=window.CHALK_LESSONS.packs[card.language]?.name||card.language;
   setText($('practiceSection'),`${lang} · ${card.level}`);
   setText($('practiceKind'),question.label);
   setText(prompt,question.prompt);
   setText($('practiceExample'),'' );
   typeInput.hidden=question.kind!=='type';choices.hidden=question.kind!=='choice';
   typeInput.value='';choices.replaceChildren();
   if(question.kind==='choice')for(const choice of question.choices){
     const button=document.createElement('button');button.type='button';button.className='choice-option';button.textContent=choice;
     button.setAttribute('aria-pressed','false');
     button.addEventListener('click',()=>{
       if(finished)return;
       selected=choice;
       choices.querySelectorAll('button').forEach(b=>{const active=b===button;b.setAttribute('aria-pressed',String(active));b.classList.toggle('selected',active);});
     });choices.append(button);
   }
   const saved=data();const due=deck().filter(c=>{const r=saved.records?.[c.id];return r&&r.due&&r.due<=Date.now();}).length;
   setText($('practiceProgress'),`${stats.attempted}/${goal} tamamlandı · ${due} tekrar bekliyor`);
   if(question.kind==='type')typeInput.focus();else choices.querySelector('button')?.focus();
 }
 function next(){
   if(stats.attempted>=goal)stats={attempted:0,correct:0};
   const current=data();const records=engine.normalizeRecords(current.records);
   card=tutor.planNext(deck(),records,card?.id);
   if(!card){setText(prompt,'Seçili derste kart bulunamadı. Ayarlardan seviye değiştir.');return;}
   question=tutor.questionFor(card,lessons.filter(x=>x.language===card.language&&x.mode===card.mode));
   render();
 }
 function hint(){
   if(!question||finished)return;
   usedHint=true;
   feedback.className='practice-feedback info';setText(feedback,question.hint);
   $('practiceHint').hidden=true;
 }
 function grade(){
   if(!question||finished)return;
   const value=question.kind==='type'?typeInput.value:selected;
   const result=tutor.assess(question,value,{usedHint,attempts});
   if(result.status==='empty'){feedback.className='practice-feedback warn';setText(feedback,result.message);return;}
   if(result.status==='retry'){
     attempts++;hint();feedback.className='practice-feedback warn';
     setText(feedback,`${result.message} ${question.hint}`);return;
   }
   finished=true;stats.attempted++;if(result.status==='correct')stats.correct++;
   updateReview(card.id,result.grade);
   const complete=stats.attempted>=goal;
   document.dispatchEvent(new CustomEvent('chalk:feedback',{detail:complete?'complete':result.status==='correct'?'correct':'retry'}));
   $('sessionFill').style.width=(stats.attempted/goal*100)+'%';
   if(complete){$('sessionSummary').hidden=false;setText($('sessionSummary'),'✦ Oturum tamamlandı · '+stats.correct+'/'+goal+' doğru. Kısa bir mola iyi gelir.');$('practiceContinue').textContent='Yeni oturum →';}
   feedback.className='practice-feedback '+(result.status==='correct'?'success':'warn');setText(feedback,result.message);
   setText($('practiceExample'),`${question.example}\n${question.explanation}`);
   $('practiceContinue').hidden=false;$('practiceCheck').hidden=true;$('practiceHint').hidden=true;
   choices.querySelectorAll('button').forEach(b=>{b.disabled=true;b.classList.toggle('correct',tutor.normalized(b.textContent)===tutor.normalized(question.expected));});
   setText($('practiceProgress'),`${stats.correct}/${stats.attempted} doğru · öğrenmek için tekrar edeceğiz`);
   $('practiceContinue').focus();
 }
 async function askTeacher(){
   const settings=data().settings||{};
   if(!settings.aiEnabled){setText($('aiResponse'),'Yerel yapay zekâyı sağ tık → Ders ayarları bölümünden etkinleştirebilirsin. Model kurulmadan da alıştırmalar çalışır.');return;}
   const userQuestion=$('aiQuestion').value.trim();
   if(!userQuestion){setText($('aiResponse'),'Öğretmene sormak istediğin konuyu yaz.');return;}
   if(!window.chalkDesktop?.askTeacher){setText($('aiResponse'),'Yerel model yalnızca masaüstü uygulamasında kullanılabilir.');return;}
   $('askAi').disabled=true;
   setText($('aiResponse'),'Öğretmen düşünüyor…');
   try{
     const response=await window.chalkDesktop.askTeacher({question:userQuestion,language:card?.language||settings.language,level:card?.level||settings.level,model:settings.aiModel||'gemma3:4b',context:card?{front:card.front,answer:card.answer,note:card.note,example:card.example}:null});
     setText($('aiResponse'),response);
   }catch(e){setText($('aiResponse'),'Yerel model yanıt vermedi. Ollama çalışıyor mu ve seçilen model indirildi mi? (Ayrıntı: '+String(e?.message||'bağlantı hatası').slice(0,120)+')');}
   finally{$('askAi').disabled=false;}
 }
 const teacherSvg=document.querySelector('.teacher svg');
 if(teacherSvg){const avatar=document.createElement('div');avatar.className='practice-teacher';avatar.setAttribute('aria-hidden','true');avatar.append(teacherSvg.cloneNode(true));$('practicePrompt').before(avatar);}
 $('practiceBtn').addEventListener('click',open);
 $('practiceClose').addEventListener('click',close);
 $('practiceCheck').addEventListener('click',grade);
 $('practiceHint').addEventListener('click',hint);
 $('practiceContinue').addEventListener('click',next);
 $('askAi').addEventListener('click',askTeacher);
 typeInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(finished)next();else grade();}});
 document.addEventListener('keydown',e=>{
   if(dialog.hidden)return;
   if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return;}
   if(e.key!=='Tab')return;
   const controls=[...dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),summary')].filter(el=>el.getClientRects().length);
   const first=controls[0],last=controls.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 },true);
})();
