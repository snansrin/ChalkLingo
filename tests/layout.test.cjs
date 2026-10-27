const {test}=require('node:test'),assert=require('node:assert/strict');
const {fitWindow}=require('../ui/window-layout.cjs');
test('widget fits a short scaled display and clamps an offscreen anchor',()=>{const r=fitWindow({width:400,height:660},{x:0,y:0,width:1280,height:600},{x:2000,y:-100});assert.equal(r.width,400);assert.equal(r.height,588);assert.equal(r.x,880);assert.equal(r.y,0);});
test('negative-origin displays keep their coordinate space',()=>{const r=fitWindow({width:280,height:302},{x:-1920,y:0,width:1920,height:1080},{x:-200,y:1000});assert.equal(r.x,-280);assert.equal(r.y,778);});
