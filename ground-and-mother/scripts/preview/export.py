"""Exports the running site (next start on :3100) as a static, interactive preview.

Strips the Next.js runtime, rewrites links to relative .html files, inlines the latin fonts
and adds scripts/preview/preview.js, which re-creates the client interactions.
  npm run build && npx next start -p 3100 &
  python3 scripts/preview/export.py preview-out
"""
import urllib.request, re, collections, os, posixpath, base64, shutil, sys
BASE='http://localhost:3100'
HERE=os.path.dirname(os.path.abspath(__file__))
ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
NEXT=os.path.join(ROOT,'.next')
PUB=os.path.join(ROOT,'public')
OUT=sys.argv[1]
os.makedirs(OUT, exist_ok=True)
class NR(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*a,**k): return None
op=urllib.request.build_opener(NR)
def get(u):
    try:
        r=op.open(BASE+u); return r.status, r.read().decode('utf8')
    except urllib.error.HTTPError as e: return e.code, ''

def file_for(path):
    path=path.rstrip('/')
    parts=path.strip('/').split('/')
    if len(parts)==1: return parts[0]+'/index.html'
    return '/'.join(parts)+'.html'

# crawl
pages={}; q=collections.deque(['/en','/es'])
while q:
    u=q.popleft().rstrip('/') or '/en'
    if u in pages: continue
    code,body=get(u)
    if code!=200: continue
    pages[u]=body
    for h in re.findall(r'href="(/(?:en|es)[^"#?]*)',body):
        h=h.rstrip('/')
        if h not in pages: q.append(h)
print('pages:',len(pages))

# css: one combined file, latin fonts inlined
css_hrefs=sorted(set(h for b in pages.values() for h in re.findall(r'href="(/_next/static/[^"]+\.css)"',b)))
css=''
for h in css_hrefs: css+=get(h)[1]+'\n'
def keep_face(m):
    block=m.group(0)
    url=re.search(r'url\(\.\./media/([^)]+)\)',block)
    if not url: return block
    name=url.group(1)
    if '-latin-' not in name or '-latin-ext-' in name: return ''
    data=open(os.path.join(NEXT,'static/media',name),'rb').read()
    return block.replace(url.group(0),'url(data:font/woff2;base64,'+base64.b64encode(data).decode()+')')
css=re.sub(r'@font-face\{[^}]*\}',keep_face,css)
# preview-only: keep the fixed header clear of a phone's top inset
css=css.replace('url(/textures/','url(../textures/')
css+='\n.site-header{padding-top:env(safe-area-inset-top,0px)}\n'
os.makedirs(OUT+'/textures',exist_ok=True)
shutil.copy(PUB+'/textures/soil.jpg',OUT+'/textures/soil.jpg')
os.makedirs(OUT+'/assets',exist_ok=True)
open(OUT+'/assets/site.css','w').write(css)
shutil.copy(os.path.join(HERE,'preview.js'),OUT+'/assets/preview.js')
shutil.copy(os.path.join(HERE,'plate.js'),OUT+'/assets/plate.js')
shutil.copy(PUB+'/icon.svg',OUT+'/icon.svg')
print('css KB',len(css)//1024, 'fonts kept', css.count('data:font'))

def transform(html, here):
    d=posixpath.dirname(here)
    rel=lambda target: posixpath.relpath(target, d or '.')
    # drop Next runtime
    html=re.sub(r'<script(?![^>]*application/ld\+json)[^>]*>(?:(?!</script>).)*</script>', lambda m: m.group(0) if ("classList.add('js')" in m.group(0) and len(m.group(0)) < 200) else '', html, flags=re.S)
    html=re.sub(r'<link rel="(?:preload|modulepreload|preconnect)"[^>]*/?>','',html)
    html=re.sub(r'<link rel="stylesheet" href="/_next/[^"]+"[^>]*/?>','',html)
    html=re.sub(r'<link rel="(?:canonical|alternate)"[^>]*/?>','',html)
    html=html.replace('href="/icon.svg"','href="'+rel('icon.svg')+'"')
    def link(m):
        path,anchor=m.group(1).rstrip('/'),m.group(2) or ''
        if path not in pages: return m.group(0)
        return 'href="'+rel(file_for(path))+anchor+'"'
    html=re.sub(r'href="(/(?:en|es)[^"#?]*)(#[^"]*)?"',link,html)
    return html

for u,body in pages.items():
    f=file_for(u)
    h=transform(body,f)
    css_tag='<link rel="stylesheet" href="'+posixpath.relpath('assets/site.css',posixpath.dirname(f))+'"/>'
    js_tag='<script src="'+posixpath.relpath('assets/plate.js',posixpath.dirname(f))+'"></script><script src="'+posixpath.relpath('assets/preview.js',posixpath.dirname(f))+'"></script>'
    h=h.replace('</head>',css_tag+'</head>',1).replace('</body>',js_tag+'</body>',1)
    os.makedirs(os.path.dirname(OUT+'/'+f),exist_ok=True)
    open(OUT+'/'+f,'w').write(h)

# entry page: the English home, as body content for the artifact skeleton
h=transform(pages['/en'],'index.html')
title=re.search(r'<title>.*?</title>',h,re.S).group(0)
body=re.search(r'<body[^>]*>(.*)</body>',h,re.S).group(1)
entry=('<title>Ground &amp; Mother</title>\n'
       '<link rel="stylesheet" href="assets/site.css"/>\n'
       '<script>try{if(localStorage.getItem("gm_locale")==="es"){location.replace("es/index.html")}}catch(e){}document.documentElement.lang="en";document.documentElement.classList.add("js")</script>\n'
       +body+'\n<script src="assets/plate.js"></script>\n<script src="assets/preview.js"></script>\n')
open(OUT+'/index.html','w').write(entry)
files=[os.path.relpath(os.path.join(dp,fn),OUT) for dp,_,fns in os.walk(OUT) for fn in fns]
print('files:',len(files))
