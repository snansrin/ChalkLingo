"""Build editable wordbank source from licensed upstream files, never at app runtime."""
import argparse, collections, gzip, hashlib, json, pathlib, re, xml.etree.ElementTree as ET
args=argparse.ArgumentParser();args.add_argument('source_dir');args.add_argument('output_dir');a=args.parse_args()
src=pathlib.Path(a.source_dir);out=pathlib.Path(a.output_dir);out.mkdir(parents=True,exist_ok=True)
ns={'t':'http://www.tei-c.org/ns/1.0'};entries=collections.defaultdict(list)
def clean(text):
    text=' '.join(text.split())
    if re.search(r'\((?:eski|esk\.|argo|slang|vulg|kaba|bak\.|see|cf\.)',text,re.I):return ''
    text=re.sub(r'^(?:\([^)]{1,25}\)\s*)+','',text)
    text=re.split(r'\.\s+[A-Za-z]',text)[0].strip(' .;,')
    if '\ufffd' in text or not 2<=len(text)<=72 or text.count('(')!=text.count(')') or not re.search('[a-zA-ZçğıöşüÇĞİÖŞÜ]',text):return ''
    return text
for e in ET.parse(src/'eng-tur.tei').getroot().findall('.//t:entry',ns):
    word=e.findtext('t:form/t:orth','',ns).strip()
    if not re.fullmatch('[a-z]{2,24}',word):continue
    for q in e.findall('.//t:quote',ns):
        value=clean(''.join(q.itertext()))
        if value and value.casefold()!=word and not re.search(r'\b'+re.escape(word)+r'\b',value,re.I) and value not in entries[word]:entries[word].append(value)
# Small, explicit editorial corrections for frequent polysemous/function words.
fix={'book':['kitap','rezervasyon yapmak'],'bank':['banka','nehir kıyısı'],'light':['ışık','hafif'],'the':['belirli tanımlık'],'an':['bir'],'as':['olarak','gibi'],'be':['olmak'],'do':['yapmak'],'have':['sahip olmak'],'can':['yapabilmek','teneke kutu'],'may':['olabilir','mayıs'],'will':['gelecek zaman yardımcısı','istek'],'would':['koşul ve nezaket yardımcısı'],'should':['yapmalı'],'could':['yapabilirdi'],'must':['zorunda olmak'],'shall':['gelecek ve öneri yardımcısı'],'it':['o (cansız varlık)'],'its':['onun (cansız varlık)'],'you':['sen','siz'],'your':['senin','sizin'],'we':['biz'],'our':['bizim'],'they':['onlar'],'their':['onların'],'he':['o (erkek)'],'she':['o (kadın)'],'her':['onun (kadın)','onu (kadın)'],'his':['onun (erkek)'],'was':['idi'],'were':['idiler'],'been':['olmuş'],'being':['olma','varlık'],'water':['su'],'apple':['elma'],'computer':['bilgisayar'],'hello':['merhaba'],'thank':['teşekkür etmek']}
fix.update({'to':['-e / -a (yönelme)','-mek / -mak (mastar)'],'of':['-ın / -in (aidiyet)'],'is':['-dır / -dir (be fiili)'],'in':['içinde','-de / -da'],'for':['için'],'on':['üstünde'],'at':['-de / -da (yer veya zaman)'],'from':['-den / -dan'],'with':['ile'],'about':['hakkında','yaklaşık'],'are':['-dır / -dir (be fiili)'],'am':['-im / -ım (be fiili)'],'not':['değil'],'no':['hayır'],'so':['bu yüzden','çok'],'out':['dışarı'],'up':['yukarı'],'but':['ama'],'or':['veya'],'if':['eğer'],'by':['tarafından','yanında'],'get':['almak','edinmek'],'go':['gitmek'],'got':['aldı','edindi'],'know':['bilmek'],'did':['yaptı'],'does':['yapar'],'see':['görmek'],'come':['gelmek'],'just':['sadece','az önce'],'all':['tüm','hepsi'],'too':['de / da','çok'],'there':['orada'],'here':['burada'],'then':['sonra','o zaman'],'than':['-den / -dan (karşılaştırma)'],'has':['sahiptir'],'had':['sahipti'],'yes':['evet'],'now':['şimdi'],'well':['iyi','peki'],'right':['sağ','doğru','hak'],'back':['geri','sırt'],'like':['sevmek','gibi'],'one':['bir'],'two':['iki'],'thing':['şey'],'man':['adam'],'men':['erkekler'],'woman':['kadın'],'women':['kadınlar'],'girl':['kız'],'boy':['erkek çocuk'],'people':['insanlar'],'person':['kişi'],'down':['aşağı'],'off':['kapalı','uzakta'],'some':['biraz','bazı'],'any':['herhangi'],'more':['daha','fazla'],'other':['diğer'],'make':['yapmak'],'made':['yaptı'],'time':['zaman'],'day':['gün'],'years':['yıllar'],'year':['yıl'],'way':['yol','yöntem'],'say':['söylemek'],'said':['söyledi'],'want':['istemek'],'need':['ihtiyaç duymak'],'good':['iyi'],'bad':['kötü'],'please':['lütfen'],'think':['düşünmek'],'thought':['düşündü','düşünce'],'let':['izin vermek'],'us':['bizi','bize'],'them':['onları','onlara'],'him':['onu','ona'],'my':['benim'],'mine':['benimki'],'might':['olabilir']})
entries.update(fix)
excluded=set('fuck shit bitch porn porno cock pussy cunt fucking bullshit asshole blowjob'.split())
ranked=[];seen=set()
for line in (src/'en_50k.txt').read_text(encoding='utf-8').splitlines():
    word=line.split()[0]
    if word in seen or word in excluded or word not in entries or not entries[word]:continue
    seen.add(word);ranked.append((word,entries[word][:3]))
    if len(ranked)==10000:break
assert len(ranked)==10000,(len(ranked),'not enough clean distinct translated headwords')
tsv='word\tmeanings_json\n'+''.join(w+'\t'+json.dumps(v,ensure_ascii=False,separators=(',',':'))+'\n' for w,v in ranked)
(out/'en-source.tsv.gz').write_bytes(gzip.compress(tsv.encode(),compresslevel=9,mtime=0))
notice={'dictionary':{'name':'English-Turkish FreeDict 0.3','url':'https://github.com/freedict/fd-dictionaries/blob/dc426dbe79483dc1c020bffca532470557cd94b9/eng-tur/eng-tur.tei','license':'GPL-2.0-or-later','sha256':hashlib.sha256((src/'eng-tur.tei').read_bytes()).hexdigest()},'ranking':{'name':'FrequencyWords English 2018, Hermit Dave / OpenSubtitles','url':'https://github.com/hermitdave/FrequencyWords/blob/master/content/2018/en/en_50k.txt','license':'CC-BY-SA-4.0','sha256':hashlib.sha256((src/'en_50k.txt').read_bytes()).hexdigest()},'adaptationLicense':'GPL-3.0-only','modifications':'Select 10,000 distinct lowercase headwords; normalize whitespace; filter broken/long/cross-reference/archaic glosses; keep at most three meanings; apply explicit frequent-word corrections; rank by subtitle frequency. No CEFR classification or example sentences are fabricated. Frequency ranking does not imply a validated teaching sequence.','source':'en-source.tsv.gz is the editable preferred source for this adaptation; build-pack.py regenerates en.json.gz without network access.'}
(out/'SOURCES.json').write_text(json.dumps(notice,ensure_ascii=False,indent=2),encoding='utf-8')
for name in ['GPL-3.0.txt','CC-BY-SA-4.0.txt']:(out/name).write_bytes((src/name).read_bytes())
print(json.dumps({'count':len(ranked),'editableSourceBytes':(out/'en-source.tsv.gz').stat().st_size,'examples':ranked[:15]},ensure_ascii=True))
