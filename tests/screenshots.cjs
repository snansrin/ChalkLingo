'use strict';
const { _electron:electron }=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const repo=path.resolve(__dirname,'..');
const output=path.join(repo,'docs','screenshots');
fs.mkdirSync(output,{recursive:true});

(async()=>{
 const application=await electron.launch({
  executablePath:require('electron'),
  args:[repo,'--chalk-test','--user-data-dir='+path.join(repo,'.qa','screenshot-'+Date.now())],
  timeout:60000
 });
 try{
  const page=await application.firstWindow();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.waitForSelector('#lessonFront:not(:empty)');
  const trunk=await page.locator('.scene > .teacher .elephant-trunk').evaluate(node=>{const b=node.getBBox();return {x:b.x,y:b.y,width:b.width,height:b.height};});
  assert.ok(trunk.width>45&&trunk.height>90,'Hortum yüzün altına kadar uzanmalı: '+JSON.stringify(trunk));
  assert.equal(await page.locator('.scene > .teacher .elephant-nostril').count(),1);
  await page.evaluate(()=>{
   const key='chalklingo.v1',saved=JSON.parse(localStorage.getItem(key)||'{}');
   saved.settings={...saved.settings,language:'en',level:'A1',mode:'vocab'};
   saved.records={};saved.dayNumber=1;saved.dayIsReview=false;
   saved.dayDeckIds=Array.from({length:12},(_,i)=>`en:vocab:${String(18+i).padStart(3,'0')}`);
   localStorage.setItem(key,JSON.stringify(saved));
  });
  await page.reload();
  await page.waitForSelector('#lessonFront:not(:empty)');
  await page.waitForFunction(()=>document.getElementById('progressText').textContent.includes('GÜN 1'));
  await page.waitForTimeout(900);
  const windowBounds=()=>application.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getContentBounds());
  async function snap(name,width,height){
   const rect=await windowBounds();
   assert.equal(rect.width,width,`Wrong screenshot width for ${name}`);
   assert.ok(Math.abs(rect.height-height)<=3,`Unexpected DPI-adjusted screenshot height for ${name}`);
   const box=await page.evaluate(()=>document.getElementById('widget').getBoundingClientRect().toJSON());
   assert.ok(box.width>=width-2&&box.height>=height-2,`Widget viewport smaller than window: ${JSON.stringify(box)}`);
   const file=path.join(output,name);
   const png=await page.screenshot({path:file,animations:'disabled',timeout:15000});
   assert.ok(png.length>10000,`Screenshot looks empty: ${name}, ${png.length} bytes`);
   assert.equal(png.readUInt32BE(0),0x89504e47);
   console.log(name,rect.width+'x'+rect.height,png.length+' bytes');
  }
  await snap('widget-compact.png',320,280);
  await page.evaluate(()=>{
   const key='chalklingo.v1',saved=JSON.parse(localStorage.getItem(key));let records={};
   for(const id of saved.dayDeckIds)records=window.ChalkEngine.review(records,id,'good');
   saved.records=records;localStorage.setItem(key,JSON.stringify(saved));
  });
  await page.reload();
  await page.waitForFunction(()=>document.getElementById('nextBtn').textContent.includes('Yeni kelime günü'));
  await page.waitForTimeout(300);
  await snap('widget-next-day.png',320,280);
  await page.locator('#board').click();
  await page.waitForTimeout(600);
  await page.locator('#settingsBtn').click();
  await page.waitForFunction(()=>document.getElementById('settingsOverlay').hidden===false);
  assert.match(await page.locator('#voiceStatus').textContent(),/^49 İngilizce ders kaydı hazır/);
  await page.waitForTimeout(250);
  await snap('widget-settings.png',520,640);
  await page.locator('#startupToggle').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await snap('widget-voice.png',520,640);
  await page.locator('#doneSettings').click();
  await page.waitForTimeout(250);
  await page.locator('#practiceBtn').click();
  await page.waitForFunction(()=>document.getElementById('practiceOverlay').hidden===false);
  await page.waitForTimeout(250);
  await snap('widget-practice.png',520,640);
  await page.locator('#practiceClose').click();
  await page.waitForTimeout(250);
  const end=await windowBounds();
  assert.equal(end.width,320);assert.ok(Math.abs(end.height-280)<=3);
  assert.deepEqual(errors,[]);
 }finally{await application.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
