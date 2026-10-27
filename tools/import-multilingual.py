"""Build-time only import of attributed dictionary headwords; never machine translate.

Input files and exact hashes are recorded in ui/lexicon/MULTILINGUAL-SOURCES.json.
Run: python tools/import-multilingual.py SOURCE_DIR ui/lexicon
"""
import argparse,collections,gzip,hashlib,json,pathlib,re,unicodedata,xml.etree.ElementTree as ET
a=argparse.ArgumentParser();a.add_argument('source_dir');a.add_argument('output_dir');args=a.parse_args()
src=pathlib.Path(args.source_dir);out=pathlib.Path(args.output_dir)
langs=['de','fr','es','it','ru','ja'];entries={l:collections.defaultdict(list) for l in langs};used=[]
ns={'t':'http://www.tei-c.org/ns/1.0'}
def clean(s):
 s=unicodedata.normalize('NFC',' '.join(s.split())).strip(' ;,')
 return s if 1<=len(s)<=96 and not re.search(r'[<>\ufffd\x00-\x1f]|çekimi|fiilinin|çoğulu|tekili|şahıs|farklı yazılışı|form of',s,re.I) else ''
def head(w,l):
 w=unicodedata.normalize('NFC',w.strip())
 if not 1<=len(w)<=64 or not any(c.isalpha() for c in w) or any(not(c.isalpha() or unicodedata.category(c).startswith('M') or c in " '-’・ー") for c in w):return ''
 if l=='ja' and not re.search('[\u3040-\u30ff\u3400-\u9fff]',w):return ''
 if l=='ru' and not re.search('[А-Яа-яЁё]',w):return ''
 return w
def add(l,w,meanings):
 w=head(w,l)
 if not w:return
 for g in meanings:
  g=clean(g)
  if g and g not in entries[l][w] and len(entries[l][w])<3:entries[l][w].append(g)
def track(name,url,license):
 f=src/name;used.append({'file':name,'url':url,'license':license,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
def tei(name,l,reverse=False):
 root=ET.parse(src/name).getroot()
 for e in root.findall('.//t:entry',ns):
  if e.findtext('t:gramGrp/t:pos','',ns) in ['suffix','prefix','pn'] or e.findtext('t:gramGrp/t:number','',ns)=='pl':continue
  w=e.findtext('t:form/t:orth','',ns)
  for q in e.findall('.//t:cit[@type="trans"]/t:quote',ns):
   g=''.join(q.itertext())
   if reverse:add(l,g,[w])
   else:add(l,w,[g])
for l,name,ver in [('de','deu-tur','0.2.2'),('fr','fra-tur','2025.11.23'),('it','ita-tur','2025.11.23'),('es','spa-tur','2024.10.10')]:
 tei(name+'.tei',l);track(name+'.tei',f'https://download.freedict.org/dictionaries/{name}/{ver}/freedict-{name}-{ver}.src.tar.xz','GPL-2.0-or-later' if l=='de' else 'CC-BY-SA-3.0')
for l,name,rev in [('ru','rus-tur',False),('ja','jpn-tur',False),('es','spa-tur',False),('ru','tur-rus',True)]:
 tei(name+'-wikdict.tei',l,rev);track(name+'-wikdict.tei',f'https://download.wikdict.com/dictionaries/tei/recommended/{name}.tei','CC-BY-SA-3.0')
tei('tur-jpn.tei','ja',True);track('tur-jpn.tei','https://download.freedict.org/dictionaries/tur-jpn/2025.11.23/freedict-tur-jpn-2025.11.23.src.tar.xz','CC-BY-SA-3.0')
# Merge Turkish-edition definitions and explicit Turkish -> target translations.
for line in gzip.open(src/'tr-wiktextract.jsonl.gz','rt',encoding='utf-8'):
 d=json.loads(line);l=d.get('lang_code');w=d.get('word','')
 if d.get('pos') in ['name','suffix','prefix','character','symbol']:continue
 if l in langs:
  glosses=[g for s in d.get('senses',[]) if not s.get('form_of') and 'form-of' not in s.get('tags',[]) for g in s.get('glosses',[])]
  add(l,w,glosses)
 if l=='tr':
  for t in d.get('translations',[]):
   if t.get('lang_code') in langs:add(t['lang_code'],t.get('word',''),[w])
track('tr-wiktextract.jsonl.gz','https://kaikki.org/trwiktionary/raw-wiktextract-data.jsonl.gz','CC-BY-SA-4.0')
# Explicit editorial corrections for high-frequency polysemous/function words.
# These replace noisy reverse edges rather than letting unrelated senses teach first.
fix={
 'de':{'ich':['ben'],'Sie':['siz (resmî)'],'sie':['o (kadın)','onlar'],'das':['belirli tanımlık (nötr)','bu'],'ist':['-dır / -dir (sein fiili)'],'nicht':['değil'],'die':['belirli tanımlık (dişil veya çoğul)'],'es':['o (nötr)'],'und':['ve'],'der':['belirli tanımlık (eril)'],'was':['ne'],'er':['o (erkek)'],'zu':['-e / -a','çok'],'in':['içinde','-de / -da'],'du':['sen'],'wir':['biz'],'ein':['bir'],'Wasser':['su'],'Katze':['kedi'],'Buch':['kitap']},
 'fr':{'de':['-ın / -in','-den / -dan'],'est':['-dır / -dir (être fiili)','doğu'],'le':['belirli tanımlık (eril)','onu'],'la':['belirli tanımlık (dişil)','onu'],'a':['sahiptir (avoir fiili)'],'à':['-e / -a','-de / -da'],'que':['ki','ne'],'il':['o (erkek)'],'en':['içinde','-den / -dan'],'pas':['değil (ne…pas)','adım'],'je':['ben'],'vous':['siz'],'tu':['sen'],'un':['bir'],'et':['ve'],'une':['bir (dişil)'],'eau':['su'],'chat':['kedi'],'livre':['kitap']},
 'es':{'a':['-e / -a (yönelme)'],'de':['-ın / -in','-den / -dan'],'que':['ki'],'la':['belirli tanımlık (dişil)','onu'],'el':['belirli tanımlık (eril)'],'y':['ve'],'en':['içinde','-de / -da'],'por':['için','tarafından'],'mi':['benim'],'me':['beni','bana'],'no':['hayır','değil'],'sí':['evet'],'si':['eğer'],'un':['bir'],'con':['ile'],'agua':['su'],'gato':['kedi'],'libro':['kitap']},
 'it':{'la':['belirli tanımlık (dişil)','onu'],'a':['-e / -a','-de / -da'],'una':['bir (dişil)'],'mi':['beni','bana'],'di':['-ın / -in','-den / -dan'],'per':['için'],'che':['ki','ne'],'e':['ve'],'è':['-dır / -dir (essere fiili)'],'non':['değil'],'un':['bir'],'con':['ile'],'acqua':['su'],'gatto':['kedi'],'libro':['kitap']},
 'ru':{'я':['ben'],'в':['içinde','-de / -da'],'да':['evet'],'не':['değil'],'нет':['hayır','yok'],'Нет':['hayır','yok'],'мне':['bana'],'вода':['su'],'кот':['erkek kedi'],'кошка':['kedi'],'книга':['kitap']},
 'ja':{'あなた':['sen','siz'],'人':['insan','kişi'],'事':['olay','şey'],'前':['ön','önce'],'必要':['gerekli','ihtiyaç'],'ああ':['ah','evet (gündelik)'],'時':['zaman','saat'],'水':['su'],'猫':['kedi'],'本':['kitap'],'何':['ne'],'私':['ben']}}
for l,words in fix.items():entries[l].update(words)
print(json.dumps({l:sum(bool(v) for v in entries[l].values()) for l in langs}),flush=True)
for l in langs:
 freq=src/(l+'_50k.txt' if l!='ja' else 'ja_full.txt');rank={unicodedata.normalize('NFC',line.split()[0]).casefold():i for i,line in enumerate(freq.read_text(encoding='utf-8').splitlines()) if line.split()}
 # Stress marks in Russian and simple capitalization variants are not extra words.
 unique={}
 for w,g in entries[l].items():
  if not g:continue
  if l=='ru':w=w.replace('\u0301','')
  k=w.casefold()
  if k not in unique or w in fix[l]:unique[k]=(w,g)
 rows=sorted(unique.values(),key=lambda r:(rank.get(r[0].casefold(),10**9),r[0]))[:10000]
 assert len(rows)==10000,(l,len(rows),'Not enough real headwords; never pad with invented entries')
 text='word\tmeanings_json\n'+''.join(w+'\t'+json.dumps(g,ensure_ascii=False,separators=(',',':'))+'\n' for w,g in rows)
 (out/(l+'-source.tsv.gz')).write_bytes(gzip.compress(text.encode(),compresslevel=9,mtime=0))
 track(freq.name,'https://github.com/hermitdave/FrequencyWords/tree/master/content/2018/'+l,'CC-BY-SA-4.0')
(out/'MULTILINGUAL-SOURCES.json').write_text(json.dumps({'sources':used,'adaptationLicenses':{'de':'GPL-3.0-only',**{l:'CC-BY-SA-4.0' for l in langs if l!='de'}},'modifications':'Merge explicit bilingual translations and Turkish definitions; reverse explicit Turkish translation edges, without pivot translation. Exclude marked inflections, affixes and names where tagged. Normalize NFC and whitespace, deduplicate exact headwords, retain up to 3 short glosses, rank source-supported entries by subtitle frequency (unranked entries follow alphabetically), select 10000. Compound expressions and spelling variants may occur; no fabricated forms, CEFR labels or examples. Not independently teacher-reviewed.','extraction':'Turkish Wiktionary dump 2026-10-02; Kaikki extract downloaded 2026-10-27.','rebuild':'*-source.tsv.gz is the editable preferred source; build-pack.py rebuilds runtime packs offline.'},ensure_ascii=False,indent=2),encoding='utf-8')
