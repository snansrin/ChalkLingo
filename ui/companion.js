'use strict';
let companion={enabled:false,phase:'off',direction:1},thoughtAt=0,thoughtIndex=0;
const daydreams=['Bulutların da kelimeleri var mıdır? ☁','Bir yaprak daha… küçük bir başlangıç. ♧','Biraz gezsem, sonra bir kelime öğrensem…','Acaba yarın hangi kelime filizlenecek?','Merak etmek de bir başlangıç. ✧','Bir çay molası kadar küçük bir keşif…','Pof! Aklımda minik bir fikir var.','Sana sessizce eşlik ediyorum. ♡'];
function nextThought(now=Date.now(),force=false){
 if(!companion.enabled||hidden||$('panel').open||(!force&&now-thoughtAt<17000))return;
 thoughtAt=now;thoughtIndex++;
 const familiar=allLessons().filter(c=>c.language===state.settings.language&&c.mode!=='grammar'&&((state.records[c.id]?.best||0)>0||Object.hasOwn(state.education.introduced,c.id)));
 let thought=daydreams[thoughtIndex%daydreams.length];
 if(familiar.length&&thoughtIndex%3===0){const card=familiar[Math.floor(thoughtIndex/3)%familiar.length];thought=`${card.front}… ${card.answer}. Küçük bir bağ daha. ♡`;}
 $('bubble').textContent=thought.length>112?thought.slice(0,109)+'…':thought;$('bubble').title=thought;
}
function applyCompanion(value){
 if(!value||typeof value.enabled!=='boolean')return;if(Number.isInteger(value.revision)&&value.revision<(companion.revision??-1))return;
 const started=!companion.enabled&&value.enabled,previousPause=companion.pauseReason;companion=value;
 if(value.layout){mini=value.layout==='pet';document.body.classList.toggle('mini',mini);$('expand').hidden=!mini;}
 document.body.classList.toggle('roaming',value.enabled);document.body.classList.toggle('walking',value.phase==='walking');document.body.dataset.direction=value.direction===-1?'left':'right';
 $('roam-toggle').textContent=value.enabled?'Burada dinlen ⏸':'Gezintiye çık ♡';$('roam-toggle').setAttribute('aria-pressed',String(value.enabled));
 if(typeof value.pinned==='boolean'){pinned=value.pinned;$('pin').setAttribute('aria-pressed',String(pinned));}
 $('bubble').setAttribute('aria-live',value.enabled?'off':'polite');
 if(value.enabled&&value.pauseReason==='hover'){$('bubble').textContent='Buradayım. Fareyi çekince gezmeye devam ederim. ♡';}else if(value.enabled&&value.pauseReason==='motion'){$('bubble').textContent='Hareket azaltma açık; burada sana eşlik ediyorum. ♡';}else if(started||previousPause==='hover'||previousPause==='motion')nextThought(Date.now(),true);else nextThought();
 if(!value.enabled){$('bubble').removeAttribute('title');document.body.classList.remove('walking');}
 if($('roaming-setting'))$('roaming-setting').checked=value.wanted??value.enabled;$('mini').title=value.wanted?'Gezintiye dön':'Küçük arkadaş modu';
}
async function setCompanionRoaming(value){if(!native?.setRoaming)return;await syncCompanionMotion();applyCompanion(await native.setRoaming(value));}
function syncCompanionMotion(){return native?.companionMotion?.(state.settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches);}
native?.onCompanion?.(applyCompanion);
$('roam-toggle').onclick=event=>{const pointer=event.detail>0;guarded(async()=>{await setCompanionRoaming(!companion.enabled);if(pointer)$('roam-toggle').blur();})();};
document.documentElement.addEventListener('pointerenter',()=>{native?.companionHover?.(true)?.catch(()=>{});},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{native?.companionHover?.(false)?.catch(()=>{});},{passive:true});
const companionAmbient=window.mochiAmbient;window.mochiAmbient=now=>{if(!companion.enabled)companionAmbient?.(now);else{document.body.classList.remove('sleeping');nextThought(now);}};
const companionApplySettings=applySettings;applySettings=function(){companionApplySettings();syncCompanionMotion()?.catch(()=>{});};
const companionSettings=openSettings;openSettings=async function(){await companionSettings();if(!$('language'))return;const section=document.createElement('div');section.innerHTML=`<label class="setting"><span>Masaüstü gezintisi<small>Küçük arkadaş modunda gezer, durur ve düşünür. Üzerine gelince bekler.</small></span><input id="roaming-setting" type="checkbox" ${(companion.wanted??companion.enabled)?'checked':''}></label><p class="intro">Baloncuklar kısa düşünceler ve tanıştığın kelimelerden çağrışımlar gösterir. Öğrenme puanı kazandırmaz. Azaltılmış hareket açıkken yerinde düşünür. Ders sırasında gezinti bekler; küçük arkadaş moduna dönünce devam eder. Burada dinlen düğmesi gezintiyi tamamen kapatır.</p>`;$('panel-content').prepend(section);$('roaming-setting').onchange=guarded(async()=>{const enabled=$('roaming-setting').checked;closePanel();await setCompanionRoaming(enabled);});};
$('settings').onclick=openSettings;
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>syncCompanionMotion()?.catch(()=>{}));
syncCompanionMotion()?.catch(()=>{});native?.getRoaming?.().then(applyCompanion).catch(()=>{});
