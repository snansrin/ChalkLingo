'use strict';
const {_electron:electron}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
(async()=>{
 const app=await electron.launch({executablePath:process.env.MOCHI_EXE||require('electron'),args:[root,'--mochi-test','--user-data-dir='+path.join(root,'.qa','mochi-'+Date.now())],timeout:45000});
 try{
 const page=await app.firstWindow(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.waitForSelector('#word:not(:empty)');
 const bounds=()=>app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getContentBounds());assert.equal((await bounds()).width,400);
 assert.equal(await page.evaluate(()=>typeof require),'undefined');assert.equal(await page.evaluate(()=>typeof window.mochiDesktop.exportData),'function');
 const settings=await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences());assert.equal(settings.sandbox,true);assert.equal(settings.contextIsolation,true);assert.equal(settings.nodeIntegration,false);
 await page.screenshot({path:path.join(root,'docs/screenshots/mochi-widget.png')});
 const word=await page.locator('#word').textContent();await page.locator('#reveal').click();assert.equal(await page.locator('#meaning').isVisible(),true);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('mochi.v1')||'{"xp":0}').xp);await page.locator('#next').click();assert.notEqual(await page.locator('#word').textContent(),word);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mochi.v1')||'{"xp":0}').xp),before);
 await page.locator('#pet').click();assert.equal(await page.evaluate(()=>document.body.classList.contains('happy')),true);
 await page.locator('#practice').click();await page.screenshot({path:path.join(root,'docs/screenshots/mochi-games.png')});await page.locator('[data-mode=recall]').click();
 for(let i=0;i<5;i++){const answer=await page.evaluate(()=>activity.queue[activity.index].answer);await page.getByRole('button',{name:answer,exact:true}).click();await page.locator('#feedback .primary').click();}
 assert.equal(await page.locator('#panel-title').textContent(),'Biraz daha büyüdük.');assert.equal(await page.evaluate(()=>Object.values(state.records).filter(r=>r.streak===1).length),5);
 await page.locator('#finish').click();await page.locator('#garden').click();await page.screenshot({path:path.join(root,'docs/screenshots/mochi-garden.png')});assert.equal(await page.locator('.plant:not(.locked)').count(),5);await page.locator('#panel-close').click();
 await page.locator('#practice').click();await page.locator('[data-mode=write]').click();const correct=await page.evaluate(()=>activity.queue[activity.index].front);await page.locator('#typed-answer').fill('wrong-on-purpose');await page.locator('#check').click();assert.ok((await page.locator('#feedback').textContent()).includes(correct));assert.equal(await page.evaluate(()=>state.records[activity.queue[0].id].streak),0);await page.locator('#panel-close').click();
 await page.locator('#practice').click();await page.locator('[data-mode=build]').click();const tokenIDs=await page.evaluate(()=>activity.queue[0].example.split(/\s+/).map((_,i)=>i));for(const id of tokenIDs){const text=await page.evaluate(id=>activity.tokens.find(t=>t.id===id).text,id);await page.locator('#token-pool').getByRole('button',{name:text,exact:true}).first().click();}await page.locator('#check').click();assert.ok((await page.locator('#feedback').textContent()).includes('İşte bu'));await page.screenshot({path:path.join(root,'docs/screenshots/mochi-sentence.png')});await page.locator('#panel-close').click();
 await page.locator('#practice').click();await page.locator('[data-mode=listen]').click();assert.equal(await page.locator('#listen-again').count(),1);const listenAnswer=await page.evaluate(()=>activity.queue[0].answer);await page.getByRole('button',{name:listenAnswer,exact:true}).click();assert.ok((await page.locator('#feedback').textContent()).includes('İşte bu'));await page.locator('#panel-close').click();
 await page.locator('#settings').click();await page.locator('#language').selectOption('ja');await page.locator('#level').selectOption('C2');await page.locator('#theme').selectOption('dusk');await page.locator('#motion').uncheck();assert.equal(await page.evaluate(()=>document.body.classList.contains('no-motion')),true);await page.screenshot({path:path.join(root,'docs/screenshots/mochi-settings.png')});await page.locator('#panel-close').click();assert.ok((await page.locator('#level-badge').textContent()).includes('JA · C2'));
 const recordCount=await page.evaluate(()=>Object.keys(state.records).length);await page.reload();await page.waitForSelector('#word:not(:empty)');assert.equal(await page.evaluate(()=>Object.keys(state.records).length),recordCount);assert.equal(await page.evaluate(()=>state.settings.language),'ja');
 await page.locator('#settings').click();await page.locator('#language').selectOption('en');await page.locator('#level').selectOption('A1');await page.locator('#theme').selectOption('dawn');await page.locator('#motion').check();await page.locator('#panel-close').click();
 await page.locator('#mini').click();assert.equal((await bounds()).width,280);await page.screenshot({path:path.join(root,'docs/screenshots/mochi-pet.png')});await page.locator('#expand').click();assert.equal((await bounds()).width,400);
 await page.locator('#pin').click();assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isAlwaysOnTop()),true);await page.locator('#pin').click();
 const response=await page.evaluate(async()=>{try{return(await fetch('mochi://other/mochi.html')).status;}catch{return 0;}});assert.ok(response===0||response===403);
 const traversal=await page.evaluate(async()=>{try{return(await fetch('mochi://app/..%2fmain.cjs')).status;}catch{return 0;}});assert.ok(traversal===0||traversal===403);
 const backupFile=path.join(root,'.qa','backup-'+Date.now()+'.json');
 await app.evaluate(({dialog},file)=>{dialog.showSaveDialog=async()=>({canceled:false,filePath:file});},backupFile);
 const exported=await page.evaluate(()=>window.mochiDesktop.exportData(JSON.stringify(state)));assert.equal(exported,true);assert.equal(JSON.parse(fs.readFileSync(backupFile,'utf8')).settings.language,'en');
 await page.locator('#settings').click();await page.locator('#language').selectOption('de');await page.locator('#import').setInputFiles(backupFile);await page.waitForFunction(()=>state.settings.language==='en');assert.equal(await page.locator('#save-note').textContent(),'Yedek geri yüklendi.');await page.locator('#panel-close').click();
 await page.locator('#hide').click();assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible()),false);assert.equal(await page.evaluate(()=>document.body.classList.contains('paused')),true);assert.deepEqual(errors,[]);
 console.log('PASS: 4 games, scheduled recall, wrong-answer retry, no passive XP, garden, seven-language content, settings persistence, pet/widget resize, pin, tray hide, sandbox and origin checks.');
 }finally{await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});


