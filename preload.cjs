'use strict';
const { contextBridge, ipcRenderer }=require('electron');
contextBridge.exposeInMainWorld('chalkDesktop',Object.freeze({
  minimize:()=>ipcRenderer.invoke('window:control','minimize'),
  close:()=>ipcRenderer.invoke('window:control','close'),
  setAlwaysOnTop:(value)=>ipcRenderer.invoke('window:control','set-top',value),
  getAlwaysOnTop:()=>ipcRenderer.invoke('window:control','get-top'),
  askTeacher:(args)=>ipcRenderer.invoke('tutor:ask',args),
  platform:process.platform
}));
