from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import json
root=Path(__file__).resolve().parents[1]/'web'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.ids=[];self.refs=[];self.labels=[];self.fields=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        for key in ['href','src','action']:
            if a.get(key):self.refs.append(a[key])
        if tag=='label' and 'for' in a:self.labels.append(a['for'])
        if tag in ['input','select','textarea'] and a.get('type')!='hidden':self.fields.append(a.get('id'))
pages={p:Page(p.read_text(encoding='utf-8')) for p in root.glob('*.html')}
for path,page in pages.items():
    assert len(page.ids)==len(set(page.ids)),f'duplicate id: {path}'
    for label in page.labels:assert label in page.ids,f'Label target: {path}: {label}'
    for field in page.fields:assert field in page.labels,f'Missing label: {path}: {field}'
    for ref in page.refs:
        u=urlparse(ref)
        if u.scheme or u.netloc:continue
        target=(path.parent/unquote(u.path)).resolve() if u.path else path
        assert target.exists(),f'Missing file: {path}: {ref}'
        if u.fragment and target.suffix=='.html':assert unquote(u.fragment) in pages[target].ids,f'Missing anchor: {ref}'
assert not any(root.glob('references/**'))
cfg=json.loads((root/'config/site.json').read_text())
assert cfg['features']['showIllustrativeCases'] is True
print(f'PASS: {len(pages)} HTML pages, unique IDs, local files/anchors, form labels, production web root.')
