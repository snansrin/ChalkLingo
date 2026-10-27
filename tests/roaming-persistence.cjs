'use strict';
const {_electron:electron}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..'),profile=path.join(root,'.qa','roaming-persistence-'+Date.now());
let app,p;const errors=[];
async function launch(){app=await electron.launch({executablePath:process.env.MOCHI_EXE||require('electron'),args:[root,'--mochi-test','--user-data-dir='+profile]});p=await app.firstWindow();p.on('pageerror',e=>errors.push(e.message));await p.waitForSelector('#word:not(:empty)');}
async function moving(){await p.mouse.move(-30,-30);await p.waitForFunction(()=>companion.phase==='walking',null,{timeout:6000});const a=await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getBounds());await p.waitForTimeout(850);const b=await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getBounds());assert.ok(Math.abs(a.width-b.width)<=1&&Math.abs(a.height-b.height)<=1,'walking cannot grow the native window: '+JSON.stringify({a,b}));assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=2,'actual movement without forcibly changing native hover state: '+JSON.stringify({a,b,state:await p.evaluate(()=>companion)}));}
(async()=>{try{
 await launch();await p.locator('#mini').click();await p.locator('#roam-toggle').click();await p.waitForFunction(()=>companion.enabled&&companion.wanted);await moving();
 await p.locator('#expand').focus();await p.locator('#expand').press('Enter');await p.waitForFunction(()=>!companion.enabled&&companion.wanted&&companion.layout==='widget');assert.equal(JSON.parse(fs.readFileSync(path.join(profile,'window.json'),'utf8')).roaming,true);
 await p.locator('#settings').click();assert.equal(await p.locator('#roaming-setting').isChecked(),true);await p.locator('#panel-close').click();
 await p.locator('#mini').click();await p.waitForFunction(()=>companion.enabled&&companion.wanted);await moving();
 await p.locator('#expand').focus();await p.locator('#expand').press('Enter');await p.waitForFunction(()=>companion.layout==='widget'&&companion.wanted);await app.close();app=null;
 await launch();await p.waitForFunction(()=>companion.enabled&&companion.wanted&&companion.layout==='pet');await moving();
 await p.locator('#roam-toggle').focus();await p.locator('#roam-toggle').press('Enter');await p.waitForFunction(()=>!companion.enabled&&!companion.wanted);await app.close();app=null;
 await launch();assert.equal(await p.evaluate(()=>companion.enabled||companion.wanted),false);assert.deepEqual(errors,[]);
 console.log('PASS: opening lessons preserves roaming preference, pet mode resumes, complete app restart resumes and moves, explicit stop persists; no forced native hover reset.');
}finally{if(app)await app.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
