'use strict';
const {spawn}=require('node:child_process'),crypto=require('node:crypto');
const LANG=/^(en|de|fr|es|it|ru|ja)(?:-[a-z]{2})?$/i;
function validate(text,lang){if(typeof text!=='string'||!text.trim()||text.length>500||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)||typeof lang!=='string'||!LANG.test(lang))throw Error('Invalid speech request');}
function createNativeSpeech(executable){let pending=null;const cache=new Map();let cacheBytes=0;
 function cancel(){if(pending){const p=pending;pending=null;p.child.kill();p.finish({ok:false,error:'cancelled'});}}
 function speak(text,lang){validate(text,lang);cancel();const key=crypto.createHash('sha256').update(lang.toLowerCase()+'\0'+text).digest('hex');if(cache.has(key))return Promise.resolve({...cache.get(key),cached:true});
  return new Promise(resolve=>{let done=false,output='',timer;const child=spawn(executable,[],{windowsHide:true,shell:false,stdio:['pipe','pipe','ignore']});const entry={child,finish(result){if(done)return;done=true;clearTimeout(timer);if(pending===entry)pending=null;resolve(result);}};pending=entry;
   timer=setTimeout(()=>{child.kill();entry.finish({ok:false,error:'timeout'});},10000);
   child.on('error',()=>entry.finish({ok:false,error:'unavailable'}));child.stdout.setEncoding('utf8');child.stdout.on('data',chunk=>{output+=chunk;if(output.length>2100000){child.kill();entry.finish({ok:false,error:'audio-too-large'});}});
   child.on('close',()=>{if(done)return;let result;try{result=JSON.parse(output.replace(/^\uFEFF/,''));if(result.ok&&(!result.audio||typeof result.audio!=='string'||typeof result.lang!=='string'||result.lang.split('-')[0].toLowerCase()!==lang.split('-')[0].toLowerCase()))throw Error();}catch{result={ok:false,error:'invalid-response'};}
    if(result.ok){while(cache.size>=16||cacheBytes+result.audio.length>2*1024*1024){const first=cache.keys().next().value;if(first===undefined)break;cacheBytes-=cache.get(first).audio.length;cache.delete(first);}if(result.audio.length<=2*1024*1024){cache.set(key,result);cacheBytes+=result.audio.length;}}entry.finish(result);
   });child.stdin.on('error',()=>{});child.stdin.end(JSON.stringify({text,lang}));
  });
 }
 return {speak,cancel,dispose(){cancel();cache.clear();cacheBytes=0;},stats:()=>({active:!!pending,cached:cache.size,bytes:cacheBytes})};
}
module.exports={createNativeSpeech,validate};
