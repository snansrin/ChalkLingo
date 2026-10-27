'use strict';
const {_electron:electron}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
(async()=>{
 const app=await electron.launch({executablePath:process.env.MOCHI_EXE||require('electron'),args:[root,'--mochi-test','--user-data-dir='+path.join(root,'.qa','education-'+Date.now())]});
 try{
  const page=await app.firstWindow(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.waitForSelector('#daily-progress');
  await page.locator('#daily').click();await page.screenshot({animations:'disabled',path:path.join(root,'docs/screenshots/mochi-education.png')});
  await page.locator('#course-map').click();assert.equal(await page.locator('[data-unit]:disabled').count(),7);await page.screenshot({animations:'disabled',path:path.join(root,'docs/screenshots/mochi-curriculum.png')});
  await page.locator('[data-unit=meet]').click();await page.locator('details').first().locator('summary').click();assert.ok((await page.locator('details').first().textContent()).includes('Hello'));assert.equal(await page.evaluate(()=>Object.keys(state.education.introduced).length),0,'browsing is not assessment');await page.locator('#unit-back').click();await page.locator('#map-back').click();await page.locator('#course-start').click();
  const seen=new Set();let wrongID,hintedID,guard=0;
  while(await page.locator('#course-finish').count()===0){
   assert.ok(guard++<30,'course must terminate');
   const task=await page.evaluate(()=>{const t=courseSession.tasks[courseSession.index];return {...t,card:courseCard(t.id)};});
   if(task.skill==='learn'){
    await page.screenshot({animations:'disabled',path:path.join(root,'docs/screenshots/mochi-teaching.png')});
    seen.add(task.id);await page.locator('#course-next').click();continue;
   }
   assert.ok(seen.has(task.id),'never quiz content before its teaching step');
   const before=await page.evaluate(()=>({xp:state.xp,education:JSON.stringify(state.education)}));
   if(task.skill==='recognition')await page.locator('[data-course-choice]').filter({hasText:task.card.answer}).click();
   else{
    let value=task.card.front;
    if(task.skill==='production'&&!task.retry&&!wrongID){wrongID=task.id;value='deliberately incorrect';}
    else if(task.skill==='production'&&!task.retry&&!hintedID){hintedID=task.id;await page.locator('#course-hint').click();}
    await page.locator('#course-answer').fill(value);await page.locator('#course-answer').press('Enter');
   }
   if(task.retry||task.id===hintedID&&task.skill==='production'){
    assert.equal(await page.evaluate(()=>state.xp),before.xp);assert.equal(await page.evaluate(()=>JSON.stringify(state.education)),before.education,'assisted correction cannot advance FSRS');
   }
   if(task.skill==='context')await page.screenshot({animations:'disabled',path:path.join(root,'docs/screenshots/mochi-context.png')});
   await page.locator('#course-next').click();
  }
  assert.ok(wrongID&&hintedID);assert.equal(await page.evaluate(()=>courseStats().retained),0);assert.equal(await page.evaluate(()=>courseStats().passed),1);assert.equal(await page.evaluate(id=>E.record(state,id,'production'),hintedID),undefined);assert.equal(await page.evaluate(id=>E.record(state,id,'production').card.reps,wrongID),1);
  const saved=await page.evaluate(()=>JSON.stringify(state.education));await page.reload();await page.waitForSelector('#daily-progress');assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(state.education))),JSON.parse(saved),'scheduler and teaching survive reload');
  await page.locator('#daily').click();await page.locator('#course-how').click();assert.ok((await page.locator('#panel-content').textContent()).includes('FSRS-6'));await page.screenshot({animations:'disabled',path:path.join(root,'docs/screenshots/mochi-method.png')});
  await page.locator('#panel-close').click();await page.locator('#settings').click();await page.locator('#language').selectOption('de');await page.locator('#panel-close').click();await page.locator('#daily').click();assert.ok((await page.locator('#panel-content').textContent()).includes('İngilizce için hazır'));assert.equal(await page.locator('#route-start').count(),1);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'.qa','education-result.json'),JSON.stringify({version:'1.2.0',checks:['8 units with prerequisite gates','teaching before retrieval','meaning recognition','unassisted production','new-context gap','hint and retry exclude schedule/XP','no immediate delayed evidence','FSRS reload persistence','clear method limits','seven-language fallback'],errors},null,2));
  console.log('PASS: foundation course map, teaching, recognition, writing, context, hint/retry isolation, delayed-evidence guard, persisted FSRS, method explanation, other-language fallback.');
 }finally{await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
