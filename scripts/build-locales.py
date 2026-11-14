from pathlib import Path
import json,re,html
root=Path(__file__).resolve().parent.parent
languages=('fa','ar','es','fr','de','pt-BR','ru','zh-CN','hi','tr','id','ja','ko','ur','bn','vi')
for lang in languages:
 f=root/'locales'/f'{lang}.txt'
 entries={}
 if f.exists():
  for n,l in enumerate(f.read_text(encoding='utf8').splitlines(),1):
   if not l.strip() or l.lstrip().startswith('#'): continue
   if ' => ' not in l: raise ValueError(f'{lang}:{n}: expected separator =>')
   k,v=l.split(' => ',1)
   if not k or not v:raise ValueError(f'{lang}:{n}: empty translation')
   if k in entries: raise ValueError(f'{lang}:{n}: duplicate {k}')
   entries[k]=v
 target=root/'locales'/f'{lang}.json'
 target.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print(lang,len(entries))
