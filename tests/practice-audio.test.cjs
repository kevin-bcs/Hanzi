const assert=require('node:assert/strict');
(async()=>{
 const utterances=[];global.window={speechSynthesis:{getVoices:()=>[{lang:'zh-HK'},{lang:'zh-CN'}],speak:u=>utterances.push(u),cancel:()=>{}}};
 global.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
 const {playPracticeAudio,stopPracticeAudio}=await import('../dist/js/learning/practice-audio.js');
 let p=playPracticeAudio('学习汉语。',.75);assert.equal(utterances[0].rate,.75);assert.equal(utterances[0].voice.lang,'zh-CN');utterances[0].onend();assert.equal(await p,true);
 p=playPracticeAudio('你好');stopPracticeAudio();assert.equal(await p,false);utterances.at(-1).onend();
 p=playPracticeAudio('中文');utterances.at(-1).onerror();assert.equal(await p,false);
 window.speechSynthesis.getVoices=()=>[{lang:'zh-HK'}];assert.equal(await playPracticeAudio('中文'),false);
 delete global.window;delete global.SpeechSynthesisUtterance;
 console.log('PASS practice audio awaits onend, selects Mandarin, applies speed, resolves cancellation/errors and rejects absent Mandarin voices');
})().catch(e=>{console.error(e);process.exitCode=1});
