(function(root){
'use strict';
const primary=lang=>String(lang||'').replace(/_/g,'-').toLowerCase().split('-')[0];
function selectVoice(voices,lang){const target=String(lang).replace(/_/g,'-').toLowerCase();return voices.filter(v=>v.localService!==false&&primary(v.lang)===primary(lang)).sort((a,b)=>Number(String(b.lang).toLowerCase()===target)-Number(String(a.lang).toLowerCase()===target))[0]||null;}
function createPlayer({synth,Utterance,Audio,URL,Blob,nativeSpeak,nativeCancel,onError=()=>{},waitMs=1200}){
 let serial=0,media=null,blobURL=null,releaseWait=null,last=null;
 function release(){if(blobURL){URL.revokeObjectURL(blobURL);blobURL=null;}}
 function cancel(){serial++;releaseWait?.();releaseWait=null;if(media){media.pause();media.onended=media.onerror=null;media=null;}release();try{synth?.cancel();}catch{}try{nativeCancel?.()?.catch?.(()=>{});}catch{}}
 function error(code){onError(code==='missing-voice'?'Bu dil için uygun ses bulunamadı. Farklı bir dil sesiyle okunmayacak.':'Ses çalınamadı. Bu dilin Windows sesini kontrol et.');return {ok:false,error:code};}
 async function voice(lang,token){let voices=synth?.getVoices?.()||[];if(voices.length)return selectVoice(voices,lang);if(!synth?.addEventListener)return null;await new Promise(resolve=>{let timer;const done=()=>{clearTimeout(timer);synth.removeEventListener('voiceschanged',changed);if(releaseWait===done)releaseWait=null;resolve();};const changed=()=>{if(selectVoice(synth.getVoices(),lang))done();};releaseWait=done;synth.addEventListener('voiceschanged',changed);timer=setTimeout(done,waitMs);changed();});return token===serial?selectVoice(synth.getVoices(),lang):null;}
 async function playMedia(url,token){if(token!==serial)return false;media=new Audio(url);media.playbackRate=1;media.onended=()=>{if(token===serial)release();};await media.play();return token===serial;}
 async function play(text,lang,file=null){cancel();const token=serial;if(typeof text!=='string'||!text.trim()||text.length>500||!(/^(en|de|fr|es|it|ru|ja)(-[a-z]{2})?$/i).test(lang))return error('invalid-request');
  if(file){try{if(await playMedia(file,token)){last={text,lang,engine:'bundled'};return {ok:true,...last};}}catch{}if(token!==serial)return {ok:false,error:'cancelled'};}
  const chosen=await voice(lang,token);if(token!==serial)return {ok:false,error:'cancelled'};
  if(chosen&&Utterance){try{const utter=new Utterance(text);utter.voice=chosen;utter.lang=chosen.lang;utter.rate=1;utter.pitch=1;utter.volume=1;utter.onerror=e=>{if(token===serial&&!['canceled','interrupted'].includes(e.error))error('speech-failed');};synth.resume?.();synth.speak(utter);last={text,lang:chosen.lang,voice:chosen.name,engine:'browser'};return {ok:true,...last};}catch{}}
  if(!nativeSpeak)return error('missing-voice');
  let result;try{result=await nativeSpeak(text,lang);}catch{if(token===serial)return error('unavailable');return {ok:false,error:'cancelled'};}
  if(token!==serial)return {ok:false,error:'cancelled'};if(!result?.ok)return result?.error==='cancelled'?result:error(result?.error||'unavailable');
  if(primary(result.lang)!==primary(lang)||typeof result.audio!=='string')return error('voice-language-mismatch');
  try{const binary=root.atob(result.audio),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));blobURL=URL.createObjectURL(new Blob([bytes],{type:'audio/wav'}));if(!await playMedia(blobURL,token))return {ok:false,error:'cancelled'};last={text,lang:result.lang,voice:result.voice,engine:'windows',cached:!!result.cached};return {ok:true,...last};}catch{release();if(token===serial)return error('playback-failed');return {ok:false,error:'cancelled'};}
 }
 return {play,cancel,get last(){return last;}};
}
const api={selectVoice,createPlayer};root.MochiSpeech=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
