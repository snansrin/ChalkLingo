'use strict';
const {_electron:electron}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
(async()=>{
 const app=await electron.launch({executablePath:process.env.MOCHI_EXE||require('electron'),args:[root,'--mochi-test','--user-data-dir='+path.join(root,'.qa','companion-'+Date.now())]});
 try{
  const p=await app.firstWindow(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.waitForSelector('#word:not(:empty)');
  assert.equal(await p.evaluate(()=>companion.enabled),false);const xp=await p.evaluate(()=>state.xp);
  await p.locator('#mini').click();await p.locator('#roam-toggle').click();await p.waitForFunction(()=>companion.enabled&&document.body.classList.contains('roaming'));
  await p.mouse.move(-10,-10);await p.evaluate(()=>native.companionHover(false));
  assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getContentBounds().width),280);
  assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isAlwaysOnTop()),true);
  const profile=await app.evaluate(({app})=>app.getPath('userData'));assert.equal(JSON.parse(fs.readFileSync(path.join(profile,'window.json'),'utf8')).roaming,true);
  const text=await p.locator('#bubble').textContent();assert.ok(text.length>5);await p.evaluate(()=>nextThought(Date.now()+30000,true));assert.notEqual(await p.locator('#bubble').textContent(),text);
  await p.waitForFunction(()=>companion.phase==='walking',{},{timeout:16000});const before=await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getBounds());await p.waitForTimeout(700);const after=await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getBounds());assert.ok(before.x!==after.x||before.y!==after.y,'native window actually moves');
  const frames=path.join(root,'.qa','companion-frames');fs.mkdirSync(frames,{recursive:true});
  for(let i=0;i<18;i++){await p.screenshot({path:path.join(frames,String(i).padStart(3,'0')+'.png'),omitBackground:true});await p.waitForTimeout(85);}
  await p.screenshot({path:path.join(root,'docs/screenshots/pofinyo-daydream.png'),omitBackground:true});
  await p.evaluate(()=>native.companionHover(true));await p.waitForFunction(()=>companion.phase==='resting');const resting=await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getBounds());await p.waitForTimeout(350);assert.deepEqual(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getBounds()),resting);
  await p.evaluate(()=>native.companionHover(false));await p.evaluate(()=>native.companionMotion(false));await p.waitForFunction(()=>companion.phase==='resting');await p.evaluate(()=>native.companionMotion(true));
  assert.equal(await p.evaluate(()=>state.xp),xp,'thoughts and walking do not award learning XP');
  await p.reload();await p.waitForFunction(()=>companion.enabled===true&&document.body.classList.contains('roaming'));assert.ok((await p.locator('#bubble').textContent()).length>5);
  await p.locator('#roam-toggle').focus();await p.locator('#roam-toggle').press('Enter');await p.waitForFunction(()=>!companion.enabled);assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isAlwaysOnTop()),false);
  await p.locator('#expand').click();await p.waitForFunction(()=>!document.body.classList.contains('mini'));assert.ok(Math.abs(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getContentBounds().width)-400)<=2,'Windows frameless border rounding stays within two pixels');
  await p.locator('#settings').click();assert.equal(await p.locator('#roaming-setting').count(),1);assert.equal(await p.locator('#roaming-setting').isChecked(),false);await p.locator('#panel-close').click();
  assert.deepEqual(errors,[]);console.log('PASS: optional native roaming, work-area window, animated thoughts, actual movement, hover pause, reduced-motion pause, zero passive XP, renderer reload, stop, prior pin restoration, widget return and settings.');
 }finally{await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
