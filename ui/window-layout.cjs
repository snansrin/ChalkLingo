'use strict';
// Clamp content dimensions and its anchor to the chosen display's work area.
function fitWindow(requested,area,position){
 const width=Math.max(1,Math.min(requested.width,area.width-12));
 const height=Math.max(1,Math.min(requested.height,area.height-12));
 const x=position?.x??area.x+(area.width-width)/2;
 const y=position?.y??area.y+(area.height-height)/2;
 return {width,height,x:Math.round(Math.max(area.x,Math.min(x,area.x+area.width-width))),y:Math.round(Math.max(area.y,Math.min(y,area.y+area.height-height)))};
}
module.exports={fitWindow};
