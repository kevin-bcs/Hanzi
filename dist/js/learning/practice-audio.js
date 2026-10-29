import {chineseVoice} from '../services/audio.js';
let practiceAudioUtterance=null,practiceAudioResolve=null,practiceAudioTimeout=null;
/** Promise resolves only at verified completion; clocks may exclude the whole audio interval. */
export function stopPracticeAudio(){
 const pending=practiceAudioResolve;practiceAudioResolve=null;
 clearTimeout(practiceAudioTimeout);practiceAudioTimeout=null;
 if(practiceAudioUtterance&&window.speechSynthesis)window.speechSynthesis.cancel();
 practiceAudioUtterance=null;pending?.(false);
}
export function playPracticeAudio(text,speed=1,onStatus=()=>{}){
 stopPracticeAudio();const voice=chineseVoice();
 if(!window.speechSynthesis||!voice){onStatus('No Mandarin voice available. Enable a device voice, or skip this item without penalty.');return Promise.resolve(false)}
 return new Promise(resolve=>{
  const u=new SpeechSynthesisUtterance(text);practiceAudioUtterance=u;practiceAudioResolve=resolve;
  u.voice=voice;u.lang=voice.lang;u.rate=speed;
  const finish=(ok,message)=>{if(practiceAudioUtterance!==u)return;practiceAudioUtterance=null;practiceAudioResolve=null;clearTimeout(practiceAudioTimeout);onStatus(message);resolve(ok)};
  u.onend=()=>finish(true,'Playback finished.');u.onerror=()=>finish(false,'Audio could not play. Retry or skip without penalty.');
  practiceAudioTimeout=setTimeout(()=>{finish(false,'Audio did not finish. Retry or skip without penalty.');window.speechSynthesis.cancel()},15000);
  try{onStatus('Playing…');window.speechSynthesis.speak(u)}catch{finish(false,'Audio is unavailable. Skip without penalty.')}
 });
}
