import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createCourseServer} from './server.mjs';

test('web server preserves static allowlist and protects speech endpoint',async()=>{
  const server=createCourseServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const request=(path,{method='GET',headers={},body}={})=>new Promise((resolve,reject)=>{
    const req=http.request({hostname:'127.0.0.1',port:server.address().port,path,method,headers:{Host:'127.0.0.1:4173',...headers}},res=>{
      let text='';res.on('data',chunk=>text+=chunk);res.on('end',()=>resolve({status:res.statusCode,text}));
    });req.on('error',reject);req.end(body);
  });
  try{
    assert.equal((await request('/')).status,200);
    assert.equal((await request('/narration.js')).status,200);
    for(const path of ['/audio_service.py','/.models/base/config.json','/.audio/voices/claire.wav','/AGENTS.md'])assert.equal((await request(path)).status,404);
    assert.equal((await request('/',{headers:{Host:'attacker.example'}})).status,403);
    assert.equal((await request('/api/audio/speech',{method:'POST',headers:{Origin:'https://attacker.example','Content-Type':'application/json'},body:'{}'})).status,403);
    assert.equal((await request('/api/audio/speech',{method:'POST',body:'{}'})).status,415);
    assert.equal((await request('/api/audio/speech',{method:'POST',headers:{'Content-Type':'application/json'},body:'a'.repeat(10001)})).status,413);
    assert.equal((await request('/api/audio/timings',{method:'POST',headers:{Origin:'https://attacker.example','Content-Type':'application/json'},body:'{}'})).status,403);
    assert.equal((await request('/api/audio/timings',{method:'POST',body:'{}'})).status,415);
    assert.equal((await request('/api/audio/timings',{method:'POST',headers:{'Content-Type':'application/json'},body:'a'.repeat(10001)})).status,413);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
