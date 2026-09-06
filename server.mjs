import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files = {'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js','/course.js':'course.js'};
const types = {html:'text/html',css:'text/css',js:'text/javascript'};
http.createServer(async (req,res)=>{
  const path = files[new URL(req.url,'http://localhost').pathname];
  if(!path){res.writeHead(404);res.end('Not found');return;}
  try {const body=await readFile(new URL(path,import.meta.url));res.writeHead(200,{'Content-Type':types[path.split('.').pop()]+'; charset=utf-8','Cache-Control':'no-store'});res.end(body);}
  catch {res.writeHead(500);res.end('Unable to load course file');}
}).listen(4173,'127.0.0.1',()=>console.log('Course ready at http://127.0.0.1:4173'));
