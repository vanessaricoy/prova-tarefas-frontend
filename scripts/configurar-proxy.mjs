import{readFileSync,writeFileSync}from'node:fs';
import{fileURLToPath}from'node:url';
const origin=process.argv[2];
if(!origin){console.error('Uso: node scripts/configurar-proxy.mjs http://IP_DA_EC2:8080');process.exit(1);}
let url;try{url=new URL(origin);if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname))throw Error();}catch{console.error('Informe uma origem HTTP/HTTPS válida, sem caminhos ou credenciais.');process.exit(1);}
const file=fileURLToPath(new URL('../vercel.json',import.meta.url));
const config=JSON.parse(readFileSync(file,'utf8'));config.rewrites[0].destination=`${url.origin}/:path*`;writeFileSync(file,JSON.stringify(config,null,2)+'\n');console.log('Proxy atualizado em vercel.json. Faça commit/push e novo deploy Vercel.');
