(function(root){
'use strict';
const key=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('en').replace(/\u0307/g,'').replace(/ı/g,'i').trim();
class Wordbank{
 constructor(data){
  if(data?.version!==1||data.language!=='en'||!Array.isArray(data.rows)||data.rows.length!==10000)throw Error('Invalid wordbank');
  const seen=new Set();this.rows=data.rows.map(row=>{if(!Array.isArray(row)||row.length!==2||!(/^[a-z]{2,24}$/).test(row[0])||seen.has(row[0])||!Array.isArray(row[1])||!row[1].length||row[1].length>3||row[1].some(s=>typeof s!=='string'||s.length<2||s.length>100||/[\u0000-\u001f\ufffd<>]/.test(s)))throw Error('Invalid wordbank row');seen.add(row[0]);return Object.freeze([row[0],Object.freeze(row[1].slice())]);});
  this.index=new Map(this.rows.map((r,i)=>[r[0],i]));
 }
 get count(){return this.rows.length;}
 card(i){const r=this.rows[i];return r?{id:'bank:en:'+r[0],language:'en',mode:'vocab',level:'BANK',front:r[0],answer:r[1].join('; '),meanings:r[1],example:'',note:'Sözlük karşılıkları bağlama göre değişir. FreeDict + FrequencyWords; seviye ataması yok.',phonetic:'',source:'wordbank'}:null;}
 lookup(id){const word=id?.startsWith('bank:en:')?id.slice(8):id;return this.card(this.index.get(word));}
 search(query='',offset=0,limit=40,ids=null){const q=key(query);offset=Math.max(0,Math.floor(offset)||0);limit=Math.max(1,Math.min(40,Math.floor(limit)||40));let count=0;const cards=[];for(let i=0;i<this.rows.length;i++){const r=this.rows[i];if(ids&&!ids.has('bank:en:'+r[0]))continue;if(q&&!key(r[0]+' '+r[1].join(' ')).includes(q))continue;if(count>=offset&&cards.length<limit)cards.push(this.card(i));count++;}return {total:count,cards,offset,limit};}
 pool(state,now=Date.now()){const due=[],fresh=[],future=[];for(let i=0;i<this.rows.length;i++){const r=state.records['bank:en:'+this.rows[i][0]];if(r&&r.due<=now)due.push([i,r.due]);else if(!r&&fresh.length<20)fresh.push(i);else if(r&&future.length<20)future.push(i);}due.sort((a,b)=>a[1]-b[1]);return [...due.slice(0,40).map(x=>x[0]),...fresh,...(!due.length&&!fresh.length?future:[])].map(i=>this.card(i));}
 related(state){const ids=new Set([...Object.keys(state.records),...state.favorites]);return [...ids].filter(id=>id.startsWith('bank:en:')).map(id=>this.lookup(id)).filter(Boolean);}
}
const api={Wordbank};root.MochiWordbank=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
