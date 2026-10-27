'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(n,b));
class CatBrain{
 constructor({rect,area,move,pose,random=Math.random,now=Date.now,later=setTimeout,cancel=clearTimeout}){Object.assign(this,{rect,area,move,notify:pose,random,now,later,cancel});this.enabled=false;this.motion=true;this.suspended=false;this.hover=false;this.timer=null;this.behavior='sit';this.direction=1;this.heading='side';this.steps=0;}
 state(){return{enabled:this.enabled,behavior:this.behavior,direction:this.direction,heading:this.heading};}
 emit(behavior){this.behavior=behavior;this.notify(this.state());}
 clear(){if(this.timer!==null)this.cancel(this.timer);this.timer=null;}
 schedule(ms,fn){this.clear();this.timer=this.later(()=>{this.timer=null;fn();},ms);}
 blocked(){return !this.enabled||!this.motion||this.suspended||this.hover;}
 setEnabled(v){if(this.enabled===!!v)return;this.enabled=!!v;this.resume();}
 setMotion(v){if(this.motion===!!v)return;this.motion=!!v;this.resume();}
 setSuspended(v){if(this.suspended===!!v)return;this.suspended=!!v;this.resume();}
 setHover(v){if(this.hover===!!v)return;this.hover=!!v;this.resume();}
 resume(){this.clear();if(!this.enabled)return;if(this.blocked()){this.emit(this.suspended?'sleep':'sit');return;}this.emit('look');this.schedule(1000,()=>this.travel('walk'));}
 pet(){if(!this.enabled)return;this.clear();this.emit('look');if(!this.blocked())this.schedule(1800,()=>this.decide());}
 decide(){if(this.blocked()){this.resume();return;}this.steps++;const n=this.random();if(this.steps%5===0||n>.9){this.travel('walk',true);return;}if(n<.43){this.travel(n<.13?'run':'walk');return;}const pose=n<.68?'sit':'look';this.emit(pose);this.schedule(pose==='sit'?7000+this.random()*7000:4000+this.random()*4000,()=>this.travel('walk'));}
 travel(gait,corner=false){
  if(this.blocked()){this.resume();return;}
  const r=this.rect(),a=this.area(),right=a.x+Math.max(0,a.width-r.width),bottom=a.y+Math.max(0,a.height-r.height);
  let x,y;if(corner){x=this.random()<.5?a.x+8:right-8;y=bottom-4;}else{x=r.x+(this.random()<.5?-1:1)*(100+this.random()*240);y=r.y+(this.random()-.4)*150;}
  x=clamp(x,a.x,right);y=clamp(y,a.y,bottom);const d=Math.hypot(x-r.x,y-r.y);if(d<3){this.emit('sit');this.schedule(3000,()=>this.decide());return;}
  const dx=x-r.x,dy=y-r.y;this.direction=dx<0?-1:1;this.heading=dy<0&&Math.abs(dy)>Math.abs(dx)*.35?'away':dy>0&&dy>Math.abs(dx)*.65?'toward':'side';this.emit(gait);const start=this.now(),duration=Math.max(1000,d/(gait==='run'?135:48)*1000);
  const tick=()=>{if(this.blocked()){this.resume();return;}const t=clamp((this.now()-start)/duration,0,1),ease=t*t*(3-2*t),area=this.area();this.move(clamp(r.x+(x-r.x)*ease,area.x,area.x+Math.max(0,area.width-r.width)),clamp(r.y+(y-r.y)*ease,area.y,area.y+Math.max(0,area.height-r.height)));if(t<1){this.schedule(16,tick);return;}if(corner){this.emit('sit');this.schedule(1800,()=>{if(this.blocked()){this.resume();return;}this.emit('curl');this.schedule(1800,()=>{this.emit('sleep');this.schedule(28000+this.random()*25000,()=>{this.emit('wake');this.schedule(2400,()=>this.decide());});});});}else{this.emit('sit');this.schedule(2200+this.random()*2500,()=>this.decide());}};tick();
 }
 dispose(){this.enabled=false;this.clear();}
}
module.exports={CatBrain};
