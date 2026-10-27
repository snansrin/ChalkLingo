'use strict';const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktopCat',Object.freeze({state:()=>ipcRenderer.invoke('desktop-cat','state'),hover:v=>ipcRenderer.invoke('desktop-cat','hover',v),pet:()=>ipcRenderer.invoke('desktop-cat','pet'),onState:fn=>{if(typeof fn==='function')ipcRenderer.on('cat-state',(_e,s)=>fn(s));}}));
