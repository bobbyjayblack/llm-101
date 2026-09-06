import {lessons} from './course.js';
import {speechParts} from './narration.js';
import {labs,runLab,labNarration} from './labs.js';

export function lessonAudioTexts(item){
  const lab=labs.find(lab=>lab.unit===item.unit);
  return [...item.paragraphs,item.question+' '+item.options.map((s,i)=>`Choice ${i+1}. ${s}`).join(' '),item.prompt,item.rubric,
    'Correct. '+item.explanation,'Revisit this idea. '+item.explanation,
    item.recall||'In three days, explain this lesson without notes, then compare with the self-check criteria. Repeat after one week with a new example.',
    lab.task,lab.expected+' '+lab.troubleshooting,...lab.scenarios.map((_,i)=>labNarration(runLab(item.unit,i)))];
}

// Use the same text and segmentation as the player so every request is a cache hit.
export function courseAudioPlan(){
  const items=[];
  for(const [lesson,item] of lessons.entries())for(const paragraph of item.paragraphs)for(const text of speechParts(paragraph))items.push({lesson:lesson+1,text});
  for(const [lesson,item] of lessons.entries()){
    const extras=lessonAudioTexts(item).slice(item.paragraphs.length);
    for(const extra of extras)for(const text of speechParts(extra))items.push({lesson:lesson+1,text});
  }
  for(const extra of ['Welcome. Let us take this one idea at a time. We can pause, try an experiment, and come back to anything that needs a little more explanation.','Choose an answer and select Check answer first.','Choose an answer first.'])for(const text of speechParts(extra))items.push({lesson:0,text});
  const seen=new Set();return items.filter(item=>{if(seen.has(item.text))return false;seen.add(item.text);return true;});
}
