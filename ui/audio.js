/* Small synthesized cues: no downloads, audio files, polling or persistent oscillator. */
(function(){
 'use strict';
 let context=null,last=0,suspendTimer=null;
 const patterns={bell:[660,880],soft:[523,659],wood:[330],correct:[523,659,784],retry:[392,330],complete:[523,659,784,1047]};
 async function play(kind,volume=.35){
  if(document.hidden||Date.now()-last<180||volume<=0)return;
  last=Date.now();
  try{
   const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
   context ||= new Audio({latencyHint:'playback'});
   if(context.state==='suspended')await context.resume();
   clearTimeout(suspendTimer);
   const start=context.currentTime;
   (patterns[kind]||patterns.soft).forEach((frequency,i)=>{
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type='sine';oscillator.frequency.value=frequency;
    const t=start+i*.12;
    gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(Math.min(.6,volume)*.18,t+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,t+.25);
    oscillator.connect(gain);gain.connect(context.destination);
    oscillator.start(t);oscillator.stop(t+.27);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
   });
   suspendTimer=setTimeout(()=>context?.suspend().catch(()=>{}),1000);
  }catch{/* Unsupported or blocked audio must never interrupt learning. */}
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)context?.suspend().catch(()=>{});});
 window.addEventListener('beforeunload',()=>{clearTimeout(suspendTimer);context?.close().catch(()=>{});});
 window.ChalkAudio=Object.freeze({play});
})();
