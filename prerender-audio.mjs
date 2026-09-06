import {courseAudioPlan} from './audio-plan.js';
import {mkdir,writeFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';

const root=dirname(fileURLToPath(import.meta.url));
const appId=createHash('sha256').update(root.toLowerCase()).digest('hex').slice(0,16);
const plan=courseAudioPlan();
const voice=process.argv[2]||'claire';
if(!['claire','grace','helen'].includes(voice))throw new Error('Unknown narrator');
const status={voice,state:'rendering',completed:0,total:plan.length};
const target=new URL(`.service/prerender-${voice}.json`,import.meta.url);
async function save(){
  await mkdir(new URL('.service/',import.meta.url),{recursive:true});
  const temporary=new URL(target.href+'.tmp');
  await writeFile(temporary,JSON.stringify({...status,updatedAt:new Date().toISOString()}));
  await rename(temporary,target);
}
try{
  const response=await fetch('http://127.0.0.1:4174/health',{signal:AbortSignal.timeout(5000)});
  const health=await response.json();
  if(health.service!=='llm101-audio'||health.appId!==appId||health.status!=='ready')throw new Error('Start this project’s audio service before pre-rendering.');
  await save();
  for(let index=0;index<plan.length;index+=4){
    const texts=plan.slice(index,index+4).map(item=>item.text);
    let result;
    for(let attempt=0;attempt<120;attempt++){
      result=await fetch('http://127.0.0.1:4174/prerender',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({voice,texts}),signal:AbortSignal.timeout(300000)});
      if(result.status!==429)break;
      await delay(1000);
    }
    if(!result.ok)throw new Error((await result.json()).error||'Pre-rendering failed.');
    const batch=await result.json();
    status.completed=index+texts.length;
    await save();
    console.log(`${voice}: ${status.completed}/${status.total} segments saved (${batch.generated} generated).`);
    await delay(250);
  }
  status.state='ready';await save();console.log('Course narration is ready for immediate playback.');
}catch(error){status.state='error';status.error=error.message;await save();console.error(error);process.exitCode=1;}
