'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Electron renderer isolates untrusted renderer APIs and blocks navigation',()=>{
 const main=read('main.cjs');
 assert.match(main,/nodeIntegration\s*:\s*false/);
 assert.match(main,/contextIsolation\s*:\s*true/);
 assert.match(main,/sandbox\s*:\s*true/);
 assert.match(main,/setWindowOpenHandler/);
 assert.match(main,/setPermissionRequestHandler/);
 assert.match(main,/safeSender\(event\)/);
});
test('UI has a restrictive CSP and does not load remote scripts',()=>{
 const ui=read('ui/index.html');
 assert.match(ui,/Content-Security-Policy/);
 assert.match(ui,/connect-src 'none'/);
 assert.match(ui,/object-src 'none'/);
 assert.doesNotMatch(ui,/<script[^>]*https?:\/\//);
});
test('all expected accessibility controls are available',()=>{
 const ui=read('ui/index.html');
 for(const id of ['board','settingsOverlay','languageSelect','levelSelect','modeSelect','intervalSelect','learnBtn','repeatBtn','speakBtn','doneSettings','importFile','exportBtn']){
  assert.match(ui,new RegExp(`id="${id}"`));
 }
});
