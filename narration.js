// Bound GPU work and prepare the next audio segment during playback.
export function speechParts(text,limit=260){
  const parts=[];let part='';
  for(const sentence of text.trim().split(/(?<=[.!?])\s+/u)){
    for(const word of sentence.split(/\s+/u)){
      if(part&&part.length+word.length+1>limit){parts.push(part);part='';}
      if(word.length>limit){
        if(part){parts.push(part);part='';}
        for(let i=0;i<word.length;i+=limit)parts.push(word.slice(i,i+limit));
      }else part+=(part?' ':'')+word;
    }
    if(part.length>=limit/2){parts.push(part);part='';}
  }
  if(part)parts.push(part);return parts;
}

export class LocalNarration {
  constructor(audio=new Audio()){this.audio=audio;this.generation=0;this.rate=1;this.paused=false;}
  stop(){
    this.generation++;this.controller?.abort();this.finish?.();this.finish=null;
    this.audio.pause();this.audio.removeAttribute('src');this.audio.load();
    this.audio.onended=null;this.audio.onerror=null;
    if(this.objectUrl)URL.revokeObjectURL(this.objectUrl);
    this.objectUrl=null;this.paused=false;
  }
  setRate(rate){this.rate=rate;this.audio.playbackRate=rate;this.audio.preservesPitch=true;}
  async setPaused(paused){this.paused=paused;if(paused)this.audio.pause();else if(this.audio.getAttribute('src'))await this.audio.play();}
  async fetchAudio(text,voice,signal){
    for(let attempt=0;attempt<90;attempt++){
      signal.throwIfAborted();
      const response=await fetch('/api/audio/speech',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,voice}),signal});
      if(response.status===429){
        await new Promise((resolve,reject)=>{
          const abort=()=>{clearTimeout(timer);reject(new DOMException('Stopped','AbortError'));};
          const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},1000);
          signal.addEventListener('abort',abort,{once:true});
        });continue;
      }
      if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.error||'Local narration is unavailable. Run start.bat or choose a browser voice.');}
      return response.blob();
    }
    throw new Error('The narrator is still busy. Please stop and try again.');
  }
  async play(entries,{voice,rate,onEntry,onStatus,onEnd,onError}){
    this.stop();this.setRate(rate);const generation=this.generation;
    this.controller=new AbortController();const signal=this.controller.signal;
    const active=()=>generation===this.generation;
    // Handle look-ahead rejection immediately, including when playback is stopped.
    const request=entry=>this.fetchAudio(entry.text,voice,signal).then(blob=>({blob}),error=>({error}));
    let pending=request(entries[0]);
    try{
      for(let index=0;index<entries.length;index++){
        if(!active())return;
        onStatus('Preparing local narration. The first reading may take a moment.');
        const result=await pending;
        if(!active())return;if(result.error)throw result.error;
        if(index+1<entries.length)pending=request(entries[index+1]);
        if(this.objectUrl)URL.revokeObjectURL(this.objectUrl);
        this.objectUrl=URL.createObjectURL(result.blob);this.audio.src=this.objectUrl;this.setRate(this.rate);
        onEntry(entries[index]);onStatus(this.paused?'Paused. Select Resume to continue.':entries[index].label);
        await new Promise((resolve,reject)=>{
          this.finish=resolve;this.audio.onended=resolve;
          this.audio.onerror=()=>reject(new Error('Unable to play narration audio. Please try again.'));
          if(!this.paused)this.audio.play().catch(reject);
        });
        if(active()){this.finish=null;this.audio.pause();this.audio.removeAttribute('src');this.audio.load();}
      }
      if(active()){this.stop();onEnd();}
    }catch(error){if(active()){this.stop();if(error.name!=='AbortError')onError(error.message);}}
  }
}
