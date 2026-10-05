import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('../public/',import.meta.url))),port=Number(process.env.PORT??4173);
createServer(async(req,res)=>{try{const url=new URL(req.url!,'http://localhost');let path=resolve(root,'.'+decodeURIComponent(url.pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}if((await stat(path)).isDirectory())path=resolve(path,'index.html');const types:Record<string,string>={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.zip':'application/zip','.lisp':'text/plain; charset=utf-8'};res.writeHead(200,{'Content-Type':types[extname(path)]??'application/octet-stream'});res.end(await readFile(path));}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`LISP ATELIER: http://127.0.0.1:${port}`));
