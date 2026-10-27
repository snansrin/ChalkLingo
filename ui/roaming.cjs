'use strict';
// Desktop movement stays in the current monitor's work area; no global input is read.
const clamp=(n,a,b)=>Math.max(a,Math.min(n,b));
function destination(bounds,area,random=Math.random){
 const left=area.x,right=area.x+Math.max(0,area.width-bounds.width);
 const top=area.y,bottom=area.y+Math.max(0,area.height-bounds.height);
 const x=clamp(bounds.x,left,right),y=clamp(bounds.y,top,bottom);
 let direction=random()<.5?-1:1;
 if(x-left<50)direction=1;else if(right-x<50)direction=-1;
 const tx=clamp(x+direction*(100+random()*170),left,right);
 const ty=clamp(y+(random()-.35)*100,top,bottom);
 return {x:tx,y:ty,direction:tx<x?-1:1};
}
class Roamer{
 constructor({bounds,area,move,phase,random=Math.random,now=Date.now,later=setTimeout,cancel=clearTimeout}){
  Object.assign(this,{bounds,area,move,notify:phase,random,now,later,cancel});this.enabled=false;this.motion=true;this.visible=true;this.hover=false;this.suspended=false;this.phase='off';this.direction=1;this.timer=null;this.holdUntil=0;
 }
 state(){return{enabled:this.enabled,phase:this.phase,direction:this.direction,pauseReason:!this.enabled?null:!this.motion?'motion':!this.visible?'hidden':this.suspended?'system':this.hover?'hover':this.now()<this.holdUntil?'drag':null};}
 emit(phase){this.phase=phase;this.notify(this.state());}
 clear(){if(this.timer!==null)this.cancel(this.timer);this.timer=null;}
 blocked(){return !this.enabled||!this.motion||!this.visible||this.hover||this.suspended||this.now()<this.holdUntil;}
 schedule(delay,fn){this.clear();this.timer=this.later(()=>{this.timer=null;fn();},delay);}
 setEnabled(value){const next=!!value;if(this.enabled===next)return;this.enabled=next;this.refresh(next?900:undefined);}
 setMotion(value){const next=!!value;if(this.motion===next)return;this.motion=next;this.refresh(next?900:undefined);}
 setVisible(value){const next=!!value;if(this.visible===next)return;this.visible=next;this.refresh(next?900:undefined);}
 setHover(value){const next=!!value;if(this.hover===next)return;this.hover=next;this.refresh(next?undefined:900);}
 setSuspended(value){const next=!!value;if(this.suspended===next)return;this.suspended=next;this.refresh(next?undefined:900);}
 hold(ms=4000){this.holdUntil=this.now()+ms;this.refresh();}
 refresh(delay){
  this.clear();if(!this.enabled){this.emit('off');return;}
  if(this.blocked()){this.emit('resting');if(this.holdUntil>this.now()&&this.motion&&this.visible&&!this.hover&&!this.suspended)this.schedule(this.holdUntil-this.now()+50,()=>this.refresh());return;}
  this.emit('thinking');this.schedule(delay??(6500+this.random()*5500),()=>this.walk());
 }
 walk(){
  if(this.blocked()){this.refresh();return;}
  let start=this.bounds();const area=this.area();const x=clamp(start.x,area.x,area.x+Math.max(0,area.width-start.width)),y=clamp(start.y,area.y,area.y+Math.max(0,area.height-start.height));if(x!==start.x||y!==start.y){this.move(Math.round(x),Math.round(y));start={...start,x,y};}const target=destination(start,area,this.random);
  const distance=Math.hypot(target.x-start.x,target.y-start.y);if(distance<2){this.refresh();return;}
  const began=this.now(),duration=Math.max(1200,distance/38*1000);this.direction=target.direction;this.emit('walking');
  const tick=()=>{
   if(this.blocked()){this.refresh();return;}
   const t=clamp((this.now()-began)/duration,0,1),ease=t*t*(3-2*t);
   const currentArea=this.area(),b=this.bounds();
   const x=clamp(start.x+(target.x-start.x)*ease,currentArea.x,currentArea.x+Math.max(0,currentArea.width-b.width));
   const y=clamp(start.y+(target.y-start.y)*ease,currentArea.y,currentArea.y+Math.max(0,currentArea.height-b.height));
   this.move(Math.round(x),Math.round(y));if(t>=1)this.refresh();else this.schedule(50,tick);
  };tick();
 }
 dispose(){this.enabled=false;this.clear();}
}
module.exports={destination,Roamer};
