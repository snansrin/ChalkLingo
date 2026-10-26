/* One deadline, no polling, no catch-up bursts after sleep. */
(function(root){
 'use strict';
 const INTERVALS=Object.freeze([0,30,60,120,300,600,900,1800,3600,7200]);
 function quiet(settings,date=new Date()){
  if(!settings.quietEnabled)return false;
  const h=date.getHours(),start=settings.quietStart,end=settings.quietEnd;
  return start===end|| (start<end ? h>=start&&h<end : h>=start||h<end);
 }
 function createScheduler(callback,clock={now:()=>Date.now(),set:(fn,ms)=>setTimeout(fn,ms),clear:id=>clearTimeout(id)}){
  let timer=null,deadline=0,remaining=0,period=0,paused=true;
  function clear(){if(timer!==null)clock.clear(timer);timer=null;}
  function arm(){
   clear();if(paused||!period)return;
   deadline=clock.now()+remaining;
   timer=clock.set(()=>{timer=null;remaining=period;callback();if(timer===null)arm();},remaining);
  }
  return Object.freeze({
   configure(seconds){clear();period=INTERVALS.includes(seconds)?seconds*1000:0;remaining=period;arm();},
   pause(){if(!paused){remaining=Math.max(0,deadline-clock.now());paused=true;clear();}},
   resume(){if(paused){paused=false;arm();}},
   reset(){remaining=period;arm();},
   dispose(){paused=true;clear();},
   remaining(){return paused?remaining:Math.max(0,deadline-clock.now());}
  });
 }
 const api={INTERVALS,quiet,createScheduler};root.ChalkRhythm=api;
 if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
