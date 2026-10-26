'use strict';
const { _electron:electron }=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const app=await electron.launch({
  executablePath:require('electron'),
  args:[path.resolve(__dirname,'..'),'--chalk-test','--user-data-dir='+path.join(__dirname,'..','.qa','widget-'+Date.now())],
  timeout:45000
 });
 try{
  const page=await app.firstWindow();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.waitForSelector('#lessonFront:not(:empty)');
  const bounds=()=>app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getContentBounds());
  let rect=await bounds();
  assert.equal(rect.width,360);assert.ok(Math.abs(rect.height-340)<=3);
  const audioResponse=page.waitForResponse(r=>r.url().includes('/pronunciation/')&&r.status()===200);
  await page.locator('#speakBtn').click();await audioResponse;
  await page.waitForFunction(()=>document.body.classList.contains('speaking'));
  await page.locator('#settingsBtn').click();
  assert.equal(await page.evaluate(()=>document.body.classList.contains('speaking')),false);
  await page.waitForFunction(()=>document.getElementById('settingsOverlay').hidden===false);
  await page.waitForTimeout(300);
  rect=await bounds();assert.equal(rect.width,520);assert.ok(Math.abs(rect.height-640)<=3);
  await page.locator('#startupToggle').count();
  assert.equal(await page.locator('#voiceSelect').count(),1);
  await page.locator('#doneSettings').click();
  await page.waitForTimeout(300);
  rect=await bounds();assert.equal(rect.width,360);assert.ok(Math.abs(rect.height-340)<=3);
  await page.locator('#practiceBtn').click();
  await page.waitForTimeout(300);
  rect=await bounds();assert.equal(rect.width,520);assert.ok(Math.abs(rect.height-640)<=3);
  await page.locator('#practiceClose').click();
  await page.waitForTimeout(300);
  rect=await bounds();assert.equal(rect.width,360);assert.ok(Math.abs(rect.height-340)<=3);
  await page.locator('#closeBtn').click();
  await page.waitForTimeout(150);
  assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible()),false);
  assert.deepEqual(errors,[]);
  console.log('Widget smoke: compact, expanded, compact, tray-hide OK');
 }finally{await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
