'use strict';
const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, protocol, net, screen } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { requestLocalTutor } = require('./ui/ollama-bridge.cjs');

protocol.registerSchemesAsPrivileged([{scheme:'chalk',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
let mainWindow;
let tray;
const WIDTH = 520, HEIGHT = 640;
let lastTutorRequest = 0;
let tutorBusy=false;
let saveTimer=null;
if(!app.requestSingleInstanceLock()){app.quit();}
app.on('second-instance',()=>{if(mainWindow&&!mainWindow.isDestroyed()){if(mainWindow.isMinimized())mainWindow.restore();mainWindow.show();mainWindow.focus();}});

function preferencesPath(){return path.join(app.getPath('userData'),'window.json');}
function readWindowState(){try{return JSON.parse(fs.readFileSync(preferencesPath(),'utf8'));}catch{return {};}}
function saveWindowState(){
  if(!mainWindow || mainWindow.isDestroyed() || mainWindow.isMinimized()) return;
  const [x,y]=mainWindow.getPosition();
  try{fs.mkdirSync(path.dirname(preferencesPath()),{recursive:true});fs.writeFileSync(preferencesPath(),JSON.stringify({x,y}),{mode:0o600});}catch{/* Nonfatal */}
}
function safeSender(event){return event.sender === mainWindow?.webContents && event.sender.getURL()==='chalk://app/index.html' && event.senderFrame === event.sender.mainFrame;}
function createWindow(){
  const state=readWindowState();
  const bounds=screen.getAllDisplays().some(d=>Number.isInteger(state.x)&&Number.isInteger(state.y)&&state.x>=d.workArea.x-150&&state.y>=d.workArea.y-150&&state.x<d.workArea.x+d.workArea.width-120&&state.y<d.workArea.y+d.workArea.height-100);
  mainWindow=new BrowserWindow({
    width: WIDTH,height:HEIGHT, minWidth:WIDTH,maxWidth:WIDTH,minHeight:HEIGHT,maxHeight:HEIGHT,
    ...(bounds?{x:state.x,y:state.y}:{center:true}),
    frame:false,transparent:true,resizable:false,skipTaskbar:false,alwaysOnTop:false,
    title:'ChalkLingo',show:false,backgroundColor:'#00000000',hasShadow:true,
    webPreferences:{
      preload:path.join(__dirname,'preload.cjs'),
      nodeIntegration:false,contextIsolation:true,sandbox:true,
      webSecurity:true,devTools:!app.isPackaged
    }
  });
  mainWindow.loadURL('chalk://app/index.html');
  mainWindow.once('ready-to-show',()=>mainWindow?.show());
  for(const event of ['minimize','hide','restore','show'])mainWindow.on(event,()=>{
    mainWindow.webContents.send('window:visibility',mainWindow.isMinimized()||!mainWindow.isVisible());
  });
  mainWindow.on('moved',()=>{clearTimeout(saveTimer);saveTimer=setTimeout(saveWindowState,400);});
  mainWindow.on('closed',()=>{mainWindow=null;clearTimeout(saveTimer);});
  mainWindow.on('close',saveWindowState);
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
  const disallow=permission=>false;
  const session= require('electron').session.defaultSession;
  session.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
  session.setPermissionCheckHandler(disallow);
  ipcMain.handle('window:control',(event,action,value)=>{
    if(!safeSender(event))throw new Error('Unauthorized IPC sender');
    switch(action){
      case 'minimize':mainWindow.minimize();return true;
      case 'close':mainWindow.close();return true;
      case 'set-top':if(typeof value!=='boolean')throw new TypeError('boolean required');mainWindow.setAlwaysOnTop(value);return true;
      case 'get-top':return mainWindow.isAlwaysOnTop();
      case 'show':mainWindow.show();mainWindow.focus();return true;
      default:throw new Error('Unknown action');
    }
  });
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
    {label:'Tahtayı aç',click:()=>{if(!mainWindow)createWindow();else{mainWindow.show();mainWindow.focus();}}},
    {label:'Çıkış',click:()=>app.quit()}
  ]));
  tray.on('double-click',()=>{mainWindow?.show();mainWindow?.focus();});
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
