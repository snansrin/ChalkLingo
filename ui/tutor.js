/** Active recall lesson coach; deterministic feedback never claims to judge free-form fluency. */
(function (root) {
 'use strict';
 const nonletters = /[^\p{L}\p{N}\s]/gu;
 function normalized(value) {
   return String(value ?? '').normalize('NFKC').toLocaleLowerCase('und').replace(/\u0307/g,'').replace(nonletters,' ').replace(/\s+/g,' ').trim();
 }
 function variants(value) {
   return String(value||'').split(/\s+[·•]\s+|\s*;\s*|\s+\|\s+/u).map(normalized).filter(Boolean);
 }
 function shuffledChoices(correct, candidates, random=Math.random) {
   const options=[correct];
   const seen=new Set([normalized(correct)]);
   for(const item of candidates) {
     const key=normalized(item);
     if(!key||seen.has(key))continue;
     seen.add(key);options.push(item);
     if(options.length===4)break;
   }
   if(options.length<2) return [];
   for(let i=options.length-1;i>0;i--){const j=Math.min(i,Math.floor(Math.max(0,Math.min(.999999,random()))*(i+1)));[options[i],options[j]]=[options[j],options[i]];}
   return options;
 }
 function questionFor(card,deck,random=Math.random) {
   if(!card||typeof card.front!=='string')throw new TypeError('invalid lesson');
   if(card.mode==='vocab')return {
     kind:'type',label:'HATIRLA · ÜRET',prompt:`“${card.answer}” ifadesini ${card.language.toUpperCase()} dilinde yaz.`,
     placeholder:'Yabancı dilde karşılığını yaz…',expected:card.front, variants:[card.front],
     hint:`İlk harf: ${[...card.front][0]?.toUpperCase()||'?'} · ${[...card.front].length} karakter`,
     explanation:card.note, example:card.example
   };
   const distractors=deck.filter(x=>x.id!==card.id&&x.mode===card.mode).map(x=>x.front);
   const choice=shuffledChoices(card.front,distractors,random);
   if(choice.length>=2)return {
     kind:'choice',label:card.mode==='grammar'?'GRAMER · UYGULA':'CÜMLE · ANLAMI BUL',
     prompt:card.mode==='grammar'?`Hangi dil bilgisi yapısı bu açıklamaya uygun?\n${card.answer}`:`“${card.answer}” cümlesinin karşılığını seç.`,
     expected:card.front,variants:[card.front],choices:choice,hint:card.note,explanation:card.note,example:card.example
   };
   return {kind:'type',label:'HATIRLA',prompt:`“${card.answer}” karşılığını yaz.`,expected:card.front,variants:[card.front],hint:card.note,explanation:card.note,example:card.example};
 }
 function assess(question,input,{usedHint=false,attempts=0}={}) {
   const entered=normalized(input);
   if(!entered)return {status:'empty',message:'Bir cevap yaz ya da seç.'};
   const accepted=question.variants.some(v=>normalized(v)===entered);
   if(accepted)return {status:'correct',grade:usedHint||attempts>0?'hard':'good',message:usedHint||attempts>0?'Buldun! İpucuyla hatırlamak da ilerleme.':'Harika! Cevabı kendi hafızandan çıkardın.'};
   if(attempts===0)return {status:'retry',message:'Henüz değil. İpucuna bakıp bir kez daha dene.'};
   return {status:'reveal',grade:'again',message:`Doğru cevap: ${question.expected}. Bu kartı birazdan tekrar göreceksin.`};
 }
 function planNext(cards,records,previous,now=Date.now()) {
   // The existing scheduler selects due cards first. Fresh, unseen cards follow.
   return root.ChalkEngine.selectNext(cards,records,previous,now);
 }
 const api=Object.freeze({normalized,variants,questionFor,assess,planNext,shuffledChoices});
 root.ChalkTutor=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
