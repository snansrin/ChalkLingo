'use strict';
const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, protocol, net, screen } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { requestLocalTutor } = require('./ui/ollama-bridge.cjs');

protocol.registerSchemesAsPrivileged([{scheme:'chalk',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
let mainWindow;
let tray;
const SMALL={width:320,height:280},LARGE={width:520,height:640};
let quitting=false;
let layoutExpanded=false,compactPosition=null;
function startupExe(){return process.env.PORTABLE_EXECUTABLE_FILE||process.execPath;}
function startupSupported(){return process.platform==='win32'&&app.isPackaged&&!process.argv.includes('--chalk-test');}
function startupFile(){return path.join(app.getPath('userData'),'startup.json');}
function startupOptions(enabled){return {openAtLogin:enabled,enabled:true,path:startupExe(),args:[],name:'ChalkLingo'};}
function getStartup(){
 if(!startupSupported())return {supported:false,enabled:false};
 const s=app.getLoginItemSettings({path:startupExe(),args:[]});
 const exe=path.resolve(startupExe()).toLowerCase();
 const item=(s.launchItems||[]).find(entry=>entry.scope==='user'&&typeof entry.path==='string'&&path.resolve(entry.path).toLowerCase()===exe&&JSON.stringify(entry.args||[])==='[]');
 const enabled=item?!!item.enabled&&s.executableWillLaunchAtLogin!==false:!!s.openAtLogin&&s.executableWillLaunchAtLogin!==false;
 return {supported:true,enabled};
}
function setStartup(enabled){
 if(!startupSupported())return getStartup();
 app.setLoginItemSettings(startupOptions(enabled));
 fs.mkdirSync(path.dirname(startupFile()),{recursive:true});
 fs.writeFileSync(startupFile(),'{"configured":true}',{mode:0o600});
 return getStartup();
}
function initializeStartup(){
 if(!startupSupported()||fs.existsSync(startupFile()))return;
 try{setStartup(true);}catch(e){console.warn('Startup unavailable:',e.message);}
}
function showWidget(){
 if(!mainWindow||mainWindow.isDestroyed())return;
 if(mainWindow.isMinimized())mainWindow.restore();
 mainWindow.show();mainWindow.focus();
}
function sizeContent(width,height){mainWindow.setContentSize(width,height,false);}
function setLayout(layout){
 const expanded=layout==='expanded';
 if(expanded===layoutExpanded)return;
 if(expanded)compactPosition=mainWindow.getPosition();
 const target=layout==='expanded'?LARGE:SMALL;
 const b=mainWindow.getBounds(),work=screen.getDisplayMatching(b).workArea;
 const [anchorX,anchorY]=!expanded&&compactPosition?compactPosition:[b.x,b.y];
 const x=Math.max(work.x,Math.min(anchorX,work.x+work.width-target.width));
 const y=Math.max(work.y,Math.min(anchorY,work.y+work.height-target.height));
 layoutExpanded=expanded;
 sizeContent(target.width,target.height);
 const actual=mainWindow.getBounds();
 mainWindow.setPosition(Math.max(work.x,Math.min(x,work.x+work.width-actual.width)),Math.max(work.y,Math.min(y,work.y+work.height-actual.height)),false);
}
let lastTutorRequest = 0;
let tutorBusy=false;
let saveTimer=null;
if(!app.requestSingleInstanceLock()){app.quit();}
app.on('second-instance',()=>{if(mainWindow&&!mainWindow.isDestroyed()){if(mainWindow.isMinimized())mainWindow.restore();mainWindow.show();mainWindow.focus();}});

function preferencesPath(){return path.join(app.getPath('userData'),'window.json');}
function readWindowState(){try{return JSON.parse(fs.readFileSync(preferencesPath(),'utf8'))||{};}catch{return {};}}
function saveWindowState(){
  if(!mainWindow || mainWindow.isDestroyed() || mainWindow.isMinimized()) return;
  const [x,y]=layoutExpanded&&compactPosition?compactPosition:mainWindow.getPosition();
  try{fs.mkdirSync(path.dirname(preferencesPath()),{recursive:true});fs.writeFileSync(preferencesPath(),JSON.stringify({x,y}),{mode:0o600});}catch{/* Nonfatal */}
}
function safeSender(event){return event.sender === mainWindow?.webContents && event.sender.getURL()==='chalk://app/index.html' && event.senderFrame === event.sender.mainFrame;}
function createWindow(){
  const state=readWindowState();
  const bounds=screen.getAllDisplays().some(d=>Number.isInteger(state.x)&&Number.isInteger(state.y)&&state.x>=d.workArea.x-150&&state.y>=d.workArea.y-150&&state.x<d.workArea.x+d.workArea.width-120&&state.y<d.workArea.y+d.workArea.height-100);
  mainWindow=new BrowserWindow({
    width:SMALL.width,height:SMALL.height,useContentSize:true,minWidth:300,minHeight:280,
    ...(bounds?{x:state.x,y:state.y}:{center:true}),
    frame:false,transparent:true,resizable:false,skipTaskbar:true,alwaysOnTop:false,
    title:'ChalkLingo',show:false,backgroundColor:'#00000000',hasShadow:true,
    webPreferences:{
      preload:path.join(__dirname,'preload.cjs'),
      nodeIntegration:false,contextIsolation:true,sandbox:true,
      webSecurity:true,backgroundThrottling:true,devTools:!app.isPackaged
    }
  });
  mainWindow.loadURL('chalk://app/index.html');
  mainWindow.once('ready-to-show',()=>{sizeContent(SMALL.width,SMALL.height);mainWindow?.show();});
  for(const event of ['minimize','hide','restore','show'])mainWindow.on(event,()=>{
    mainWindow.webContents.send('window:visibility',mainWindow.isMinimized()||!mainWindow.isVisible());
  });
  mainWindow.on('moved',()=>{clearTimeout(saveTimer);saveTimer=setTimeout(saveWindowState,400);});
  mainWindow.on('closed',()=>{mainWindow=null;clearTimeout(saveTimer);});
  mainWindow.on('close',event=>{saveWindowState();if(!quitting&&tray){event.preventDefault();mainWindow.hide();}});
  mainWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  mainWindow.webContents.on('will-navigate',(event,url)=>{if(url!=='chalk://app/index.html')event.preventDefault();});
}
app.whenReady().then(()=>{
  protocol.handle('chalk',request=>{
    try {
    const target=new URL(request.url);
    if(target.hostname!=='app')return new Response('Forbidden',{status:403});
    const relative=decodeURIComponent(target.pathname).replace(/^\/+/, '') || 'index.html';
    const normalized=path.normalize(relative);
    const base=path.resolve(__dirname,'ui');
    const file=path.resolve(base,normalized);
    if(!file.startsWith(base+path.sep))return new Response('Forbidden',{status:403});
    return net.fetch(pathToFileURL(file).toString());
    }catch{return new Response('Bad request',{status:400});}
  });
  initializeStartup();
  const disallow=permission=>false;
  const session= require('electron').session.defaultSession;
  session.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
  session.setPermissionCheckHandler(disallow);
  ipcMain.handle('window:control',(event,action,value)=>{
    if(!safeSender(event))throw new Error('Unauthorized IPC sender');
    switch(action){
      case 'minimize':mainWindow.hide();return true;
      case 'close':mainWindow.hide();return true;
      case 'set-top':if(typeof value!=='boolean')throw new TypeError('boolean required');mainWindow.setAlwaysOnTop(value);return true;
      case 'get-top':return mainWindow.isAlwaysOnTop();
      case 'show':showWidget();return true;
      case 'layout':if(!['compact','expanded'].includes(value))throw new TypeError('Invalid layout');setLayout(value);return true;
      default:throw new Error('Unknown action');
    }
  });
  ipcMain.handle('startup:get',event=>{if(!safeSender(event))throw Error('Unauthorized IPC sender');return getStartup();});
  ipcMain.handle('startup:set',(event,value)=>{if(!safeSender(event)||typeof value!=='boolean')throw Error('Unauthorized setting');return setStartup(value);});
  ipcMain.handle('tutor:ask',async(event,args)=>{
    if(!safeSender(event))throw new Error('Unauthorized IPC sender');
    const now=Date.now();
    if(tutorBusy||now-lastTutorRequest<1000)throw new Error('Lütfen bir an sonra tekrar dene');
    lastTutorRequest=now;
    tutorBusy=true;
    try{return await requestLocalTutor(args);}finally{tutorBusy=false;}
  });
  createWindow();
  const iconPath=app.isPackaged
    ? path.join(process.resourcesPath,'app.asar.unpacked','assets','icon.png')
    : path.join(__dirname,'assets','icon.png');
  const icon=nativeImage.createFromPath(iconPath).resize({width:20,height:20});
  tray=new Tray(icon);
  tray.setToolTip('ChalkLingo · Bir tıkla yeni bir şey öğren');
  tray.setContextMenu(Menu.buildFromTemplate([
    {label:'Tahtayı aç',click:showWidget},
    {label:'Uygulamadan çık',click:()=>{quitting=true;app.quit();}}
  ]));
  tray.on('double-click',showWidget);
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on('before-quit',()=>{quitting=true;});
app.on('window-all-closed',()=>{if(!tray&&process.platform!=='darwin')app.quit();});
