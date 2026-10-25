'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('chalkDesktop',Object.freeze({
  minimize:()=>ipcRenderer.invoke('control','minimize'),
  close:()=>ipcRenderer.invoke('control','close'),
  getTop:()=>ipcRenderer.invoke('control','get-top'),
  setTop:value=>ipcRenderer.invoke('control','set-top',value)
}));