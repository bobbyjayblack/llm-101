import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';

const files={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js','/course.js':'course.js','/narration.js':'narration.js'};
const types={html:'text/html',css:'text/css',js:'text/javascript'};
const appId=createHash('sha256').update(dirname(fileURLToPath(import.meta.url)).toLowerCase()).digest('hex').slice(0,16);
function json(res,code,body){res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body));}

export function createCourseServer(){
  return http.createServer(async(req,res)=>{
    if(!['127.0.0.1:4173','localhost:4173'].includes(req.headers.host))return json(res,403,{error:'Local access only.'});
    const route=new URL(req.url,'http://127.0.0.1:4173').pathname;
    if(route==='/health'&&req.method==='GET')return json(res,200,{service:'llm101-web',appId});
    if(route==='/api/audio/preparation'&&req.method==='GET'){
      try{return json(res,200,JSON.parse(await readFile(new URL('.service/prerender-claire.json',import.meta.url),'utf8')));}
      catch{return json(res,200,{state:'not-started'});}
    }
    if(route==='/api/audio/status'&&req.method==='GET'){
      try{
        const response=await fetch('http://127.0.0.1:4174/health',{signal:AbortSignal.timeout(3000)});
        const health=await response.json();
        if(health.service!=='llm101-audio'||health.appId!==appId)throw new Error('Different audio service');
        return json(res,200,health);
      }catch{return json(res,200,{status:'offline'});}
    }
    if(['/api/audio/speech','/api/audio/timings'].includes(route)&&req.method==='POST'){
      if(req.headers.origin&&!['http://127.0.0.1:4173','http://localhost:4173'].includes(req.headers.origin))return json(res,403,{error:'Origin is not allowed.'});
      if(req.headers['content-type']?.split(';')[0]!=='application/json')return json(res,415,{error:'Use application/json.'});
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),180000);
      res.on('close',()=>controller.abort());
      try{
        const chunks=[];let length=0;
        for await(const chunk of req){length+=chunk.length;if(length>10000)return json(res,413,{error:'Speech request is too large.'});chunks.push(chunk);}
        const body=Buffer.concat(chunks).toString('utf8');
        const check=await fetch('http://127.0.0.1:4174/health',{signal:controller.signal});
        const health=await check.json();
        if(health.service!=='llm101-audio'||health.appId!==appId)throw new Error('Different audio service');
        const response=await fetch('http://127.0.0.1:4174/'+route.split('/').at(-1),{method:'POST',headers:{'Content-Type':'application/json'},body,signal:controller.signal});
        const data=Buffer.from(await response.arrayBuffer());
        if(!res.destroyed){res.writeHead(response.status,{'Content-Type':response.headers.get('content-type')||'application/json','Cache-Control':'no-store','X-Audio-Cache':response.headers.get('x-audio-cache')||''});res.end(data);}
      }catch{
        if(!res.destroyed)json(res,503,{error:'Local narration is unavailable or took too long. Run start.bat, then retry, or choose Browser voices in settings.'});
      }finally{clearTimeout(timeout);}
      return;
    }
    if(!['GET','HEAD'].includes(req.method))return json(res,405,{error:'Method not allowed.'});
    const path=files[route];
    if(!path)return json(res,404,{error:'Not found.'});
    try{const body=await readFile(new URL(path,import.meta.url));res.writeHead(200,{'Content-Type':types[path.split('.').pop()]+'; charset=utf-8','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:body);}
    catch{json(res,500,{error:'Unable to load course file.'});}
  });
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])createCourseServer().listen(4173,'127.0.0.1',()=>console.log('Course ready at http://127.0.0.1:4173'));
