'use strict';
const {app,BrowserWindow,ipcMain,protocol,net,session}=require('electron');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
protocol.registerSchemesAsPrivileged([{scheme:'chalk',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
let win;
function createWindow(){
  win=new BrowserWindow({width:490,height:550,minWidth:490,maxWidth:490,minHeight:550,maxHeight:550,
    frame:false,transparent:true,resizable:false,backgroundColor:'#00000000',show:false,hasShadow:true,
    webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,devTools:!app.isPackaged}});
  win.loadURL('chalk://app/index.html');
  win.once('ready-to-show',()=>win?.show());
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith('chalk://app/'))event.preventDefault()});
}
app.whenReady().then(()=>{
  protocol.handle('chalk',request=>{
    let u;try{u=new URL(request.url)}catch{return new Response('Bad URL',{status:400})}
    if(u.hostname!=='app')return new Response('Forbidden',{status:403});
    let relative;try{relative=decodeURIComponent(u.pathname).replace(/^\/+/,'')||'index.html'}catch{return new Response('Bad path',{status:400})}
    const base=path.resolve(__dirname,'ui'),target=path.resolve(base,relative);
    if(!target.startsWith(base+path.sep))return new Response('Forbidden',{status:403});
    return net.fetch(pathToFileURL(target).toString());
  });
  session.defaultSession.setPermissionRequestHandler((wc,p,cb)=>cb(false));
  session.defaultSession.setPermissionCheckHandler(()=>false);
  ipcMain.handle('control',(event,action,value)=>{
    if(!win||event.sender!==win.webContents||!event.sender.getURL().startsWith('chalk://app/'))throw Error('Forbidden');
    if(action==='minimize'){win.minimize();return true}
    if(action==='close'){win.close();return true}
    if(action==='get-top')return win.isAlwaysOnTop();
    if(action==='set-top'&&typeof value==='boolean'){win.setAlwaysOnTop(value);return true}
    throw Error('Invalid request');
  });
  createWindow();
});
app.on('window-all-closed',()=>app.quit());