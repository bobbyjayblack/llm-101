import {lessons} from './course.js';
import {speechParts} from './narration.js';

// Use the same text and segmentation as the player so every request is a cache hit.
export function courseAudioPlan(){
  const items=[];
  for(const [lesson,item] of lessons.entries())for(const paragraph of item.paragraphs)for(const text of speechParts(paragraph))items.push({lesson:lesson+1,text});
  for(const [lesson,item] of lessons.entries()){
    const extras=[item.question+' '+item.options.map((s,i)=>`Choice ${i+1}. ${s}`).join(' '),item.prompt,item.rubric,'Correct. '+item.explanation,'Revisit this idea. '+item.explanation];
    for(const extra of extras)for(const text of speechParts(extra))items.push({lesson:lesson+1,text});
  }
  for(const extra of ['Welcome. Let us take this one idea at a time. We can pause, try an experiment, and come back to anything that needs a little more explanation.','Choose an answer and select Check answer first.','Choose an answer first.'])for(const text of speechParts(extra))items.push({lesson:0,text});
  return items.filter((item,index)=>items.findIndex(other=>other.text===item.text)===index);
}
