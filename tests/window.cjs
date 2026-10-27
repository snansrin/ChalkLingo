'use strict';
async function pageFor(app,suffix){await app.firstWindow();for(let i=0;i<100;i++){const p=app.windows().find(p=>p.url().endsWith(suffix));if(p){await p.waitForLoadState('load');return p;}await new Promise(r=>setTimeout(r,50));}throw Error('Window not found: '+suffix);}
module.exports={learning:app=>pageFor(app,'/mochi.html'),cat:app=>pageFor(app,'/desktop-cat.html')};
