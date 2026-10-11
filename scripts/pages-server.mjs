import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'
const root=process.argv[2], base='/ecommerce-n8n/'
const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'}
http.createServer((q,r)=>{const u=new URL(q.url,'http://x');let p=u.pathname
if(!p.startsWith(base)){r.statusCode=404;return r.end('nf')}
let f=path.join(root,p.slice(base.length)||'index.html'); if(p.endsWith('/'))f=path.join(root,p.slice(base.length),'index.html')
if(fs.existsSync(f)&&fs.statSync(f).isFile()){r.setHeader('content-type',types[path.extname(f)]||'application/octet-stream');return fs.createReadStream(f).pipe(r)}
r.statusCode=404;r.setHeader('content-type','text/html');fs.createReadStream(path.join(root,'404.html')).pipe(r)}).listen(4173)
