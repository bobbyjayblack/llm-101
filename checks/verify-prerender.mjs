import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {courseAudioPlan} from '../audio-plan.js';

const status=await (await fetch('http://127.0.0.1:4173/api/audio/preparation')).json();
assert.equal(status.state,'ready','Wait for the background pre-render to complete first.');
const results=[];
for(const [index,item] of courseAudioPlan().entries()){
  const started=performance.now();
  const response=await fetch('http://127.0.0.1:4173/api/audio/speech',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:item.text,voice:'claire'}),signal:AbortSignal.timeout(3000)});
  assert.equal(response.status,200,`Segment ${index+1} must be playable`);
  assert.equal(response.headers.get('x-audio-cache'),'hit',`Segment ${index+1} must already be saved`);
  const wav=Buffer.from(await response.arrayBuffer());
  assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');
  let bytesPerSecond=0,dataSize=0;
  for(let offset=12;offset+8<=wav.length;){
    const name=wav.toString('ascii',offset,offset+4),size=wav.readUInt32LE(offset+4);
    if(name==='fmt ')bytesPerSecond=wav.readUInt32LE(offset+16);
    if(name==='data')dataSize=size;
    offset+=8+size+(size%2);
  }
  const seconds=dataSize/bytesPerSecond;
  assert.ok(seconds>0&&seconds<180,`Invalid duration for segment ${index+1}`);
  results.push({segment:index+1,lesson:item.lesson,ms:Math.round(performance.now()-started),seconds});
}
const times=results.map(item=>item.ms).sort((a,b)=>a-b);
const summary={segments:results.length,medianMs:times[Math.floor(times.length/2)],p95Ms:times[Math.floor(times.length*.95)],maxMs:times.at(-1),audioMinutes:Math.round(results.reduce((sum,item)=>sum+item.seconds,0)/60*10)/10};
await writeFile('.service/prerender-verification.json',JSON.stringify({summary,results},null,2));
console.log(JSON.stringify(summary));
