'use strict';
// A real per-pixel-alpha desktop child. The Electron renderer stays offscreen:
// reparenting its DirectComposition HWND can otherwise produce a black rectangle.
let api;
function native(){
 if(api)return api;
 const k=require('koffi'),u=k.load('user32.dll'),g=k.load('gdi32.dll'),c=k.load('comctl32.dll'),kernel=k.load('kernel32.dll');
 const Point=k.struct('PofinyoAlphaPoint',{x:'long',y:'long'}),Size=k.struct('PofinyoAlphaSize',{cx:'long',cy:'long'});
 const Proc=k.proto('intptr_t __stdcall PofinyoSubclass(intptr_t, uint32_t, uintptr_t, intptr_t, uintptr_t, uintptr_t)');
 api={k,Point,Size,Proc,
  create:u.func('intptr_t __stdcall CreateWindowExW(uint32_t,const char16_t *,const char16_t *,uint32_t,int,int,int,int,intptr_t,intptr_t,intptr_t,void *)'),
  destroy:u.func('bool __stdcall DestroyWindow(intptr_t)'),valid:u.func('bool __stdcall IsWindow(intptr_t)'),
  dc:g.func('intptr_t __stdcall CreateCompatibleDC(intptr_t)'),deleteDC:g.func('bool __stdcall DeleteDC(intptr_t)'),
  bitmap:g.func('intptr_t __stdcall CreateDIBSection(intptr_t,const void *,uint32_t,_Out_ void **,intptr_t,uint32_t)'),
  select:g.func('intptr_t __stdcall SelectObject(intptr_t,intptr_t)'),deleteObject:g.func('bool __stdcall DeleteObject(intptr_t)'),
  copy:kernel.func('void __stdcall RtlMoveMemory(void *,const void *,size_t)'),error:kernel.func('uint32_t __stdcall GetLastError()'),
  update:u.func('bool __stdcall UpdateLayeredWindow(intptr_t,intptr_t,const PofinyoAlphaPoint *,const PofinyoAlphaSize *,intptr_t,const PofinyoAlphaPoint *,uint32_t,const void *,uint32_t)'),
  subclass:c.func('bool __stdcall SetWindowSubclass(intptr_t,PofinyoSubclass *,uintptr_t,uintptr_t)'),
  remove:c.func('bool __stdcall RemoveWindowSubclass(intptr_t,PofinyoSubclass *,uintptr_t)'),
  def:c.func('intptr_t __stdcall DefSubclassProc(intptr_t,uint32_t,uintptr_t,intptr_t)'),
  track:u.func('bool __stdcall TrackMouseEvent(const void *)')
 };return api;
}
class LayeredCat{
 constructor(parent,{hover=()=>{},pet=()=>{}}={}){
  this.n=native();const n=this.n;
  // WS_EX_LAYERED | WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW, WS_CHILD.
  this.handle=n.create(0x08080080,'STATIC','Pofinyo · Masaüstü kedisi',0x40000100,0,0,240,220,parent,0,0,null);
  if(!this.handle)throw Error('Cat alpha window creation failed: '+n.error());
  this.painted=false;this.frames=0;
  this.callback=n.k.register((h,msg,wp,lp,id,data)=>{
   if(msg===0x200){hover(true);const t=Buffer.alloc(24);t.writeUInt32LE(24);t.writeUInt32LE(2,4);t.writeBigUInt64LE(BigInt(h),8);n.track(t);return 0;}
   if(msg===0x2a3){hover(false);return 0;}
   if(msg===0x202){pet();return 0;}
   if(msg===0x201)return 0;
   // Prevent STATIC from erasing its client area with an opaque brush.
   if(msg===0x14)return 1;
   if(msg===0x21)return 3; // MA_NOACTIVATE
   return n.def(h,msg,wp,lp);
  },n.k.pointer(n.Proc));
  if(!n.subclass(this.handle,this.callback,1,0)){this.dispose();throw Error('Cat input binding failed');}
 }
 paint(image){
  const n=this.n,{width,height}=image.getSize();if(!width||!height)return false;
  const pixels=image.toBitmap();if(pixels.length!==width*height*4)return false;
  let clear=0,ink=0;for(let i=3;i<pixels.length;i+=4){if(pixels[i]===0)clear++;if(pixels[i]>200)ink++;}
  // Refuse an opaque/empty rectangle before making the native child visible.
  if(clear<width*height*.15||ink<50)return false;
  if(width!==this.width||height!==this.height){this.freeBitmap();this.width=width;this.height=height;this.dc=n.dc(0);const info=Buffer.alloc(40);info.writeUInt32LE(40);info.writeInt32LE(width,4);info.writeInt32LE(-height,8);info.writeUInt16LE(1,12);info.writeUInt16LE(32,14);const bits=[null];this.bitmap=n.bitmap(this.dc,info,0,bits,0,0);this.bits=bits[0];if(!this.dc||!this.bitmap||!this.bits)throw Error('Cat alpha bitmap allocation failed');this.old=n.select(this.dc,this.bitmap);}
  n.copy(this.bits,pixels,pixels.length);
  const ok=n.update(this.handle,0,null,{cx:width,cy:height},this.dc,{x:0,y:0},0,Buffer.from([0,0,255,1]),2);
  if(!ok)throw Error('Cat alpha upload failed: '+n.error());
  this.painted=true;this.frames++;this.transparentPixels=clear;this.opaquePixels=ink;return true;
 }
 freeBitmap(){const n=this.n;if(this.old&&this.dc)n.select(this.dc,this.old);if(this.bitmap)n.deleteObject(this.bitmap);if(this.dc)n.deleteDC(this.dc);this.old=this.bitmap=this.dc=null;}
 dispose(){const n=this.n;if(this.handle&&n.valid(this.handle)){if(this.callback)n.remove(this.handle,this.callback,1);n.destroy(this.handle);}if(this.callback)n.k.unregister(this.callback);this.callback=null;this.handle=0;this.freeBitmap();}
}
module.exports={LayeredCat};
