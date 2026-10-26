'use strict';
const { contextBridge, ipcRenderer }=require('electron');
contextBridge.exposeInMainWorld('chalkDesktop',Object.freeze({
  minimize:()=>ipcRenderer.invoke('window:control','minimize'),
  close:()=>ipcRenderer.invoke('window:control','close'),
  setAlwaysOnTop:(value)=>ipcRenderer.invoke('window:control','set-top',value),
  getAlwaysOnTop:()=>ipcRenderer.invoke('window:control','get-top'),
  onVisibility:(callback)=>{
    if(typeof callback!=='function')return ()=>{};
    const listener=(_event,hidden)=>{if(typeof hidden==='boolean')callback(hidden);};
    ipcRenderer.on('window:visibility',listener);
    return ()=>ipcRenderer.removeListener('window:visibility',listener);
  },
  askTeacher:(args)=>ipcRenderer.invoke('tutor:ask',args),
  platform:process.platform
}));
