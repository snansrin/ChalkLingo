/* Never read target-language text with a fallback voice of another language. */
(function(root){
 'use strict';
 const locale=Object.freeze({en:'en-US',de:'de-DE',fr:'fr-FR',es:'es-ES',it:'it-IT',ru:'ru-RU',ja:'ja-JP'});
 function available(voices,language){
  if(!Object.prototype.hasOwnProperty.call(locale,language))return [];
  return Array.from(voices||[]).filter(v=>v&&String(v.lang||'').replace(/_/g,'-').toLowerCase().split('-')[0]===language&&v.localService!==false);
 }
 function choose(voices,language,id='auto'){
  const candidates=available(voices,language);
  if(!candidates.length)return null;
  const named=id!=='auto'?candidates.find(v=>(v.voiceURI||v.name)===id):null;
  if(named)return named;
  const preferred=locale[language].toLowerCase();
  return candidates.sort((a,b)=>{
   const score=v=>4*Number(String(v.lang).replace(/_/g,'-').toLowerCase()===preferred)+2*Number(v.localService===true)+Number(!!v.default);
   return score(b)-score(a);
  })[0];
 }
 const api=Object.freeze({available,choose,locale});
 root.ChalkSpeech=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
