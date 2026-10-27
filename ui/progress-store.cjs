'use strict';
const fs=require('node:fs'),path=require('node:path'),{gzipSync,gunzipSync}=require('node:zlib');
const LIMIT=32*1024*1024;
function valid(text){if(typeof text!=='string'||Buffer.byteLength(text,'utf8')>LIMIT)throw Error('Progress is too large');const data=JSON.parse(text);if(!data||typeof data!=='object'||!data.records||typeof data.records!=='object'||!data.settings||typeof data.settings!=='object')throw Error('Invalid progress');return text;}
function createProgressStore(directory){const file=path.join(directory,'learning-progress.json.gz');return{
 load(){try{if(fs.statSync(file).size>LIMIT)return null;const text=gunzipSync(fs.readFileSync(file),{maxOutputLength:LIMIT}).toString('utf8');return valid(text);}catch{return null;}},
 save(text){valid(text);fs.mkdirSync(directory,{recursive:true});const packed=gzipSync(text,{level:1});fs.writeFileSync(file+'.tmp',packed);fs.renameSync(file+'.tmp',file);return true;}
 };}
module.exports={createProgressStore,LIMIT};
