const { _electron:electron }=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const repo=path.resolve(__dirname,'..');
const qa=path.join(repo,'.qa');fs.mkdirSync(qa,{recursive:true});
(async()=>{
 const app=await electron.launch({executablePath:process.env.CHALK_EXECUTABLE||require('electron'),args:[...(process.env.CHALK_EXECUTABLE?[]:[repo]),'--user-data-dir='+path.join(qa,'profile-'+Date.now())],timeout:30000});
 try{
 const page=await app.firstWindow();const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.stack);});
 await page.waitForSelector('#lessonFront:not(:empty)');
 await page.evaluate(()=>{localStorage.clear();});await page.reload();await page.waitForSelector('#lessonFront:not(:empty)');
 await page.locator('#settingsBtn').click();await page.locator('#motionToggle').check();
 await page.locator('#modeSelect').selectOption('vocab');await page.locator('#intervalSelect').selectOption('600');
 await page.locator('#notificationToggle').check();await page.locator('#lessonSoundToggle').check();
 await page.locator('#doneSettings').click();
 assert.match(await page.locator('#rhythmStatus').textContent(),/10 dakikada/);
 await page.locator('#pauseAuto').click();assert.match(await page.locator('#rhythmStatus').textContent(),/duraklatıldı/);await page.locator('#pauseAuto').click();
 const folder=path.join(repo,process.env.CHALK_SCREENSHOTS==='1'?'docs/screenshots':'.qa/screenshots');fs.mkdirSync(folder,{recursive:true});
 await page.screenshot({path:path.join(folder,'classroom.png')});
 await page.locator('#settingsBtn').click();await page.locator('#intervalSelect').selectOption('3600');
 await page.screenshot({path:path.join(folder,'preferences.png')});
 await page.locator('#doneSettings').click();await page.reload();await page.waitForSelector('#lessonFront:not(:empty)');
 await page.waitForFunction(()=>document.getElementById('rhythmStatus').textContent.includes('60 dakikada')); 
 await page.locator('#practiceBtn').click();
 await page.screenshot({path:path.join(folder,'practice.png')});
 for(let i=0;i<5;i++){
  const answer=await page.evaluate(()=>{const prompt=document.getElementById('practicePrompt').textContent;return window.CHALK_LESSONS.lessons.find(c=>c.language==='en'&&c.mode==='vocab'&&prompt.includes(c.answer))?.front;});
  assert.ok(answer,'Find the exercise answer from its prompt');await page.locator('#practiceInput').fill(answer);await page.locator('#practiceCheck').click();
  if(i<4)await page.locator('#practiceContinue').click();
 }
 assert.equal(await page.locator('#sessionSummary').isVisible(),true);
 await page.screenshot({path:path.join(folder,'session.png')});
 await page.locator('#practiceContinue').click();assert.equal(await page.locator('#sessionSummary').isVisible(),false);
 await page.locator('#practiceClose').click();
 await page.clock.install();
 await page.evaluate(()=>{window.__cues=[];window.ChalkAudio={play:kind=>window.__cues.push(kind)};});
 await page.locator('#settingsBtn').click();await page.locator('#intervalSelect').selectOption('30');await page.locator('#doneSettings').click();
 await page.clock.runFor(30010);assert.deepEqual(await page.evaluate(()=>window.__cues),['soft']);
 await page.locator('#pauseAuto').click();await page.clock.runFor(90000);assert.equal(await page.evaluate(()=>window.__cues.length),1);
 await page.locator('#pauseAuto').click();await page.clock.runFor(30010);assert.equal(await page.evaluate(()=>window.__cues.length),2);
 await page.locator('#settingsBtn').click();await page.locator('#quietToggle').check();await page.locator('#quietStart').selectOption('0');await page.locator('#quietEnd').selectOption('0');await page.locator('#doneSettings').click();
 await page.clock.runFor(30010);assert.equal(await page.evaluate(()=>window.__cues.length),2);
 await page.locator('#settingsBtn').click();await page.locator('#motionToggle').uncheck();await page.locator('#intervalSelect').selectOption('0');await page.locator('#doneSettings').click();
 await page.clock.resume();
 const security=await page.evaluate(()=>({node:typeof require,bridge:Object.keys(window.chalkDesktop)}));assert.equal(security.node,'undefined');
 const initial=await app.evaluate(({app})=>app.getAppMetrics().map(m=>({type:m.type,cpu:m.cpu.percentCPUUsage,memory:m.memory.workingSetSize})));
 await new Promise(r=>setTimeout(r,5000));
 const idle=await app.evaluate(({app})=>app.getAppMetrics().map(m=>({type:m.type,cpu:m.cpu.percentCPUUsage,memory:m.memory.workingSetSize})));
 console.log('TRAY-HIDE',await app.evaluate(({BrowserWindow})=>{const w=BrowserWindow.getAllWindows()[0];w.hide();return {visible:w.isVisible(),skipTaskbar:w.isSkipTaskbar?.(),windows:BrowserWindow.getAllWindows().length};}));
 await new Promise(r=>setTimeout(r,2000));
 assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible()),false);
 assert.equal(await page.evaluate(()=>document.body.classList.contains('suspended')),true);
 const minimized=await app.evaluate(({app})=>app.getAppMetrics().map(m=>({type:m.type,cpu:m.cpu.percentCPUUsage,memory:m.memory.workingSetSize})));
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(qa,'desktop-result.json'),JSON.stringify({errors,security,initial,idle,minimized},null,2));
 console.log(JSON.stringify({ok:true,errors,idle}));
 }finally{await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});


