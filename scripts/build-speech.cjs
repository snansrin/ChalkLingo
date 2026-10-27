'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
if(process.platform!=='win32')process.exit(0);
const root=path.resolve(__dirname,'..'),compiler=path.join(process.env.SystemRoot||'C:\\Windows','Microsoft.NET','Framework64','v4.0.30319','csc.exe'),source=path.join(root,'native','SpeechWorker.cs'),output=path.join(root,'assets','pofinyo-speech.exe');
if(!fs.existsSync(compiler))throw Error('Windows .NET Framework compiler is required for the local speech helper.');
if(fs.existsSync(output)&&fs.statSync(output).mtimeMs>=fs.statSync(source).mtimeMs)process.exit(0);
function reference(name){const base=path.join(process.env.SystemRoot||'C:\\Windows','Microsoft.NET','assembly','GAC_MSIL',name);const file=fs.readdirSync(base).map(v=>path.join(base,v,name+'.dll')).find(p=>fs.existsSync(p));if(!file)throw Error('Required Windows assembly missing: '+name);return '/reference:'+file;}
const result=spawnSync(compiler,['/nologo','/target:exe','/optimize+',reference('System.Speech'),'/out:'+output,source],{windowsHide:true,encoding:'utf8'});
if(result.status!==0){process.stderr.write(result.stdout||result.stderr||'Speech helper compilation failed');process.exit(1);}
console.log('Built local language-checked speech helper');
