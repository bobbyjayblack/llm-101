import {lessons,trainingResult,trainingStep} from './course.js';
import {LocalNarration,speechParts} from './narration.js';
const $=id=>document.getElementById(id);
const key='ai-understood-v1';
let state={lesson:0,passage:0,notes:{},reviewed:{},answers:{},size:'24',theme:'dark',rate:'1',voice:'',follow:false,engine:'local',localVoice:'claire'};
try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved==='object')state={...state,...saved};}catch{}
if(!Number.isInteger(state.lesson)||!lessons[state.lesson])state.lesson=0;
for(const k of ['notes','reviewed','answers'])if(!state[k]||typeof state[k]!=='object')state[k]={};
let current=Math.max(0,Math.min(Number(state.passage)||0,lessons[state.lesson].paragraphs.length-1));
let speaking=false,paused=false,generation=0,utterance=null,voices=[];
const synth=window.speechSynthesis;
const localNarration=new LocalNarration();
let preparation=null;
let localVoices=[{id:'claire',name:'Claire · gentle American'},{id:'grace',name:'Grace · warm American'},{id:'helen',name:'Helen · refined American'}];
if(!['local','browser'].includes(state.engine))state.engine='local';
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{$('progress').textContent='Browser storage is unavailable. Download your notes before closing.';}}
function playbackControls(){
  $('play').hidden=speaking;$('stop').hidden=!speaking;$('pause').disabled=!speaking;
  const label=paused?'Resume':'Pause';$('pause').setAttribute('aria-label',label);$('pause').title=label;$('pause').firstElementChild.textContent=paused?'▶':'⏸';
}
function status(text){$('audio-status').textContent=text;playbackControls();}
function halt(){generation++;synth?.cancel();localNarration.stop();preparation?.abort();preparation=null;$('prepare-lesson').textContent='Prepare lesson audio';speaking=false;paused=false;utterance=null;playbackControls();}
function highlight(){document.querySelectorAll('.passage').forEach((p,i)=>p.classList.toggle('active',i===current));state.passage=current;save();}
function read(index=current,single=false){
  if(state.engine==='local'){
    const paragraphs=lessons[state.lesson].paragraphs;const entries=[];
    for(let i=index;i<(single?index+1:paragraphs.length);i++)for(const text of speechParts(paragraphs[i]))entries.push({text,passage:i,label:`Reading passage ${i+1} of ${paragraphs.length}.`});
    readLocal(entries,single?'Passage replay finished.':'Lesson narration finished. Continue to the practice below.');return;
  }
  if(!synth){status('Narration is unavailable in this browser. Try opening this course in Edge or Chrome.');return;}
  halt();current=index;highlight();speaking=true;playbackControls();const token=generation;
  function passage(){
    if(token!==generation)return;
    highlight();
    if(state.follow)document.querySelectorAll('.passage')[current]?.scrollIntoView({block:'center',behavior:'instant'});
    utterance=new SpeechSynthesisUtterance(lessons[state.lesson].paragraphs[current]);
    utterance.rate=Number(state.rate);utterance.voice=voices.find(v=>v.voiceURI===state.voice)||null;
    utterance.onstart=()=>{if(token===generation)status(`Reading passage ${current+1} of ${lessons[state.lesson].paragraphs.length}.`);};
    utterance.onend=()=>{if(token!==generation)return;if(!single&&current+1<lessons[state.lesson].paragraphs.length){current++;passage();}else{speaking=false;status(single?'Passage replay finished.':'Lesson narration finished. Continue to the practice below.');}};
    utterance.onerror=e=>{if(token!==generation)return;speaking=false;status(`Narration could not continue (${e.error}). Try another voice or browser; your text and notes remain available.`);};
    synth.speak(utterance);
  }passage();
}
function render(focus=false){
  halt();const l=lessons[state.lesson];
  $('lessons').replaceChildren(...lessons.map((item,i)=>{
    const b=document.createElement('button');
    const label=`Lesson ${i+1}: ${item.title}${state.reviewed[i]?' · reviewed':''}`;
    b.setAttribute('aria-label',label);b.title=label;
    const number=document.createElement('span');number.className='lesson-number';number.textContent=i+1;number.setAttribute('aria-hidden','true');
    const title=document.createElement('span');title.className='lesson-label';title.textContent=`${item.title}${state.reviewed[i]?' · reviewed':''}`;title.setAttribute('aria-hidden','true');
    b.append(number,title);if(i===state.lesson)b.setAttribute('aria-current','step');
    b.onclick=()=>{state.lesson=i;current=0;render(true);};return b;
  }));
  $('lesson-meta').textContent=`LESSON ${state.lesson+1} OF ${lessons.length}`;$('title').textContent=l.title;$('objective').textContent=l.goal;
  $('current-lesson').textContent=`${state.lesson+1}. ${l.title}`;
  $('passages').replaceChildren(...l.paragraphs.map((text,i)=>{const div=document.createElement('div');div.className='passage';const p=document.createElement('p');p.textContent=text;const b=document.createElement('button');b.textContent=`Read from passage ${i+1}`;b.onclick=()=>read(i);div.append(p,b);return div;}));
  if(l.code){const pre=document.createElement('pre');pre.textContent=l.code;$('passages').append(pre);}
  $('experiment').hidden=!l.experiment;$('question').textContent=l.question;
  $('choices').innerHTML='<legend>Choose an answer</legend>';
  l.options.forEach((text,i)=>{const label=document.createElement('label');const input=document.createElement('input');input.type='radio';input.name='answer';input.value=i;input.checked=state.answers[state.lesson]===i;input.onchange=()=>{state.answers[state.lesson]=i;save();$('feedback').textContent='';};label.append(input,document.createTextNode(text));$('choices').append(label);});
  $('feedback').textContent='';$('explanation').textContent=l.explanation;$('prompt').textContent=l.prompt;$('rubric').textContent=l.rubric;$('notes').value=state.notes[state.lesson]||'';
  $('complete').textContent=state.reviewed[state.lesson]?'Reviewed · review again anytime':'Mark lesson reviewed';$('next').disabled=state.lesson===lessons.length-1;
  $('progress').textContent=`${Object.keys(state.reviewed).length} of ${lessons.length} lessons marked reviewed. Your place and notes save automatically on this browser.`;
  const stamps=Object.values(state.reviewed).map(Number).filter(Number.isFinite);
  $('review').textContent=stamps.length?`Next suggested recall session: ${new Date(Math.max(...stamps)+3*86400000).toLocaleDateString()}. Explain first, then consult your notes.`:'After reviewing a lesson, return in about three days for a recall session.';
  highlight();status(`Ready at passage ${current+1}. Highlighting follows the spoken passage.`);save();if(focus){$('lesson').focus({preventScroll:true});$('lesson').scrollIntoView({block:'start'});}
}
function readExtra(text){
  if(state.engine==='local'){readLocal(speechParts(text).map(part=>({text:part,label:'Reading practice material.'})),'Practice narration finished.');return;}
  if(!synth){status('Narration is unavailable in this browser.');return;}
  halt();const token=generation;speaking=true;playbackControls();utterance=new SpeechSynthesisUtterance(text);utterance.rate=Number(state.rate);utterance.voice=voices.find(v=>v.voiceURI===state.voice)||null;
  utterance.onstart=()=>{if(token===generation)status('Reading practice material.');};
  utterance.onend=()=>{if(token===generation){speaking=false;status('Practice narration finished.');}};
  utterance.onerror=()=>{if(token===generation){speaking=false;status('Unable to read practice material. Try another voice.');}};synth.speak(utterance);
}
function readLocal(entries,finished){
  halt();if(!entries.length)return;speaking=true;playbackControls();const token=generation;
  localNarration.play(entries,{
    voice:state.localVoice,rate:Number(state.rate),
    onEntry:entry=>{if(token!==generation)return;if(entry.passage!==undefined){current=entry.passage;highlight();if(state.follow)document.querySelectorAll('.passage')[current]?.scrollIntoView({block:'center',behavior:'instant'});}},
    onStatus:text=>{if(token===generation)status(paused?'Paused. Select Resume to continue.':text);},
    onEnd:()=>{if(token===generation){speaking=false;paused=false;status(finished);}},
    onError:message=>{if(token===generation){speaking=false;paused=false;status(message);}},
  });
}
$('read-question').onclick=()=>{const l=lessons[state.lesson];readExtra(l.question+' '+l.options.map((s,i)=>`Choice ${i+1}. ${s}`).join(' '));};
$('read-feedback').onclick=()=>readExtra($('feedback').textContent||'Choose an answer and select Check answer first.');
$('read-prompt').onclick=()=>readExtra(lessons[state.lesson].prompt);
$('read-criteria').onclick=()=>readExtra(lessons[state.lesson].rubric);
$('read-result').onclick=()=>readExtra($('result').textContent);
$('play').onclick=()=>read();$('replay').onclick=()=>read(current,true);$('stop').onclick=()=>{halt();status('Stopped. Read lesson resumes from this passage.');};
$('pause').onclick=async()=>{if(!speaking)return;paused=!paused;try{if(state.engine==='local')await localNarration.setPaused(paused);else if(paused)synth.pause();else synth.resume();status(paused?'Paused. Select Resume to continue.':'Narration resumed.');}catch{halt();status('Playback could not resume. Select Play to try again.');}};
$('restart').onclick=()=>read(0);
$('open-settings').onclick=()=>$('settings-dialog').showModal();
$('close-settings').onclick=()=>$('settings-dialog').close();
$('notes').oninput=()=>{state.notes[state.lesson]=$('notes').value;save();};
$('check').onclick=()=>{const answer=state.answers[state.lesson];$('feedback').textContent=answer===undefined?'Choose an answer first.':answer===lessons[state.lesson].correct?'Correct. '+lessons[state.lesson].explanation:'Revisit this idea. '+lessons[state.lesson].explanation;};
$('complete').onclick=()=>{state.reviewed[state.lesson]=Date.now();render();};
$('next').onclick=()=>{if(state.lesson<lessons.length-1){state.lesson++;current=0;render(true);}};
function sidebar(){
  const compact=Boolean(state.sidebarCompact);
  document.querySelector('.course-layout').classList.toggle('sidebar-compact',compact);
  $('sidebar-details').hidden=false;
  $('toggle-sidebar').setAttribute('aria-expanded',String(!compact));
  const label=compact?'Expand sidebar':'Collapse sidebar';
  $('toggle-sidebar').setAttribute('aria-label',label);$('toggle-sidebar').title=label;
  $('toggle-sidebar').replaceChildren();
  const icon=document.createElement('span');icon.textContent=compact?'»':'«';icon.setAttribute('aria-hidden','true');
  const text=document.createElement('span');text.className='toggle-label';text.textContent=' Collapse';text.setAttribute('aria-hidden','true');
  $('toggle-sidebar').append(icon,text);
}
$('toggle-sidebar').onclick=()=>{state.sidebarCompact=!state.sidebarCompact;sidebar();save();};
function appearance(){document.documentElement.style.fontSize=state.size+'px';document.body.classList.toggle('light',state.theme==='light');}
for(const name of ['size','theme','rate']){$(name).value=state[name];$(name).onchange=()=>{state[name]=$(name).value;appearance();save();if(name==='rate'){if(state.engine==='local')localNarration.setRate(Number(state.rate));else if(speaking)read();}};}
$('follow').checked=state.follow;$('follow').onchange=()=>{state.follow=$('follow').checked;save();};
function loadVoices(){
  voices=synth?.getVoices()||[];$('voice').replaceChildren();
  const options=state.engine==='local'?localVoices.map(v=>({value:v.id,label:v.name})):[{value:'',label:'Browser default voice'},...voices.map(v=>({value:v.voiceURI,label:`${v.name} · ${v.lang}${v.localService?' · local':''}`}))];
  for(const item of options){const option=document.createElement('option');option.value=item.value;option.textContent=item.label;$('voice').append(option);}
  $('voice').value=state.engine==='local'?state.localVoice:state.voice;
  if($('voice').selectedIndex<0){$('voice').selectedIndex=0;if(state.engine==='local')state.localVoice=$('voice').value;}
  $('voice-note').textContent=state.engine==='local'?'Original AI-designed voices generated on this computer. First readings take time to prepare; replays use saved audio. No text is sent to a cloud speech service.':'Browser and operating-system voices may use online services. No microphone or camera is enabled.';
}
$('engine').value=state.engine;
$('engine').onchange=()=>{halt();state.engine=$('engine').value;loadVoices();save();status('Narrator changed. Select Play to listen.');};
$('voice').onchange=()=>{halt();if(state.engine==='local')state.localVoice=$('voice').value;else state.voice=$('voice').value;save();status('Voice changed. Select Preview voice or Play.');};
$('preview-voice').onclick=()=>readExtra('Welcome. Let us take this one idea at a time. We can pause, try an experiment, and come back to anything that needs a little more explanation.');
if(synth)synth.onvoiceschanged=loadVoices;
async function audioHealth(){
  try{const response=await fetch('/api/audio/status');const health=await response.json();
    if(health.voices?.length){localVoices=health.voices;loadVoices();}
    $('local-audio-status').textContent=health.status==='ready'?'Local narrator is ready.':health.status==='loading'?'Local narrator is warming up.':'Local narrator is unavailable. Run start.bat, or select Browser voices.';
    if(health.status==='loading')setTimeout(audioHealth,3000);
  }catch{$('local-audio-status').textContent='Local narrator is unavailable. Run start.bat, or select Browser voices.';}
}
$('refresh-audio').onclick=audioHealth;
$('prepare-lesson').onclick=async()=>{
  if(preparation){halt();status('Audio preparation stopped. Completed segments remain saved.');return;}
  if(state.engine!=='local'){status('Select Local AI narrator in settings to prepare lesson audio.');return;}
  halt();const controller=new AbortController();preparation=controller;
  const texts=lessons[state.lesson].paragraphs.flatMap(text=>speechParts(text));
  $('prepare-lesson').textContent='Cancel audio preparation';
  try{
    for(let i=0;i<texts.length;i++){
      status(`Preparing lesson audio: ${i+1} of ${texts.length} segments. You can keep reading or cancel.`);
      await localNarration.fetchAudio(texts[i],state.localVoice,controller.signal);
      controller.signal.throwIfAborted();
    }
    status('Lesson audio is saved and ready. Select Play to listen.');
  }catch(error){if(preparation===controller&&error.name!=='AbortError')status(error.message);}
  finally{if(preparation===controller){preparation=null;$('prepare-lesson').textContent='Prepare lesson audio';}}
};
let weight=1;
function showResult(){const r=trainingResult(weight);$('result').textContent=`Weight: ${weight.toFixed(3)}. Input: 2. Prediction: ${r.prediction.toFixed(3)}. Target: 6. Loss: ${r.loss.toFixed(3)}.`;}
$('weight').oninput=()=>{weight=Number($('weight').value);showResult();};$('train').onclick=()=>{weight=trainingStep(weight);$('weight').step='any';$('weight').value=weight;showResult();};$('reset-experiment').onclick=()=>{weight=1;$('weight').value=weight;showResult();};
$('export').onclick=()=>{const text=['AI, understood — notes and progress',...lessons.map((l,i)=>`\n${i+1}. ${l.title}\nReviewed: ${state.reviewed[i]?new Date(state.reviewed[i]).toLocaleString():'Not yet'}\n${state.notes[i]||'No notes yet.'}`)].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='ai-understood-notes.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
window.addEventListener('pagehide',halt);appearance();sidebar();loadVoices();showResult();render();audioHealth();
