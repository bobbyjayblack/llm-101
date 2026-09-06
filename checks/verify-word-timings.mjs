import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {courseAudioPlan} from '../audio-plan.js';

const results=[];
for(const item of courseAudioPlan()){
  const start=performance.now();
  const response=await fetch('http://127.0.0.1:4173/api/audio/timings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:item.text,voice:'claire'}),signal:AbortSignal.timeout(3000)});
  assert.equal(response.status,200);
  const {words,duration}=await response.json(),textWords=item.text.match(/\S+/gu);
  const required=textWords.flatMap((text,index)=>/[A-Za-z0-9]/.test(text)?[index]:[]);
  assert.deepEqual(words.map(word=>word.index),required,'Every spoken text word needs an acoustic alignment');
  let end=0;
  for(const word of words){
    assert.ok(word.start>=end&&word.end>word.start&&word.end<=duration+.001,'Word intervals must be ordered and within the recording');
    end=word.end;
  }
  results.push({words:words.length,ms:Math.round(performance.now()-start)});
}
const times=results.map(item=>item.ms).sort((a,b)=>a-b);
const summary={segments:results.length,words:results.reduce((sum,item)=>sum+item.words,0),medianMs:times[Math.floor(times.length/2)],maxMs:times.at(-1)};
await writeFile('.service/word-timings-verification.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary));
