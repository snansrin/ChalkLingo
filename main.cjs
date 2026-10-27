'use strict';
const {app,BrowserWindow,Tray,Menu,nativeImage,ipcMain,protocol,net,screen,session,dialog,powerMonitor}=require('electron');
const path=require('node:path'),fs=require('node:fs');
const {fitWindow}=require('./ui/window-layout.cjs');
const {Roamer}=require('./ui/roaming.cjs');
const TEST=process.argv.includes('--mochi-test');
// Keep the original profile name so existing progress and local origin storage survive.
app.setName('Mochi');
protocol.registerSchemesAsPrivileged([{scheme:'mochi',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
let win,tray,quitting=false,saveTimer,layout='widget',anchor,passThrough=false,roamer,roamWasPinned=false;
const SIZES={widget:{width:400,height:660},pet:{width:280,height:302}};
const origin='mochi://app/mochi.html';
const stateFile=()=>path.join(app.getPath('userData'),'window.json');
function save(){if(!win||win.isDestroyed())return;try{const [x,y]=layout==='pet'&&anchor?anchor:win.getPosition();fs.mkdirSync(app.getPath('userData'),{recursive:true});fs.writeFileSync(stateFile(),JSON.stringify({x,y,roaming:roamer?.enabled===true}));}catch{}}
function saved(){try{return JSON.parse(fs.readFileSync(stateFile(),'utf8'));}catch{return {};}}
function show(){if(win?.isDestroyed())return;setPassThrough(false);win?.show();win?.focus();}
function updateTray(){if(!tray)return;tray.setContextMenu(Menu.buildFromTemplate([{label:'Pofinyo ile etkileşime dön',click:show},{label:'Tıklamaları masaüstüne geçir',type:'checkbox',checked:passThrough,click:item=>setPassThrough(item.checked)},{label:'Masaüstünde gezin',type:'checkbox',checked:roamer?.enabled===true,click:item=>setRoaming(item.checked)},{label:'Öğrenme adasına dön',click:()=>{setRoaming(false);size('widget');show();}},{type:'separator'},{label:'Çıkış',click:()=>{quitting=true;app.quit();}}]));}
function broadcastCompanion(){if(win&&!win.isDestroyed())win.webContents.send('companion',{...(roamer?.state()||{enabled:false,phase:'off',direction:1}),layout,pinned:win.isAlwaysOnTop()});}
function setRoaming(value){if(value&&!roamer.enabled){roamWasPinned=win.isAlwaysOnTop();size('pet');win.setAlwaysOnTop(true,'floating');}if(!value&&roamer.enabled)win.setAlwaysOnTop(roamWasPinned);roamer.setEnabled(value);updateTray();save();return{...roamer.state(),layout,pinned:win.isAlwaysOnTop()};}
function setPassThrough(value){passThrough=!!value;win?.setIgnoreMouseEvents(passThrough,{forward:true});updateTray();return passThrough;}
function authorized(e){return e.sender===win?.webContents&&e.senderFrame===e.sender.mainFrame&&e.sender.getURL()===origin;}
function size(mode){
 if(mode==='widget'&&roamer?.enabled)setRoaming(false);
 if(layout===mode)return;
 const b=win.getBounds(),area=screen.getDisplayMatching(b).workArea;
 if(mode==='pet')anchor=win.getPosition();
 const pos=mode==='widget'&&anchor?anchor:[b.x,b.y];
 const fitted=fitWindow(SIZES[mode],area,{x:pos[0],y:pos[1]});
 win.setContentSize(fitted.width,fitted.height);win.setPosition(fitted.x,fitted.y);
 layout=mode;if(mode==='widget')setPassThrough(false);broadcastCompanion();
}
function startup(enabled){if(TEST||!app.isPackaged)return false;if(typeof enabled==='boolean')app.setLoginItemSettings({openAtLogin:enabled,path:process.env.PORTABLE_EXECUTABLE_FILE||process.execPath,name:'Mochi'});return app.getLoginItemSettings({path:process.env.PORTABLE_EXECUTABLE_FILE||process.execPath}).openAtLogin;}
const lock=app.requestSingleInstanceLock();
if(!lock)app.quit();else{
app.on('second-instance',show);
app.whenReady().then(()=>{
 protocol.handle('mochi',async request=>{try{const url=new URL(request.url);if(url.hostname!=='app'||!['GET','HEAD'].includes(request.method))return new Response('Forbidden',{status:403});const base=path.resolve(__dirname,'ui'),file=path.resolve(base,decodeURIComponent(url.pathname).replace(/^\/+/,''));if(!file.startsWith(base+path.sep))return new Response('Forbidden',{status:403});const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.wav':'audio/wav','.json':'application/json'};return new Response(await fs.promises.readFile(file),{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}});}catch{return new Response('Bad request',{status:400});}});
 session.defaultSession.setPermissionRequestHandler((_w,_p,cb)=>cb(false));session.defaultSession.setPermissionCheckHandler(()=>false);
 session.defaultSession.webRequest.onBeforeRequest((details,cb)=>cb({cancel:!details.url.startsWith('mochi://app/')}));
 const position=saved();let restoreRoaming=true;
 const area=screen.getAllDisplays().find(d=>position.x>=d.workArea.x&&position.x<d.workArea.x+d.workArea.width&&position.y>=d.workArea.y&&position.y<d.workArea.y+d.workArea.height)?.workArea||screen.getPrimaryDisplay().workArea;
 const initial=fitWindow(SIZES.widget,area,Number.isFinite(position.x)&&Number.isFinite(position.y)?position:null);
 win=new BrowserWindow({...initial,useContentSize:true,frame:false,transparent:true,resizable:false,skipTaskbar:true,show:false,hasShadow:false,title:'Pofinyo · Living language',backgroundColor:'#00000000',icon:path.join(__dirname,'assets','icon.png'),webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,backgroundThrottling:true,devTools:TEST||!app.isPackaged}});
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.webContents.on('will-navigate',(e,url)=>{if(url!==origin)e.preventDefault();});win.webContents.on('will-attach-webview',e=>e.preventDefault());
 roamer=new Roamer({bounds:()=>win.getBounds(),area:()=>screen.getDisplayMatching(win.getBounds()).workArea,move:(x,y)=>win.setPosition(x,y,false),phase:broadcastCompanion});
 win.webContents.on('did-finish-load',()=>{if(restoreRoaming){restoreRoaming=false;if(position.roaming===true&&!roamer.enabled){setRoaming(true);return;}}broadcastCompanion();});
 win.on('will-move',()=>{if(roamer.enabled)roamer.hold();});
 for(const event of ['display-removed','display-metrics-changed'])screen.on(event,()=>{if(roamer.enabled){roamer.hold(1000);const b=win.getBounds(),f=fitWindow(b,screen.getDisplayMatching(b).workArea,b);win.setBounds(f);}});
 powerMonitor.on('suspend',()=>roamer.setSuspended(true));powerMonitor.on('resume',()=>roamer.setSuspended(false));powerMonitor.on('lock-screen',()=>roamer.setSuspended(true));powerMonitor.on('unlock-screen',()=>roamer.setSuspended(false));
 win.loadURL(origin);win.once('ready-to-show',()=>win.show());
 for(const name of ['hide','show','minimize','restore'])win.on(name,()=>{const visible=win.isVisible()&&!win.isMinimized();roamer.setVisible(visible);win.webContents.send('visibility',!visible);});
 win.on('moved',()=>{if(roamer.phase==='walking')return;clearTimeout(saveTimer);saveTimer=setTimeout(save,400);});win.on('close',e=>{save();if(!quitting&&tray){e.preventDefault();win.hide();}});
 ipcMain.handle('control',(e,action,value)=>{if(!authorized(e))throw Error('Unauthorized');switch(action){case 'roam':if(value!==undefined&&typeof value!=='boolean')throw Error('Boolean required');return value===undefined?{...roamer.state(),layout,pinned:win.isAlwaysOnTop()}:setRoaming(value);case 'companion-hover':if(typeof value!=='boolean')throw Error('Boolean required');roamer.setHover(value);return true;case 'companion-motion':if(typeof value!=='boolean')throw Error('Boolean required');roamer.setMotion(value);return true;case 'pass-through':if(typeof value!=='boolean')throw Error('Boolean required');return setPassThrough(value);case 'hide':win.hide();return true;case 'layout':if(!Object.hasOwn(SIZES,value))throw Error('Invalid layout');size(value);return true;case 'top':if(typeof value!=='boolean')throw Error('Boolean required');win.setAlwaysOnTop(value);return win.isAlwaysOnTop();case 'startup':if(value!==undefined&&typeof value!=='boolean')throw Error('Boolean required');return startup(value);default:throw Error('Unknown action');}});
 ipcMain.handle('export',async(e,data)=>{if(!authorized(e)||typeof data!=='string'||data.length>2000000)throw Error('Invalid export');const raw=JSON.parse(data);if(!raw.records||!raw.settings)throw Error('Invalid data');const choice=await dialog.showSaveDialog(win,{defaultPath:'pofinyo-backup.json',filters:[{name:'Pofinyo backup',extensions:['json']}]});if(choice.canceled)return false;await fs.promises.writeFile(choice.filePath,data,'utf8');return true;});
 tray=new Tray(nativeImage.createFromPath(path.join(__dirname,'assets','icon.png')).resize({width:20,height:20}));tray.setToolTip('Pofinyo · Küçük adımlar, yaşayan kelimeler');updateTray();tray.on('click',show);tray.on('double-click',show);
});
app.on('before-quit',()=>{quitting=true;save();roamer?.dispose();clearTimeout(saveTimer);});app.on('window-all-closed',()=>{if(!tray)app.quit();});
}
