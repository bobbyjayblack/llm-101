import test from 'node:test';
import assert from 'node:assert/strict';
import {speechParts,LocalNarration} from './narration.js';
import {lessons} from './course.js';
import {courseAudioPlan} from './audio-plan.js';

test('pre-render plan covers every lesson segment with identical player text',()=>{
  const plan=courseAudioPlan();const texts=new Set(plan.map(item=>item.text));
  for(const lesson of lessons)for(const paragraph of lesson.paragraphs)for(const part of speechParts(paragraph))assert.ok(texts.has(part));
  assert.equal(texts.size,plan.length);
  assert.ok(plan.every(item=>item.text.length<=260));
});

test('speech chunking preserves course text, decimals, and request limits',()=>{
  for(const text of [...lessons.flatMap(l=>l.paragraphs),'Weight 1.800. Prediction 3.600. Loss 2.880.']){
    const parts=speechParts(text);
    assert.equal(parts.join(' '),text.replace(/\s+/g,' ').trim());
    assert.ok(parts.every(part=>part.length<=260));
  }
  assert.deepEqual(speechParts(''),[]);
  assert.ok(speechParts('a'.repeat(1500)).every(part=>part.length<=260));
});

class FakeAudio {
  constructor(){this.attrs={};this.plays=0;this.paused=true;}
  set src(value){this.attrs.src=value;}
  getAttribute(name){return this.attrs[name];}
  removeAttribute(name){delete this.attrs[name];}
  load(){}
  pause(){this.paused=true;}
  async play(){this.plays++;this.paused=false;}
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
function callbacks(extra={}){return {voice:'claire',rate:1,onEntry(){},onStatus(){},onEnd(){},onError:message=>assert.fail(message),...extra};}

test('stopping while audio is generated prevents stale playback',async t=>{
  t.mock.method(globalThis,'fetch',()=>pending.promise);
  const pending=deferred(),player=new LocalNarration(new FakeAudio());
  let ended=false;
  const run=player.play([{text:'Hello',label:'Reading'}],callbacks({onEnd:()=>{ended=true;}}));
  player.stop();pending.resolve(new Response(new Blob(['wave'])));await run;
  assert.equal(player.audio.plays,0);assert.equal(ended,false);
});

test('pause during preparation, rate changes, and end progression',async t=>{
  const first=deferred(),second=deferred(),firstReady=deferred(),secondReady=deferred();let calls=0;
  t.mock.method(globalThis,'fetch',()=>++calls===1?first.promise:second.promise);
  const player=new LocalNarration(new FakeAudio());let ended=false;
  const run=player.play([{text:'First',label:'First'},{text:'Second',label:'Second'}],callbacks({onEntry:entry=>(entry.text==='First'?firstReady:secondReady).resolve(),onEnd:()=>{ended=true;}}));
  await player.setPaused(true);first.resolve(new Response(new Blob(['wave'])));await firstReady.promise;
  assert.equal(player.audio.plays,0);
  player.setRate(1.25);await player.setPaused(false);
  assert.equal(player.audio.playbackRate,1.25);assert.equal(player.audio.plays,1);
  player.audio.onended();await tick();
  await player.setPaused(true);await player.setPaused(false);
  assert.equal(player.audio.plays,1,'resuming during look-ahead must not replay the previous segment');
  second.resolve(new Response(new Blob(['wave'])));await secondReady.promise;
  assert.equal(player.audio.plays,2);player.audio.onended();await run;
  assert.equal(ended,true);
});

test('word tracking follows audio time across pause, speed changes, silence, and stop',async t=>{
  let frame;
  globalThis.requestAnimationFrame=callback=>{frame=callback;return 1;};
  globalThis.cancelAnimationFrame=()=>{frame=null;};
  t.after(()=>{delete globalThis.requestAnimationFrame;delete globalThis.cancelAnimationFrame;});
  const player=new LocalNarration(new FakeAudio()),seen=[];
  player.audio.currentTime=0;
  player.trackWords([{index:0,start:.2,end:.5},{index:1,start:.6,end:1.2}],word=>seen.push(word));
  frame();assert.equal(seen.at(-1),null);
  player.audio.currentTime=.3;frame();assert.equal(seen.at(-1),0);
  await player.setPaused(true);const count=seen.length;frame();assert.equal(seen.length,count);
  player.setRate(1.5);frame();assert.equal(seen.length,count,'rate changes do not advance the audio clock');
  player.audio.currentTime=.55;frame();assert.equal(seen.at(-1),null);
  player.audio.currentTime=.9;player.audio.ontimeupdate();assert.equal(seen.at(-1),1);
  player.stop();assert.equal(seen.at(-1),null);assert.equal(frame,null);assert.equal(player.audio.ontimeupdate,null);
});

test('slow word timings never delay playback or highlight a stopped passage',async t=>{
  const timings=deferred(),ready=deferred();let words=0;
  const player=new LocalNarration(new FakeAudio());
  t.mock.method(player,'fetchAudio',async()=>new Blob(['wave']));
  t.mock.method(player,'fetchTimings',()=>timings.promise);
  const run=player.play([{text:'Saved audio',label:'Reading'}],callbacks({onEntry:()=>ready.resolve(),onWord:()=>words++}));
  await ready.promise;assert.equal(player.audio.plays,1,'play starts before timings arrive');
  player.stop();timings.resolve([{index:0,start:0,end:1}]);await run;await tick();
  assert.equal(words,0,'late timings cannot revive highlighting');
});
