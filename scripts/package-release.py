"""Package a labelled development build. Never replaces historical jam ZIPs."""
from pathlib import Path
import hashlib,json,zipfile,subprocess
ROOT=Path(__file__).resolve().parent.parent
subprocess.run(['node','scripts/verify-evidence.mjs'],cwd=ROOT,check=True)
version=json.loads((ROOT/'package.json').read_text())['version']
folder=ROOT/'releases';folder.mkdir(exist_ok=True)
runtime=sorted(p for p in (ROOT/'dist').iterdir() if p.is_file())
hashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in runtime}
metadata={'version':version,'acceptance':'RELEASE CANDIDATE / FUNCTIONAL GATES VERIFIED; SUBJECTIVE AUDIO AND PHYSICAL DEVICE REVIEW PENDING','published':False,'runtimeSha256':hashes}
html=folder/f'last-light-{version}-html5.zip';source=folder/f'last-light-{version}-source.zip'
with zipfile.ZipFile(html,'w',zipfile.ZIP_DEFLATED) as z:
 for p in runtime:z.write(p,p.name)
 z.write(ROOT/'LICENSE','LICENSE');z.writestr('BUILD.json',json.dumps(metadata,indent=2)+'\n')
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED) as z:
 for name in ['README.md','LICENSE','AGENTS.md','PROGRESS.md','DECISIONS.md','package.json','package-lock.json','index.html','.gitignore']:
  p=ROOT/name
  if p.exists():z.write(p,name)
 for directory in ['dist','scripts','tests','docs','media']:
  for p in sorted((ROOT/directory).rglob('*')):
   if not p.is_file() or p.is_symlink() or p.suffix=='.wav' or p.name.endswith('-4x.png') or '__pycache__' in p.parts:continue
   z.write(p,p.relative_to(ROOT))
 z.writestr('SOURCE_BUILD.json',json.dumps(metadata,indent=2)+'\n')
with zipfile.ZipFile(html) as h,zipfile.ZipFile(source) as s:
 assert 'index.html' in h.namelist()
 assert b'url=dist/' not in h.read('index.html')
 for name in hashes:assert h.read(name)==s.read('dist/'+name),name
manifest={**metadata,'packages':{p.name:{'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size} for p in [html,source]}}
(folder/f'SHA256-{version}.json').write_text(json.dumps(manifest,indent=2)+'\n')
(folder/'SHA256.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
