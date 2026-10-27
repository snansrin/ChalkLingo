"""GPL-3.0-only dictionary adaptation. Rebuild using only the bundled editable source."""
import gzip,hashlib,json,pathlib
p=pathlib.Path(__file__).resolve().parent
lines=gzip.decompress((p/'en-source.tsv.gz').read_bytes()).decode('utf-8').splitlines()
rows=[]
for line in lines[1:]:
    word,meanings=line.split('\t',1);rows.append([word,json.loads(meanings)])
assert len(rows)==10000 and len({r[0] for r in rows})==10000
data=json.dumps({'version':1,'language':'en','rows':rows},ensure_ascii=False,separators=(',',':')).encode()
packed=gzip.compress(data,compresslevel=9,mtime=0);(p/'en.json.gz').write_bytes(packed)
manifest={'version':1,'packs':{'en':{'count':len(rows),'bytes':len(packed),'rawBytes':len(data),'sha256':hashlib.sha256(packed).hexdigest(),'file':'en.json.gz','license':'GPL-3.0-only','source':'en-source.tsv.gz'}}}
(p/'manifest.json').write_text(json.dumps(manifest,separators=(',',':')),encoding='utf-8')
print(json.dumps(manifest))
