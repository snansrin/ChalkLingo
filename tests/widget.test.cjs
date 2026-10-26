'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('small widget hides taskbar presence and expands only for full lessons',()=>{
 const src=read('main.cjs');
 assert.match(src,/width:320,height:280/);
 assert.match(src,/width:520,height:640/);
 assert.match(src,/skipTaskbar:true/);
 assert.match(src,/setLayout\(value\)/);
 assert.match(src,/mainWindow.hide\(\)/);
});
test('startup is scoped to installed Windows app and restricted IPC',()=>{
 const src=read('main.cjs');
 assert.match(src,/process.platform==='win32'&&app.isPackaged/);
 assert.match(src,/app.setLoginItemSettings/);
 assert.match(src,/safeSender\(event\)/);
 assert.doesNotMatch(src,/reg\.exe|schtasks|runas|netsh/);
});
test('voice controls, startup settings and bridge are present',()=>{
 const html=read('ui/index.html'),js=read('preload.cjs');
 for(const id of ['voiceSelect','voiceStatus','speechFeedback','startupToggle','startupStatus'])
  assert.ok(html.includes('id="'+id+'"'));
 for(const api of ['layout','getStartup','setStartup'])assert.ok(js.includes(api+':'));
});
test('compact tutor is Mimo the memory elephant',()=>{
 const html=read('ui/index.html');
 assert.match(html,/Mimo · hafıza filin/);
 assert.match(html,/elephantBody/);
 assert.match(html,/elephantEar/);
 assert.doesNotMatch(html,/owlBody|owlFeather/);
});
