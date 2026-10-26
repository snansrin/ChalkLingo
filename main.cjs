'use strict';
const {app,BrowserWindow,Tray,Menu,nativeImage,ipcMain,protocol,net,screen,session,dialog}=require('electron');
const path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const TEST=process.argv.includes('--mochi-test');
app.setName('Mochi');
protocol.registerSchemesAsPrivileged([{scheme:'mochi',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
let win,tray,quitting=false,saveTimer,layout='widget',anchor;
const SIZES={widget:{width:400,height:660},pet:{width:280,height:302}};
const origin='mochi://app/mochi.html';
const stateFile=()=>path.join(app.getPath('userData'),'window.json');
function save(){if(!win||win.isDestroyed())return;try{const [x,y]=layout==='pet'&&anchor?anchor:win.getPosition();fs.mkdirSync(app.getPath('userData'),{recursive:true});fs.writeFileSync(stateFile(),JSON.stringify({x,y}));}catch{}}
function saved(){try{return JSON.parse(fs.readFileSync(stateFile(),'utf8'));}catch{return {};}}
function show(){if(win?.isDestroyed())return;win?.show();win?.focus();}
function authorized(e){return e.sender===win?.webContents&&e.senderFrame===e.sender.mainFrame&&e.sender.getURL()===origin;}
function size(mode){const b=win.getBounds(),area=screen.getDisplayMatching(b).workArea;if(mode==='pet')anchor=win.getPosition();const target=SIZES[mode];win.setContentSize(target.width,target.height);const actual=win.getBounds();const pos=mode==='widget'&&anchor?anchor:[b.x,b.y];win.setPosition(Math.round(Math.max(area.x,Math.min(pos[0],area.x+area.width-actual.width))),Math.round(Math.max(area.y,Math.min(pos[1],area.y+area.height-actual.height))));layout=mode;}
function startup(enabled){if(TEST||!app.isPackaged)return false;if(typeof enabled==='boolean')app.setLoginItemSettings({openAtLogin:enabled,path:process.env.PORTABLE_EXECUTABLE_FILE||process.execPath,name:'Mochi'});return app.getLoginItemSettings({path:process.env.PORTABLE_EXECUTABLE_FILE||process.execPath}).openAtLogin;}
const lock=app.requestSingleInstanceLock();
if(!lock)app.quit();else{
app.on('second-instance',show);
app.whenReady().then(()=>{
 protocol.handle('mochi',async request=>{try{const url=new URL(request.url);if(url.hostname!=='app'||!['GET','HEAD'].includes(request.method))return new Response('Forbidden',{status:403});const base=path.resolve(__dirname,'ui'),file=path.resolve(base,decodeURIComponent(url.pathname).replace(/^\/+/,''));if(!file.startsWith(base+path.sep))return new Response('Forbidden',{status:403});const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.wav':'audio/wav','.json':'application/json'};return new Response(await fs.promises.readFile(file),{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}});}catch{return new Response('Bad request',{status:400});}});
 session.defaultSession.setPermissionRequestHandler((_w,_p,cb)=>cb(false));session.defaultSession.setPermissionCheckHandler(()=>false);
 session.defaultSession.webRequest.onBeforeRequest((details,cb)=>cb({cancel:!details.url.startsWith('mochi://app/')}));
 const position=saved(),valid=screen.getAllDisplays().some(d=>Number.isFinite(position.x)&&Number.isFinite(position.y)&&position.x>=d.workArea.x&&position.y>=d.workArea.y&&position.x+400<=d.workArea.x+d.workArea.width&&position.y+660<=d.workArea.y+d.workArea.height);
 win=new BrowserWindow({...SIZES.widget,useContentSize:true,...(valid?{x:position.x,y:position.y}:{center:true}),frame:false,transparent:true,resizable:false,skipTaskbar:true,show:false,hasShadow:false,title:'Mochi · Living language',backgroundColor:'#00000000',icon:path.join(__dirname,'assets','icon.png'),webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,backgroundThrottling:true,devTools:TEST||!app.isPackaged}});
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.webContents.on('will-navigate',(e,url)=>{if(url!==origin)e.preventDefault();});win.webContents.on('will-attach-webview',e=>e.preventDefault());
 win.loadURL(origin);win.once('ready-to-show',()=>win.show());
 for(const name of ['hide','show','minimize','restore'])win.on(name,()=>win.webContents.send('visibility',!win.isVisible()||win.isMinimized()));
 win.on('moved',()=>{clearTimeout(saveTimer);saveTimer=setTimeout(save,400);});win.on('close',e=>{save();if(!quitting&&tray){e.preventDefault();win.hide();}});
 ipcMain.handle('control',(e,action,value)=>{if(!authorized(e))throw Error('Unauthorized');switch(action){case 'hide':win.hide();return true;case 'layout':if(!Object.hasOwn(SIZES,value))throw Error('Invalid layout');size(value);return true;case 'top':if(typeof value!=='boolean')throw Error('Boolean required');win.setAlwaysOnTop(value);return win.isAlwaysOnTop();case 'startup':if(value!==undefined&&typeof value!=='boolean')throw Error('Boolean required');return startup(value);default:throw Error('Unknown action');}});
 ipcMain.handle('export',async(e,data)=>{if(!authorized(e)||typeof data!=='string'||data.length>2000000)throw Error('Invalid export');const raw=JSON.parse(data);if(!raw.records||!raw.settings)throw Error('Invalid data');const choice=await dialog.showSaveDialog(win,{defaultPath:'mochi-backup.json',filters:[{name:'Mochi backup',extensions:['json']}]});if(choice.canceled)return false;await fs.promises.writeFile(choice.filePath,data,'utf8');return true;});
 tray=new Tray(nativeImage.createFromPath(path.join(__dirname,'assets','icon.png')).resize({width:20,height:20}));tray.setToolTip('Mochi · Küçük adımlar, yaşayan kelimeler');tray.setContextMenu(Menu.buildFromTemplate([{label:'Mochi’yi göster',click:show},{label:'Çıkış',click:()=>{quitting=true;app.quit();}}]));tray.on('click',show);tray.on('double-click',show);
});
app.on('before-quit',()=>{quitting=true;save();clearTimeout(saveTimer);});app.on('window-all-closed',()=>{if(!tray)app.quit();});
}
