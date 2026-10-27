'use strict';
const fs=require('node:fs'),path=require('node:path');const {CatBrain}=require('./cat-brain.cjs');const {fitWindow}=require('./window-layout.cjs');
class DesktopCat{
 constructor({BrowserWindow,screen,layer,userData,test=false,onState=()=>{}}){Object.assign(this,{BrowserWindow,screen,layer,userData,test,onState});this.disposed=false;this.ready=false;this.available=false;this.failure='';this.window=null;this.enabled=!test;this.motion=true;this.systemSuspended=false;this.thoughts=true;this.display=screen.getPrimaryDisplay().id;
  this.file=path.join(userData,'desktop-cat.json');try{const p=JSON.parse(fs.readFileSync(this.file,'utf8'));this.enabled=typeof p.enabled==='boolean'?p.enabled:this.enabled;this.thoughts=p.thoughts!==false;}catch{}
  const a=this.area();this.position=fitWindow({width:180,height:165},a,{x:a.x+Math.round(a.width*.52),y:a.y+a.height-180});
  this.brain=new CatBrain({rect:()=>({...this.position}),area:()=>this.area(),move:(x,y)=>this.move(x,y),pose:()=>this.broadcast()});this.create();this.watch=setInterval(()=>this.check(),2000);
 }
 area(){return(this.screen.getAllDisplays().find(d=>d.id===this.display)||this.screen.getPrimaryDisplay()).workArea;}
 state(){return{...this.brain.state(),enabled:this.enabled,wanted:this.enabled,available:this.available,motion:this.motion&&this.enabled&&!this.systemSuspended,thoughts:this.thoughts,failure:this.failure,desktopOnly:true,layout:'widget',pinned:false};}
 save(){try{fs.writeFileSync(this.file,JSON.stringify({enabled:this.enabled,thoughts:this.thoughts}));}catch{}}
 create(){if(this.disposed||this.window&&!this.window.isDestroyed())return;this.ready=false;this.window=new this.BrowserWindow({width:180,height:165,frame:false,transparent:true,resizable:false,skipTaskbar:true,focusable:false,show:false,hasShadow:false,alwaysOnTop:false,backgroundColor:'#00000000',webPreferences:{preload:path.join(__dirname,'..','cat-preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true,offscreen:true,backgroundThrottling:false}});
  this.window.pofinyoOffscreen=true;this.window.pofinyoInput={hover:v=>this.hover(v),pet:()=>this.pet()};this.window.webContents.setFrameRate(60);
  this.window.webContents.on('paint',(_e,_dirty,image)=>{if(this.disposed||!this.window||this.window.isDestroyed())return;this.frame=image;try{const s=this.window.pofinyoSurface;if(s){const scale=this.screen.getAllDisplays().find(d=>d.id===this.display)?.scaleFactor||1;const painted=s.paint(image.resize({width:Math.round(180*scale),height:Math.round(165*scale)}));if(painted&&!this.available)this.check();}}catch(e){this.failure=e.message;this.available=false;this.layer?.hide(this.window);this.brain.setSuspended(true);}});
  this.window.webContents.setWindowOpenHandler(()=>({action:'deny'}));this.window.webContents.on('will-navigate',(e,url)=>{if(url!=='mochi://app/desktop-cat.html')e.preventDefault();});this.window.webContents.on('did-finish-load',()=>{this.ready=true;this.check();this.window.webContents.invalidate();this.broadcast();});const renderer=this.window;this.window.on('closed',()=>{renderer.pofinyoSurface?.dispose();this.available=false;this.brain.setSuspended(true);this.window=null;if(!this.disposed&&this.enabled)setTimeout(()=>this.create(),1500);});this.window.loadURL('mochi://app/desktop-cat.html');
 }
 authorized(e){return e.sender===this.window?.webContents&&e.senderFrame===e.sender.mainFrame&&e.sender.getURL()==='mochi://app/desktop-cat.html';}
 broadcast(){const s=this.state();if(this.ready&&this.window&&!this.window.isDestroyed()){const wc=this.window.webContents,wanted=this.enabled&&!this.systemSuspended;if(wanted&&!wc.isPainting()){wc.startPainting();wc.invalidate();}else if(!wanted&&wc.isPainting())wc.stopPainting();}if(this.ready&&this.window&&!this.window.isDestroyed())this.window.webContents.send('cat-state',s);this.onState(s);}
 check(){if(this.disposed||!this.ready||!this.window||this.window.isDestroyed())return;if(!this.enabled){this.layer?.hide(this.window);this.brain.setEnabled(false);this.broadcast();return;}let ok=false;try{ok=!!this.layer&&(this.layer.inspect(this.window).attached||this.layer.attach(this.window));if(ok){this.available=true;this.failure='';this.move(this.position.x,this.position.y);ok=this.layer.show(this.window);}}catch(e){this.failure=e.message;}
  this.available=!!ok;if(!ok){this.failure||='Windows masaüstü bağlantısı hazır değil.';this.layer?.hide(this.window);this.window.hide();this.brain.setSuspended(true);}else{this.brain.setSuspended(this.systemSuspended);this.brain.setMotion(this.motion);this.brain.setEnabled(true);}this.broadcast();
 }
 move(x,y){this.position=fitWindow({width:180,height:165},this.area(),{x,y});if(this.available&&this.window&&!this.window.isDestroyed()){if(!this.layer.move(this.window,this.position,this.screen)){this.available=false;this.layer.hide(this.window);this.brain.setSuspended(true);}}}
 setEnabled(v){this.enabled=!!v;this.save();if(this.enabled)this.create();this.check();return this.state();}
 setMotion(v){this.motion=!!v;this.brain.setMotion(this.motion);this.broadcast();return true;}
 suspend(v){this.systemSuspended=!!v;this.brain.setSuspended(this.systemSuspended||!this.available);this.broadcast();}
 hover(v){this.brain.setHover(v);}
 pet(){this.brain.pet();}
 proof(){return this.layer&&this.window&&!this.window.isDestroyed()?this.layer.inspect(this.window):{attached:false};}
 dispose(){this.disposed=true;clearInterval(this.watch);this.brain.dispose();if(this.window&&!this.window.isDestroyed())this.window.destroy();}
}
module.exports={DesktopCat};
