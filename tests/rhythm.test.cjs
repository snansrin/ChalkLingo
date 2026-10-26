'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const R=require('../ui/rhythm.js'),E=require('../ui/engine.js'),A=require('../ui/ollama-bridge.cjs');
function fake(){let time=0,id=0;const jobs=new Map();return {now:()=>time,set(fn,ms){jobs.set(++id,{fn,at:time+ms});return id;},clear(key){jobs.delete(key);},advance(ms){time+=ms;for(const [key,job] of [...jobs])if(job.at<=time){jobs.delete(key);job.fn();}},count:()=>jobs.size};}
test('10 minute and hourly preferences persist; sound remains opt-in',()=>{
 for(const interval of R.INTERVALS)assert.equal(E.sanitizeSettings({interval}).interval,interval);
 const s=E.sanitizeSettings({interval:-1,volume:Infinity,notificationSound:'true',quietStart:99});
 assert.equal(s.interval,0);assert.equal(s.notificationSound,false);assert.equal(s.lessonSound,false);assert.equal(s.volume,.35);assert.equal(s.quietStart,22);
});
test('one timer preserves remaining time while paused and never catches up in a burst',()=>{
 const clock=fake();let calls=0;const scheduler=R.createScheduler(()=>calls++,clock);
 scheduler.configure(600);scheduler.resume();clock.advance(200000);scheduler.pause();
 assert.equal(clock.count(),0);assert.equal(scheduler.remaining(),400000);
 clock.advance(3600000);assert.equal(calls,0);scheduler.resume();clock.advance(399999);assert.equal(calls,0);
 clock.advance(1);assert.equal(calls,1);clock.advance(3600000);assert.equal(calls,2);assert.equal(clock.count(),1);
 scheduler.configure(3600);assert.equal(clock.count(),1);scheduler.dispose();assert.equal(clock.count(),0);
});
test('disabled interval and repeated resume cannot create polling',()=>{
 const clock=fake();let calls=0;const scheduler=R.createScheduler(()=>calls++,clock);
 scheduler.configure(0);scheduler.resume();scheduler.resume();assert.equal(clock.count(),0);
 scheduler.configure(30);scheduler.resume();scheduler.resume();assert.equal(clock.count(),1);
 scheduler.pause();scheduler.reset();assert.equal(clock.count(),0);scheduler.resume();clock.advance(30000);assert.equal(calls,1);
});
test('quiet hours handle midnight, boundaries and a full-day mute',()=>{
 const at=h=>new Date(2026,0,1,h);const s={quietEnabled:true,quietStart:22,quietEnd:8};
 assert.equal(R.quiet(s,at(23)),true);assert.equal(R.quiet(s,at(7)),true);assert.equal(R.quiet(s,at(8)),false);assert.equal(R.quiet(s,at(21)),false);
 assert.equal(R.quiet({...s,quietStart:8,quietEnd:17},at(12)),true);
 assert.equal(R.quiet({...s,quietStart:8,quietEnd:8},at(12)),true);
});
test('AI response without content-length is capped while reading',async()=>{
 const input={question:'Explain hello',language:'en',level:'A1',model:'test'};let cancelled=false;
 await assert.rejects(A.requestLocalTutor(input,async()=>new Response(new ReadableStream({pull(c){c.enqueue(new Uint8Array(90000));},cancel(){cancelled=true;}}))),/çok uzun/);
 assert.equal(cancelled,true);
});
test('AI resource options bound context, threads and model residency',()=>{
 const body=A.prepareBody({question:'Explain hello',language:'en',level:'A1',model:'test'});
 assert.equal(body.keep_alive,0);assert.equal(body.options.num_thread,2);assert.equal(body.options.num_ctx,2048);
});
