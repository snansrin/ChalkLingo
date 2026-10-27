'use strict';
// The cat is an Explorer desktop child, never a top-level overlay.
let cachedLayer;
function createDesktopLayer(){
 if(cachedLayer)return cachedLayer;
 if(process.platform!=='win32')return null;
 const k=require('koffi'),u=k.load('user32.dll');
 const RECT=k.struct('PofinyoDesktopRect',{left:'long',top:'long',right:'long',bottom:'long'});
 const POINT=k.struct('PofinyoDesktopPoint',{x:'long',y:'long'});
 const f={
  shell:u.func('intptr_t __stdcall GetShellWindow()'),
  dpi:u.func('intptr_t __stdcall GetWindowDpiAwarenessContext(intptr_t)'),
  awareness:u.func('int __stdcall GetAwarenessFromDpiAwarenessContext(intptr_t)'),
  find:u.func('intptr_t __stdcall FindWindowExW(intptr_t, intptr_t, const char16_t *, const char16_t *)'),
  pid:u.func('uint32_t __stdcall GetWindowThreadProcessId(intptr_t, _Out_ uint32_t *)'),
  cls:u.func('int __stdcall GetClassNameW(intptr_t, _Out_ char16_t *, int)'),
  parent:u.func('intptr_t __stdcall GetParent(intptr_t)'),
  setParent:u.func('intptr_t __stdcall SetParent(intptr_t, intptr_t)'),
  getStyle:u.func('intptr_t __stdcall GetWindowLongPtrW(intptr_t, int)'),
  setStyle:u.func('intptr_t __stdcall SetWindowLongPtrW(intptr_t, int, intptr_t)'),
  valid:u.func('bool __stdcall IsWindow(intptr_t)'),
  child:u.func('bool __stdcall IsChild(intptr_t, intptr_t)'),
  rect:u.func('bool __stdcall GetWindowRect(intptr_t, _Out_ PofinyoDesktopRect *)'),
  client:u.func('bool __stdcall ScreenToClient(intptr_t, _Inout_ PofinyoDesktopPoint *)'),
  pos:u.func('bool __stdcall SetWindowPos(intptr_t, intptr_t, int, int, int, int, uint32_t)'),
  show:u.func('bool __stdcall ShowWindow(intptr_t, int)'),
  sibling:u.func('intptr_t __stdcall GetWindow(intptr_t, uint32_t)')
 };
 const pid=h=>{const out=[0];f.pid(h,out);return out[0];};
 const cls=h=>{const b=Buffer.alloc(512);const n=f.cls(h,b,256);return b.toString('utf16le',0,Math.max(0,n)*2);};
 const handle=w=>w.pofinyoSurface?.handle||Number(w.getNativeWindowHandle().readBigUInt64LE());
 function desktop(){const shell=f.shell();if(!shell)return null;const owner=pid(shell);let root=0;while((root=f.find(0,root,null,null))){if(pid(root)!==owner||!['Progman','WorkerW'].includes(cls(root)))continue;const view=f.find(root,0,'SHELLDLL_DefView',null);if(!view)continue;const icons=f.find(view,0,'SysListView32',null);if(icons)return{root,view,icons};}return null;}
 function own(w){const h=handle(w);if(pid(h)!==process.pid)throw Error('Window ownership mismatch');return h;}
 function inspect(w){if(!w||w.isDestroyed()||!f.valid(handle(w)))return{attached:false};const h=own(w),d=desktop(),parent=f.parent(h);let order=[],s=d?f.sibling(d.view,5):0;while(s&&order.length<100){order.push(s);s=f.sibling(s,2);}const style=Number(f.getStyle(h,-16))>>>0,ex=Number(f.getStyle(h,-20))>>>0,r={};f.rect(h,r);return{attached:!!d&&parent===d.view&&f.child(d.view,h),parentClass:cls(parent),aboveIcons:!!d&&order.indexOf(h)>=0&&order.indexOf(h)<order.indexOf(d.icons),topmost:!!(ex&8),childStyle:!!(style&0x40000000),layered:!!(ex&0x80000),alphaPainted:w.pofinyoSurface?.painted===true,frames:w.pofinyoSurface?.frames||0,transparentPixels:w.pofinyoSurface?.transparentPixels||0,opaquePixels:w.pofinyoSurface?.opaquePixels||0,rect:r};}
 function compatible(w){const d=desktop();return !!d&&f.awareness(f.dpi(d.view))===f.awareness(f.dpi(Number(w.getNativeWindowHandle().readBigUInt64LE())));}
 function hide(w){if(w&&!w.isDestroyed()&&f.valid(handle(w)))f.show(own(w),0);}
 function attach(w,{noActivate=true}={}){
  if(w.pofinyoOffscreen){const d=desktop();if(!d||!compatible(w))return false;if(w.pofinyoSurface){w.pofinyoSurface.dispose();w.pofinyoSurface=null;}const {LayeredCat}=require('./layered-cat.cjs');w.pofinyoSurface=new LayeredCat(d.view,w.pofinyoInput);f.pos(own(w),0,0,0,0,0,0x0010|0x0001|0x0002);return inspect(w).attached;}
  const h=own(w);f.show(h,0);const d=desktop();if(!d||!compatible(w))return false;
  const style=Number(f.getStyle(h,-16))>>>0,ex=Number(f.getStyle(h,-20))>>>0;
  f.setStyle(h,-16,((style&~0x80C40000)|0x40000000)>>>0);
  f.setStyle(h,-20,((ex&~(0x40000|8|0x08000000))|0x80|(noActivate?0x08000000:0))>>>0);
  f.setParent(h,d.view);
  if(f.parent(h)!==d.view){f.show(h,0);return false;}
  f.pos(h,0,0,0,0,0,0x0010|0x0001|0x0002|0x0020); // TOP only within the desktop child list.
  const proof=inspect(w);if(!proof.attached||proof.topmost||!proof.childStyle){f.show(h,0);return false;}return true;
 }
 function move(w,r,screen){const h=own(w),d=desktop();if(!d||f.parent(h)!==d.view){f.show(h,0);return false;}const p=screen.dipToScreenPoint({x:Math.round(r.x),y:Math.round(r.y)}),scale=screen.getDisplayMatching(r).scaleFactor;const point={x:p.x,y:p.y};if(!f.client(d.view,point))return false;return f.pos(h,0,point.x,point.y,Math.round(r.width*scale),Math.round(r.height*scale),0x0010|0x0004);}
 function show(w){const proof=inspect(w);if(!proof.attached||proof.topmost||(w.pofinyoOffscreen&&!proof.alphaPainted)){hide(w);return false;}f.show(own(w),4);return true;}
 return cachedLayer={desktop,compatible,attach,inspect,hide,move,show};
}
module.exports={createDesktopLayer};
