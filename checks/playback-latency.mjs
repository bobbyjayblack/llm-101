import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';

const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
await page.addInitScript(()=>{
  window.audioTimings=[];
  const OriginalAudio=window.Audio;
  window.Audio=function(...args){
    const audio=new OriginalAudio(...args);
    for(const event of ['playing','ended'])audio.addEventListener(event,()=>window.audioTimings.push({event,time:performance.now(),rate:audio.playbackRate}));
    return audio;
  };
  window.Audio.prototype=OriginalAudio.prototype;
});
try{
  await page.goto('http://127.0.0.1:4173');
  await page.evaluate(()=>localStorage.setItem('ai-understood-v1',JSON.stringify({rate:'1.5',narrationSpeedUpdated:true,notes:{0:'Retain this note'}})));
  await page.reload();
  assert.equal(await page.locator('#rate').inputValue(),'1.3');
  assert.equal(await page.locator('#notes').inputValue(),'Retain this note');
  await page.evaluate(()=>{window.playClickAt=performance.now();});
  await page.getByRole('button',{name:'Play lesson',exact:true}).click();
  await page.waitForFunction(()=>window.audioTimings.filter(item=>item.event==='playing').length>=3,{},{timeout:60000});
  const result=await page.evaluate(()=>({clickAt:window.playClickAt,events:window.audioTimings}));
  const starts=result.events.filter(item=>item.event==='playing');
  const ends=result.events.filter(item=>item.event==='ended');
  const metrics={firstAudioMs:Math.round(starts[0].time-result.clickAt),transitionGapsMs:ends.map((end,i)=>Math.round(starts[i+1].time-end.time)),rate:starts[0].rate};
  assert.equal(metrics.rate,1.3);
  assert.ok(metrics.firstAudioMs<1500,'Prepared speech should start promptly');
  assert.ok(metrics.transitionGapsMs.every(gap=>gap<500),'Prepared segments should not wait for generation');
  await page.getByRole('button',{name:'Stop',exact:true}).click();
  await page.getByRole('button',{name:'Reading and audio settings',exact:true}).click();
  await page.locator('#rate').selectOption('1.25');await page.reload();
  assert.equal(await page.locator('#rate').inputValue(),'1.25');
  await writeFile('.service/playback-latency.json',JSON.stringify(metrics,null,2));
  console.log(JSON.stringify(metrics));
}finally{await browser.close();}
