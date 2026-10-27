'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto'),{gunzip}=require('node:zlib'),{promisify}=require('node:util');
const manifest=require('./lexicon/manifest.json'),unzip=promisify(gunzip);
async function readPack(language){const pack=Object.hasOwn(manifest.packs,language)&&manifest.packs[language];if(!pack)throw Error('Unknown dictionary');const bytes=await fs.readFile(path.join(__dirname,'lexicon',pack.file));if(bytes.length!==pack.bytes||bytes.length>2*1024*1024||crypto.createHash('sha256').update(bytes).digest('hex')!==pack.sha256)throw Error('Dictionary integrity check failed');const raw=await unzip(bytes,{maxOutputLength:4*1024*1024});if(raw.length!==pack.rawBytes)throw Error('Dictionary size mismatch');return raw;}
module.exports={readPack};
