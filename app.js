import {lessons,units,trainingResult,trainingStep} from './course.js';
import {LocalNarration,speechParts} from './narration.js';
import {labs,runLab,labNarration} from './labs.js';
import {lessonAudioTexts} from './audio-plan.js';
const $=id=>document.getElementById(id);
const key='ai-understood-v1';
let state={lesson:0,passage:0,notes:{},reviewed:{},answers:{},size:'24',theme:'dark',rate:'1.3',voice:'',follow:false,engine:'local',localVoice:'claire'};
try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved==='object')state={...state,...saved};}catch{}
// Apply the requested faster pace once; later manual speed choices still persist.
if(state.narrationSpeedVersion!==2){state.rate='1.3';state.narrationSpeedVersion=2;}
if(!Number.isInteger(state.lesson)||!lessons[state.lesson])state.lesson=0;
function linkedLesson(){
  const value=new URL(location.href).searchParams.get('lesson');
  return value&&/^[1-9]\d*$/.test(value)&&lessons[Number(value)-1]?Number(value)-1:null;
}
function lessonURL(index){const url=new URL(location.href);url.searchParams.set('lesson',index+1);url.hash='';return url.pathname+url.search;}
const initialLesson=linkedLesson();
if(initialLesson!==null&&initialLesson!==state.lesson){state.lesson=initialLesson;state.passage=0;}
history.replaceState(null,'',lessonURL(state.lesson));
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
function clearWord(){globalThis.CSS?.highlights?.delete('spoken-word');}
function underline(element,start,end){
  clearWord();if(!element||!globalThis.CSS?.highlights||!globalThis.Highlight)return;
  const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);const range=new Range();let node,offset=0,started=false;
  while((node=walker.nextNode())){
    const next=offset+node.length;
    if(!started&&start<next){range.setStart(node,Math.max(0,start-offset));started=true;}
    if(started&&end<=next){range.setEnd(node,end-offset);CSS.highlights.set('spoken-word',new Highlight(range));return;}
    offset=next;
  }
}
function showWord(entry,index){
  clearWord();if(index===null)return;
  const word=[...entry.text.matchAll(/\S+/gu)][index];if(!word)return;
  const start=entry.offset+word.index,end=start+word[0].length;
  const target=entry.targets.find(item=>start>=item.start&&end<=item.start+item.element.textContent.length);
  if(target)underline(target.element,start-target.start,end-target.start);
}
function readingEntries(text,elements,label,passage){
  let cursor=0;const targets=elements.filter(Boolean).map(element=>{
    const start=text.indexOf(element.textContent,cursor);if(start>=0)cursor=start+element.textContent.length;
    return {element,start};
  }).filter(item=>item.start>=0);
  cursor=0;
  return speechParts(text).map(part=>{const offset=text.indexOf(part,cursor);cursor=offset+part.length;return {text:part,offset,targets,label,passage};});
}
function browserBoundary(text,targets,event){
  if(event.name!=='word')return;
  const index=[...text.matchAll(/\S+/gu)].findIndex(word=>event.charIndex>=word.index&&event.charIndex<word.index+word[0].length);
  if(index>=0)showWord({text,targets,offset:0},index);
}
function halt(){generation++;synth?.cancel();localNarration.stop();clearWord();preparation?.abort();preparation=null;$('prepare-lesson').textContent='Prepare lesson audio';speaking=false;paused=false;utterance=null;playbackControls();}
function highlight(){document.querySelectorAll('.passage').forEach((p,i)=>p.classList.toggle('active',i===current));state.passage=current;save();}
function read(index=current,single=false){
  if(state.engine==='local'){
    const paragraphs=lessons[state.lesson].paragraphs;const entries=[];
    for(let i=index;i<(single?index+1:paragraphs.length);i++)entries.push(...readingEntries(paragraphs[i],[document.querySelectorAll('.passage p')[i]],`Reading passage ${i+1} of ${paragraphs.length}.`,i));
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
    utterance.onboundary=event=>{if(token===generation)browserBoundary(utterance.text,[{element:document.querySelectorAll('.passage p')[current],start:0}],event);};
    utterance.onstart=()=>{if(token===generation)status(`Reading passage ${current+1} of ${lessons[state.lesson].paragraphs.length}.`);};
    utterance.onend=()=>{if(token!==generation)return;clearWord();if(!single&&current+1<lessons[state.lesson].paragraphs.length){current++;passage();}else{speaking=false;status(single?'Passage replay finished.':'Lesson narration finished. Continue to the practice below.');}};
    utterance.onerror=e=>{if(token!==generation)return;clearWord();speaking=false;status(`Narration could not continue (${e.error}). Try another voice or browser; your text and notes remain available.`);};
    synth.speak(utterance);
  }passage();
}
function renderNavigation(){
  $('course-units').replaceChildren(...units.map(unit=>{
    const group=document.createElement('div');group.className='course-unit';
    const toggle=document.createElement('button');toggle.className='unit-toggle';toggle.id=`unit-${unit.id}`;
    toggle.setAttribute('aria-label',`Unit ${unit.id}: ${unit.title}`);toggle.title=`Unit ${unit.id}: ${unit.title}`;
    toggle.setAttribute('aria-controls',`unit-lessons-${unit.id}`);
    const number=document.createElement('span');number.className='unit-number';number.textContent=`U${unit.id}`;number.setAttribute('aria-hidden','true');
    const title=document.createElement('span');title.className='unit-label';title.textContent=unit.title;title.setAttribute('aria-hidden','true');
    const arrow=document.createElement('span');arrow.className='unit-arrow';arrow.setAttribute('aria-hidden','true');
    const list=document.createElement('div');list.id=`unit-lessons-${unit.id}`;list.className='lesson-nav';
    const expand=open=>{list.hidden=!open;toggle.setAttribute('aria-expanded',String(open));arrow.textContent=open?'▾':'▸';};
    expand(unit.id===lessons[state.lesson].unit);
    toggle.append(number,title,arrow);
    toggle.onclick=()=>{
      const open=list.hidden;
      for(const button of document.querySelectorAll('.unit-toggle')){button.setAttribute('aria-expanded','false');button.querySelector('.unit-arrow').textContent='▸';$(button.getAttribute('aria-controls')).hidden=true;}
      expand(open);
      if(open)$('lesson').scrollIntoView({block:'start',behavior:'instant'});
    };
    list.replaceChildren(...lessons.map((item,i)=>({item,i})).filter(({item})=>item.unit===unit.id).map(({item,i})=>{
    const b=document.createElement('a');b.href=lessonURL(i);
    const label=`Lesson ${i+1}: ${item.title}${state.reviewed[i]?' · reviewed':''}`;
    b.setAttribute('aria-label',label);b.title=label;
    const number=document.createElement('span');number.className='lesson-number';number.textContent=i+1;number.setAttribute('aria-hidden','true');
    const title=document.createElement('span');title.className='lesson-label';title.textContent=`${item.title}${state.reviewed[i]?' · reviewed':''}`;title.setAttribute('aria-hidden','true');
    b.append(number,title);if(i===state.lesson)b.setAttribute('aria-current','step');
    b.onclick=event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();navigateLesson(i);};return b;
    }));
    group.append(toggle,list);return group;
  }));
}
function render(focus=false){
  halt();const l=lessons[state.lesson];
  document.title=`Lesson ${state.lesson+1}: ${l.title} · LLM 101`;
  renderNavigation();
  $('lesson-meta').textContent=`UNIT ${l.unit} OF ${units.length} · ${units[l.unit-1].title} · LESSON ${state.lesson+1} OF ${lessons.length}`;$('title').textContent=l.title;$('objective').textContent=l.goal;
  $('lesson-number-label').textContent=`${state.lesson+1}. `;
  $('passages').replaceChildren(...l.paragraphs.map((text,i)=>{const div=document.createElement('div');div.className='passage';const p=document.createElement('p');p.textContent=text;const b=document.createElement('button');b.textContent=`Read from passage ${i+1}`;b.onclick=()=>read(i);div.append(p);
    for(const equation of l.equations||[]){if(equation.after!==i)continue;
      const figure=document.createElement('figure');figure.className='equation';
      const caption=document.createElement('figcaption');caption.textContent=equation.title;
      const formula=document.createElement('pre');formula.className='equation-expression';formula.textContent=equation.expression;
      const explanation=document.createElement('div');explanation.className='equation-explanation';explanation.textContent=equation.spoken;
      const listen=document.createElement('button');listen.textContent='Read equation';listen.setAttribute('aria-label',`Read equation: ${equation.title}`);
      listen.onclick=()=>readExtra(equation.title+'. '+equation.spoken,[caption,explanation]);
      figure.append(caption,formula,explanation,listen);div.append(figure);
    }
    div.append(b);return div;}));
  if(l.code){const pre=document.createElement('pre');pre.textContent=l.code;$('passages').append(pre);}
  $('experiment').hidden=!l.experiment;$('question').textContent=l.question;
  $('choices').innerHTML='<legend>Choose an answer</legend>';
  l.options.forEach((text,i)=>{const label=document.createElement('label');const input=document.createElement('input');input.type='radio';input.name='answer';input.value=i;input.checked=state.answers[state.lesson]===i;input.onchange=()=>{state.answers[state.lesson]=i;save();$('feedback').textContent='';};label.append(input,document.createTextNode(text));$('choices').append(label);});
  $('feedback').textContent='';$('explanation').textContent=l.explanation;$('prompt').textContent=l.prompt;$('rubric').textContent=l.rubric;$('notes').value=state.notes[state.lesson]||'';
  const lab=labs.find(item=>item.unit===l.unit);
  $('lab-title').textContent=lab.title;$('lab-task').textContent=lab.task;
  $('lab-scenario').replaceChildren(...lab.scenarios.map((label,i)=>{const option=document.createElement('option');option.value=i;option.textContent=label;return option;}));
  $('lab-query-label').hidden=!lab.query;$('lab-query').value='Where do notes save?';
  $('lab-result').textContent='Choose a scenario, predict the result, then select Run lab.';$('read-lab-result').disabled=true;
  $('lab-expected').textContent=lab.expected;$('lab-troubleshooting').textContent=lab.troubleshooting;$('lab-solution').open=false;
  $('lab-command').textContent=`node labs.mjs ${l.unit} 0`;
  $('lesson-recall').textContent=l.recall||'In three days, explain this lesson without notes, then compare with the self-check criteria. Repeat after one week with a new example.';
  $('unit-reference').href=units[l.unit-1].reference;
  $('previous').disabled=state.lesson===0;
  $('complete').textContent=state.reviewed[state.lesson]?'Reviewed · review again anytime':'Mark lesson reviewed';$('next').disabled=state.lesson===lessons.length-1;
  $('progress').textContent=`${Object.keys(state.reviewed).length} of ${lessons.length} lessons marked reviewed. Your place and notes save automatically on this browser.`;
  const stamps=Object.values(state.reviewed).map(Number).filter(Number.isFinite);
  $('review').textContent=stamps.length?`Next suggested recall session: ${new Date(Math.max(...stamps)+3*86400000).toLocaleDateString()}. Explain first, then consult your notes.`:'After reviewing a lesson, return in about three days for a recall session.';
  highlight();status(`Ready at passage ${current+1}. Underlining follows the spoken words.`);save();if(focus){$('lesson').focus({preventScroll:true});$('lesson').scrollIntoView({block:'start'});}
}
function readExtra(text,elements=[]){
  const entries=readingEntries(text,elements,'Reading practice material.');
  if(state.engine==='local'){readLocal(entries,'Practice narration finished.');return;}
  if(!synth){status('Narration is unavailable in this browser.');return;}
  halt();const token=generation;speaking=true;playbackControls();utterance=new SpeechSynthesisUtterance(text);utterance.rate=Number(state.rate);utterance.voice=voices.find(v=>v.voiceURI===state.voice)||null;
  utterance.onstart=()=>{if(token===generation)status('Reading practice material.');};
  utterance.onboundary=event=>{if(token===generation)browserBoundary(text,entries[0]?.targets||[],event);};
  utterance.onend=()=>{if(token===generation){clearWord();speaking=false;status('Practice narration finished.');}};
  utterance.onerror=()=>{if(token===generation){clearWord();speaking=false;status('Unable to read practice material. Try another voice.');}};synth.speak(utterance);
}
function readLocal(entries,finished){
  halt();if(!entries.length)return;speaking=true;playbackControls();const token=generation;
  localNarration.play(entries,{
    voice:state.localVoice,rate:Number(state.rate),
    onEntry:entry=>{if(token!==generation)return;if(entry.passage!==undefined){current=entry.passage;highlight();if(state.follow)document.querySelectorAll('.passage')[current]?.scrollIntoView({block:'center',behavior:'instant'});}},
    onWord:(entry,index)=>{if(token===generation)showWord(entry,index);},
    onStatus:text=>{if(token===generation)status(paused?'Paused. Select Resume to continue.':text);},
    onEnd:()=>{if(token===generation){speaking=false;paused=false;status(finished);}},
    onError:message=>{if(token===generation){speaking=false;paused=false;status(message);}},
  });
}
$('read-question').onclick=()=>{const l=lessons[state.lesson];readExtra(l.question+' '+l.options.map((s,i)=>`Choice ${i+1}. ${s}`).join(' '),[$('question'),...document.querySelectorAll('#choices label')]);};
$('read-feedback').onclick=()=>readExtra($('feedback').textContent||'Choose an answer and select Check answer first.',[$('feedback')]);
$('read-prompt').onclick=()=>readExtra(lessons[state.lesson].prompt,[$('prompt')]);
$('read-criteria').onclick=()=>{$('rubric').closest('details').open=true;readExtra(lessons[state.lesson].rubric,[$('rubric')]);};
$('read-result').onclick=()=>readExtra($('result').textContent,[$('result')]);
$('run-lab').onclick=()=>{
  halt();try{const result=runLab(lessons[state.lesson].unit,Number($('lab-scenario').value),$('lab-query').value);$('lab-result').textContent=labNarration(result);$('read-lab-result').disabled=false;status('Lab finished. Compare your prediction with the result and explanation.');}
  catch(error){$('lab-result').textContent=error.message;$('read-lab-result').disabled=true;}
};
$('read-lab-task').onclick=()=>readExtra($('lab-task').textContent,[$('lab-task')]);
$('read-lab-result').onclick=()=>readExtra($('lab-result').textContent,[$('lab-result')]);
$('read-lab-solution').onclick=()=>{$('lab-solution').open=true;readExtra($('lab-expected').textContent+' '+$('lab-troubleshooting').textContent,[$('lab-expected'),$('lab-troubleshooting')]);};
$('read-recall').onclick=()=>readExtra($('lesson-recall').textContent,[$('lesson-recall')]);
$('play').onclick=()=>read();$('replay').onclick=()=>read(current,true);$('stop').onclick=()=>{halt();status('Stopped. Read lesson resumes from this passage.');};
$('pause').onclick=async()=>{if(!speaking)return;paused=!paused;try{if(state.engine==='local')await localNarration.setPaused(paused);else if(paused)synth.pause();else synth.resume();status(paused?'Paused. Select Resume to continue.':'Narration resumed.');}catch{halt();status('Playback could not resume. Select Play to try again.');}};
$('restart').onclick=()=>read(0);
$('open-settings').onclick=()=>$('settings-dialog').showModal();
$('open-preparation').onclick=()=>{$('settings-dialog').showModal();$('prepare-lesson').focus();$('audio-preparation').scrollIntoView({block:'start'});};
$('close-settings').onclick=()=>$('settings-dialog').close();
$('notes').oninput=()=>{state.notes[state.lesson]=$('notes').value;save();};
$('check').onclick=()=>{const answer=state.answers[state.lesson];$('feedback').textContent=answer===undefined?'Choose an answer first.':answer===lessons[state.lesson].correct?'Correct. '+lessons[state.lesson].explanation:'Revisit this idea. '+lessons[state.lesson].explanation;};
$('complete').onclick=()=>{state.reviewed[state.lesson]=Date.now();render();};
function navigateLesson(index){
  if(index!==state.lesson)history.pushState(null,'',lessonURL(index));
  state.lesson=index;current=0;render(true);
}
$('next').onclick=()=>{if(state.lesson<lessons.length-1)navigateLesson(state.lesson+1);};
$('previous').onclick=()=>{if(state.lesson>0)navigateLesson(state.lesson-1);};
window.addEventListener('popstate',()=>{
  const index=linkedLesson();if(index===null)return;
  if(index!==state.lesson){state.lesson=index;current=0;render(true);}
});
function sidebar(){
  const compact=Boolean(state.sidebarCompact);
  document.querySelector('.course-layout').classList.toggle('sidebar-compact',compact);
  $('sidebar-details').hidden=false;
  $('toggle-sidebar').setAttribute('aria-expanded',String(!compact));
  const label=compact?'Expand sidebar':'Collapse sidebar';
  $('toggle-sidebar').setAttribute('aria-label',label);$('toggle-sidebar').title=label;
  $('toggle-sidebar').replaceChildren();
  const icon=document.createElement('span');icon.textContent=compact?'»':'«';icon.setAttribute('aria-hidden','true');
  $('toggle-sidebar').append(icon);
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
  $('voice-note').textContent=state.engine==='local'?'Original AI-designed voices generated on this computer. Saved course audio plays immediately; new text or other voices may need preparation. No text is sent to a cloud speech service.':'Browser and operating-system voices may use online services. No microphone or camera is enabled.';
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
async function preparationHealth(){
  try{
    const response=await fetch('/api/audio/preparation');const prepared=await response.json();
    $('prepared-audio-status').textContent=prepared.state==='ready'?'Claire’s course narration is saved for quick playback.':prepared.state==='rendering'?`Saving Claire’s course audio: ${prepared.completed} of ${prepared.total} segments ready.`:prepared.state==='error'?'Course audio preparation paused. Run start.bat to retry; saved passages remain available.':'';
    if(prepared.state!=='ready')setTimeout(preparationHealth,10000);
  }catch{setTimeout(preparationHealth,10000);}
}
$('prepare-lesson').onclick=async()=>{
  if(preparation){halt();status('Audio preparation stopped. Completed segments remain saved.');return;}
  if(state.engine!=='local'){status('Select Local AI narrator in settings to prepare lesson audio.');return;}
  halt();const controller=new AbortController();preparation=controller;
  const texts=[...new Set(lessonAudioTexts(lessons[state.lesson]).flatMap(text=>speechParts(text)))];
  $('prepare-lesson').textContent='Cancel audio preparation';
  try{
    for(let i=0;i<texts.length;i++){
      status(`Preparing lesson audio: ${i+1} of ${texts.length} segments. You can keep reading or cancel.`);
      await localNarration.fetchAudio(texts[i],state.localVoice,controller.signal);
      await localNarration.fetchTimings(texts[i],state.localVoice,controller.signal);
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
window.addEventListener('pagehide',halt);appearance();sidebar();loadVoices();showResult();render();audioHealth();preparationHealth();
