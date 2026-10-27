"""GPL-3.0-only dictionary adaptation. Rebuild using only the bundled editable source."""
import gzip,hashlib,json,pathlib
p=pathlib.Path(__file__).resolve().parent
manifest={'version':1,'packs':{}}
for language in ['en','de','fr','es','it','ru','ja']:
    lines=gzip.decompress((p/(language+'-source.tsv.gz')).read_bytes()).decode('utf-8').splitlines()
    rows=[]
    for line in lines[1:]:
        word,meanings=line.split('\t',1);rows.append([word,json.loads(meanings)])
    assert len(rows)==10000 and len({r[0] for r in rows})==10000
    data=json.dumps({'version':1,'language':language,'rows':rows},ensure_ascii=False,separators=(',',':')).encode()
    packed=gzip.compress(data,compresslevel=9,mtime=0);(p/(language+'.json.gz')).write_bytes(packed)
    manifest['packs'][language]={'count':len(rows),'bytes':len(packed),'rawBytes':len(data),'sha256':hashlib.sha256(packed).hexdigest(),'file':language+'.json.gz','license':'GPL-3.0-only' if language in ['en','de'] else 'CC-BY-SA-4.0','source':language+'-source.tsv.gz'}
(p/'manifest.json').write_text(json.dumps(manifest,separators=(',',':')),encoding='utf-8')
print(json.dumps(manifest))
