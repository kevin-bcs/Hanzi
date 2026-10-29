import {ensureLearning} from './srs.js';
import {runtime} from '../state/app-state.js';
import {$} from '../config/constants.js';
import {save} from '../services/storage.js';
import {go,openGameMenu} from '../navigation/router.js';
import {lessonWords} from './model.js';
import {activityDefinitions,buildPracticeQuestions,practiceShuffle,questionAccepted,questionFeedback,primaryForm,practiceDifference,practiceAvailability} from './questions.js';
import {exerciseContent} from '../data/generated-exercises.js';
import {practiceHistory,recordPracticeAttempt,recordPracticeSession} from './history.js';
import {playPracticeAudio,stopPracticeAudio} from './practice-audio.js';
import {openLearningReading} from '../readings/controller.js';
import {updateCardOptions} from '../games/memory.js';
let practiceContext=null,practiceSession=null,practiceTick=null,practiceRecognition=null,practiceGeneration=0;
const phost=()=>$('practice');
const pnode=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;if(typeof text==='string'&&/^[\p{Script=Han}\p{P}\s]+$/u.test(text))n.setAttribute('lang','zh-CN');return n};
const pbutton=(text,fn,cls)=>{const b=pnode('button',text,cls);b.type='button';b.onclick=fn;return b};
function practiceHeading(title){const h=pnode('h2',title);h.tabIndex=-1;phost().append(h);h.focus?.();return h}
function practiceSelect(parent,label,options,value){const l=pnode('label',label),select=pnode('select');select.setAttribute('aria-label',label);for(const [v,t]of options){const o=pnode('option',t);o.value=String(v);select.append(o)}select.value=options.some(([v])=>String(v)===String(value))?String(value):String(options[0]?.[0]||'');l.append(select);parent.append(l);return select}
function practiceWords(){return lessonWords(runtime.state.words,practiceContext.lesson)}
function practiceLessonId(){return practiceContext.lesson?.id || '*'}
function practiceScenes(){const words=new Set(practiceWords().map(w=>w.id));return exerciseContent.scenarios.filter(s=>(practiceLessonId()==='*'||s.lesson===practiceLessonId())&&exerciseContent.sentences.filter(x=>x.lesson===s.lesson).every(x=>x.tokens.every(id=>words.has(id))))}
function practiceReadings(){const words=new Set(practiceWords().map(w=>w.id));return exerciseContent.readings.filter(r=>(practiceLessonId()==='*'||r.lesson===practiceLessonId())&&exerciseContent.sentences.filter(s=>s.lesson===r.lesson).every(s=>s.tokens.every(id=>words.has(id))))}
export function stopPracticeSession(){
 practiceGeneration++;clearInterval(practiceTick);practiceTick=null;stopPracticeAudio();
 if(practiceRecognition){practiceRecognition.onresult=null;practiceRecognition.onend=null;practiceRecognition.onerror=null;practiceRecognition.abort();practiceRecognition=null}
}
export function showActivityMenu(lesson){
 go('practice');practiceContext={lesson};practiceSession=null;phost().replaceChildren(pbutton('← Learning Center',()=>go('learning')));
 practiceHeading((lesson?.title||'All Lessons')+' — Activities');
 phost().append(pnode('p','Every activity uses this selection. Unavailable activities need more lesson content.'));
 const grid=pnode('div',undefined,'activity-grid'),availability=practiceAvailability(practiceWords(),practiceLessonId(),practiceHistory(runtime.state).items);
 for(const a of activityDefinitions){const tile=pnode('article',undefined,'panel activity-card'),count=availability[a.id];
  const history=practiceHistory(runtime.state).sessions.filter(s=>s.activity===a.id&&s.lesson===practiceLessonId());
  tile.append(pnode('h3',a.title),pnode('span',a.hanzi,'pinyin'),pnode('p',a.instructions),pnode('p',count?'Available · '+history.length+' sessions recorded':'No suitable content is ready in this selection.','small'));
  const b=pbutton('Configure',()=>showActivitySettings(a.id), 'primary');b.disabled=!count;b.setAttribute('aria-label','Configure '+a.title);tile.append(b);grid.append(tile);
 }
 phost().append(grid);
}
export function showDailyPractice(lesson=null){go('practice');practiceContext={lesson};showActivitySettings('personalized',{daily:true})}
export function showActivitySettings(type,{daily=false}={}){
 stopPracticeSession();practiceSession=null;
 const definition=activityDefinitions.find(a=>a.id===type),lesson=practiceContext.lesson;
 if(type==='matching'){
  go('games');$('memorySection').value=lesson?.section||'*';openGameMenu('memory',true);updateCardOptions();
  // Existing Memorama engine, including same-set/new-set restart and multiplayer.
  const options=[...$('pairCount').options];for(const o of options)if(![6,8,10,12].includes(Number(o.value)))o.remove();
  $('pairCount').value='6';return;
 }
 phost().replaceChildren(pbutton('← Change activity',()=>showActivityMenu(lesson)));
 practiceHeading(definition.title+' — '+(lesson?.title||'All Lessons'));
 phost().append(pnode('p',definition.instructions));
 const form=pnode('div',undefined,'toolbar'),stored=practiceHistory(runtime.state).settings?.[type]||{};
 const count=['reading','stories','roleplay','timed'].includes(type)?null:practiceSelect(form,'Session length',[[5,'5 questions'],[10,'10 questions'],[20,'20 questions']],daily?5:stored.count||10);
 const speed=practiceSelect(form,'Playback speed',[[.75,'0.75× Slow'],[1,'1× Normal'],[1.25,'1.25× Fast']],stored.speed||1);
 let direction,input,dictation,timer,sceneSelect,readingSelect;
 if(type==='translation'){
  direction=practiceSelect(form,'Direction',[['zh-en','Chinese → English'],['en-zh','English → Chinese']],stored.direction||'zh-en');
  input=practiceSelect(form,'Answer format',[['choices','Multiple choice'],['text','Type an answer'],['bank','Arrange characters (English → Chinese)']],stored.translationInput||'choices');
 }
 if(type==='dictation')dictation=practiceSelect(form,'Answer format',[['hanzi','Write hanzi'],['pinyin','Pinyin with tone marks'],['characters','Arrange characters']],stored.dictationInput||'hanzi');
 if(type==='timed')timer=practiceSelect(form,'Active answering time',[[30,'30 seconds'],[60,'60 seconds'],[90,'90 seconds'],[0,'No time limit']],stored.seconds??60);
 if(['stories','roleplay'].includes(type))sceneSelect=practiceSelect(form,'Scenario',practiceScenes().map(s=>[s.id,s.title]),stored.scene||practiceScenes()[0]?.id);
 if(type==='reading')readingSelect=practiceSelect(form,'Short reading',practiceReadings().map(r=>[r.id,r.title]),stored.reading||practiceReadings()[0]?.id);
 const feedback=pnode('p','','notice');feedback.setAttribute('role','status');feedback.setAttribute('aria-atomic','true');phost().append(form,feedback);
 if(type==='speaking')phost().append(pnode('p','Speech recognition may require microphone permission and a network connection supplied by your browser. Transcript matching is approximate and cannot judge tones. Manual reflection is always available.','notice'));
 if(type==='mistakes')phost().append(pnode('p','Missed items wait one minute before retry. A correct correction waits one day. No mistakes are invented to fill a session.','small'));
 phost().append(pbutton('Start activity',()=>{
  const settings={daily,count:Number(count?.value||10),speed:Number(speed.value),direction:direction?.value||'zh-en',translationInput:input?.value||'choices',dictationInput:dictation?.value||'hanzi',seconds:Number(timer?.value||0),scene:sceneSelect?.value,reading:readingSelect?.value};
  if(settings.translationInput==='bank'&&settings.direction!=='en-zh'){feedback.textContent='Character arrangement requires English → Chinese. Change the direction or answer format.';return}
  const history=practiceHistory(runtime.state);history.settings=history.settings||{};history.settings[type]=settings;save();
  if(type==='reading'){
   const reading=practiceReadings().find(r=>r.id===settings.reading);if(!reading){feedback.textContent='No reading is available.';return}
   openLearningReading(reading,()=>showActivityMenu(lesson),result=>{
    if(!recordPracticeSession(runtime.state,{id:crypto.randomUUID(),activity:'reading',completed:true,lesson:practiceLessonId(),date:new Date().toISOString(),correct:result.correct,wrong:result.wrong}))return;
    for(const q of reading.questions){const sentence=exerciseContent.sentences.find(s=>s.id===q.evidence[0]);recordPracticeAttempt(runtime.state,{id:'reading:'+sentence.id,type:'reading',wordIds:sentence.tokens},result.answers[q.id]===q.answer,{assisted:result.assisted,lesson:practiceLessonId()})}save();
   },settings.speed);return;
  }
  startPracticeActivity(type,settings,feedback);
 },'primary'));
}
function startPracticeActivity(type,settings,feedback){
 stopPracticeSession();const pool=practiceWords(),history=practiceHistory(runtime.state);
 let queue=buildPracticeQuestions(type,pool,practiceLessonId(),settings,history.items,Math.random,ensureLearning(runtime.state));

 if(!['stories','roleplay'].includes(type)&&!queue.length){feedback.textContent='No valid questions are ready. Choose another activity or lesson. Audio homophones and insufficient distractors are excluded.';return}
 if(settings.daily){const seen=new Set(),unique=[],rest=[];for(const q of queue){if(q.wordIds.some(id=>!seen.has(id))){unique.push(q);for(const id of q.wordIds)seen.add(id)}else rest.push(q)}queue=[...unique,...rest]}
 practiceSession={startingXp:ensureLearning(runtime.state).xp,id:crypto.randomUUID(),type,settings,queue:queue.slice(0,type==='timed'?queue.length:settings.count),at:0,correct:0,wrong:0,assisted:0,skipped:0,remaining:settings.seconds*1000,lastTick:Date.now(),clockActive:false,done:false,answers:[],dialogue:[],scene:practiceScenes().find(s=>s.id===settings.scene)};
 if(['stories','roleplay'].includes(type)){if(!practiceSession.scene){feedback.textContent='This scenario is unavailable.';return}practiceSession.node=practiceSession.scene.start;renderPracticeBranch();return}
 if(type==='timed'&&settings.seconds>0){const s=practiceSession;practiceTick=setInterval(()=>{if(s!==practiceSession||s.done)return;const now=Date.now();if(s.clockActive)s.remaining=Math.max(0,s.remaining-(now-s.lastTick));s.lastTick=now;const clock=$('practiceClock');if(clock)clock.textContent=(s.remaining/1000).toFixed(1)+' seconds remaining';if(s.remaining<=0)finishPracticeActivity()},100)}
 renderPracticeQuestion();
}
function practiceClockActive(value){if(!practiceSession)return;const now=Date.now();if(practiceSession.clockActive&&practiceSession.type==='timed'&&practiceSession.settings.seconds>0)practiceSession.remaining=Math.max(0,practiceSession.remaining-(now-practiceSession.lastTick));practiceSession.lastTick=now;practiceSession.clockActive=value}
function practiceSessionFrame(){
 const s=practiceSession;phost().replaceChildren(pbutton('End session',()=>finishPracticeActivity()));
 practiceHeading(activityDefinitions.find(a=>a.id===s.type).title);
 const position=pnode('p',(s.at+1)+' / '+s.queue.length+' · '+s.correct+' correct · '+s.wrong+' incorrect','small');
 const bar=pnode('progress');bar.max=s.queue.length;bar.value=s.at;bar.setAttribute('aria-label','Session progress');
 const clock=pnode('p',s.type==='timed'&&s.settings.seconds?(s.remaining/1000).toFixed(1)+' seconds remaining':'No time limit','small');clock.id='practiceClock';clock.setAttribute('role','timer');clock.setAttribute('aria-live','off');
 phost().append(position,bar,clock);
}
function renderPracticeQuestion(){
 if(practiceRecognition){practiceRecognition.onresult=null;practiceRecognition.onend=null;practiceRecognition.onerror=null;practiceRecognition.abort();practiceRecognition=null}
 const s=practiceSession;if(!s||s.done)return;if(s.at>=s.queue.length){finishPracticeActivity();return}
 stopPracticeAudio();practiceClockActive(false);practiceSessionFrame();const q=s.queue[s.at],generation=practiceGeneration;
 const card=pnode('article',undefined,'panel exercise-card'),feedback=pnode('div','','notice');feedback.setAttribute('role','status');feedback.setAttribute('aria-atomic','true');
 let helpUsed=false,answered=false,selected=[],audioReady=!['listening','dictation'].includes(q.type),input,check,recognitionResult=null;
 const answersBox=pnode('div',undefined,'exercise-options'),controls=pnode('div',undefined,'toolbar');
 function valid(){return s===practiceSession&&!s.done&&generation===practiceGeneration&&!answered}
 function score(correct,{assisted=false,response=''}={}){
  if(!valid()||!audioReady)return;practiceClockActive(false);if(s.type==='timed'&&s.settings.seconds>0&&s.remaining<=0){finishPracticeActivity();return}answered=true;stopPracticeAudio();
  if(practiceRecognition){practiceRecognition.abort();practiceRecognition=null}
  assisted=assisted||helpUsed;
  if(assisted)s.assisted++;else if(correct)s.correct++;else s.wrong++;
  const attempt=recordPracticeAttempt(runtime.state,q,correct,{assisted,lesson:practiceLessonId()});save();s.answers.push({id:q.id,correct,assisted,response});
  const detail=questionFeedback(q);feedback.classList.add(assisted?'feedback-assisted':correct?'feedback-correct':'feedback-wrong');feedback.setAttribute('aria-atomic','true');feedback.replaceChildren(pnode('strong',assisted?'Reflection recorded (not objectively scored).':correct?'Correct!':'Incorrect.'),pnode('p','Correct Answer: '+detail.answer),pnode('p','Pinyin: '+detail.pinyin),pnode('p','Meaning: '+detail.meaning),pnode('p','Explanation: '+detail.explanation));
  if(attempt.lastXp)feedback.append(pnode('p','+'+attempt.lastXp+' XP for spaced learning.'));
  if(!correct&&response){feedback.append(pnode('p','Your answer: '+response));if(q.type==='dictation')feedback.append(pnode('p',practiceDifference(q.answerLabel,response)))}
  for(const child of answersBox.querySelectorAll('button,input'))child.disabled=true;
  if(check)check.disabled=true;
  feedback.append(pbutton(s.at+1===s.queue.length?'View results':'Next',()=>{if(s!==practiceSession||s.done)return;s.at++;renderPracticeQuestion()},'primary'));
  feedback.querySelectorAll('button')[0]?.focus?.();
 }
 if(q.type==='listening'||q.type==='dictation')card.append(pnode('h3',q.type==='listening'?'Listen and choose the meaning':q.prompt));
 else if(q.type==='picture'){
  const image=pnode('img');image.src=q.image;image.alt=q.imageAlt||q.meaning;image.width=200;image.height=180;image.loading='lazy';
  image.onerror=()=>{image.remove();audioReady=false;feedback.textContent='Illustration unavailable. Skip without penalty.';practiceClockActive(false)};card.append(image);
 }else if(q.type==='reading'){
  const line=pnode('div',undefined,'reading-line');for(const u of q.reading.units){if(u.kind==='punctuation'){line.append(pnode('span',u.hanzi));continue}const word=pbutton('',()=>playPracticeAudio(u.hanzi,s.settings.speed,message=>feedback.textContent=message),'reading-word');const ruby=pnode('span',undefined,'reading-ruby');for(const a of u.alignment){const column=pnode('span',undefined,'reading-char');column.append(pnode('span',a.hanzi,'reading-hanzi'),pnode('span',a.pinyin,'reading-pinyin'));ruby.append(column)}word.append(ruby,pnode('span',u.gloss,'reading-english'));line.append(word)}
  const translation=pnode('p',q.meaning);translation.hidden=true;line.classList.add('no-english');card.append(line,translation);
  controls.append(pbutton('Show / Hide pinyin',()=>line.classList.toggle('no-pinyin')),pbutton('Show / Hide English',()=>{line.classList.toggle('no-english');translation.hidden=!translation.hidden;if(!translation.hidden)helpUsed=true}));card.append(pnode('h3',q.prompt));
 }else card.append(pnode('h3',q.display||q.prompt,q.type==='choice'?'quizword':''));
 if(q.type==='builder'||q.type==='blanks')card.append(pnode('p',q.type==='builder'?'Arrange the words to match the meaning above.':q.prompt));
 if(!['picture','translation','builder','blanks','reading'].includes(q.type)){
  const listen=pbutton('Play / Repeat audio',async()=>{
   if(!valid())return;practiceClockActive(false);listen.disabled=true;if(check)check.disabled=true;for(const b of answersBox.querySelectorAll('button'))b.disabled=true;
   const ok=await playPracticeAudio(q.hanzi,s.settings.speed,message=>{if(valid())feedback.textContent=message});
   if(!valid())return;listen.disabled=false;audioReady=ok||!['listening','dictation'].includes(q.type);
   if(check)check.disabled=!audioReady;for(const b of answersBox.querySelectorAll('button'))b.disabled=!audioReady||b.dataset.used==='true';
   practiceClockActive(audioReady);
  });controls.append(listen);
 }
 if(q.type==='speaking'){
  card.append(pnode('p',q.pinyin,'pinyin'),pnode('p',q.meaning));
  const transcript=pnode('p','No speech recorded yet.');answersBox.append(transcript);
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(Recognition){const speak=pbutton('Speak',()=>{
   if(!valid())return;if(practiceRecognition)practiceRecognition.abort();
   const recognizer=new Recognition();practiceRecognition=recognizer;recognizer.lang='zh-CN';recognizer.interimResults=false;
   recognizer.onresult=event=>{if(!valid())return;const heard=event.results[0][0].transcript;recognitionResult=questionAccepted(q,heard);transcript.textContent='Transcript: '+heard+'. Approximate text match: '+(recognitionResult?'yes':'no')+'. Tones have not been assessed.'};
   recognizer.onerror=()=>{if(valid())transcript.textContent='Speech recognition unavailable or permission denied. Use manual reflection.'};recognizer.onend=()=>{if(practiceRecognition===recognizer)practiceRecognition=null};
   try{recognizer.start()}catch{transcript.textContent='Could not start the microphone. Use manual reflection.'}
  });controls.append(speak)}else transcript.textContent='Speech recognition is not supported here. Listen, say the word aloud, then reflect.';
  answersBox.append(pbutton('Record approximate transcript match',()=>{if(recognitionResult===null){transcript.textContent='Record speech first, or use manual reflection.';return}score(recognitionResult,{assisted:true})}),pbutton('I practiced — comfortable',()=>score(true,{assisted:true})),pbutton('I practiced — needs work',()=>score(false,{assisted:true})));
 }else if(q.type==='builder'||q.type==='dictation'&&q.input==='characters'||q.type==='translation'&&q.input==='bank'){
  const tokens=q.type==='builder'||q.type==='translation'&&q.tokens?q.tokens.map(t=>t.label):Array.from(q.hanzi.replace(/[。？]/g,'')),selectedBox=pnode('p','Your answer: '),bank=pnode('div',undefined,'word-bank');
  selectedBox.setAttribute('role','status');selectedBox.setAttribute('aria-label','Constructed answer');
  const tokenButtons=[];function show(){selectedBox.textContent='Your answer: '+selected.map(x=>x.label).join('')}
  for(const item of practiceShuffle(tokens.map((label,index)=>({label,index})))){const b=pbutton(item.label,()=>{if(!valid())return;selected.push(item);b.dataset.used='true';b.disabled=true;show()});tokenButtons[item.index]=b;bank.append(b)}
  check=pbutton('Check answer',()=>{const text=selected.map(x=>x.label).join('');if(!text){feedback.textContent='Build an answer first.';return}score(questionAccepted(q,text),{response:text})},'primary');check.disabled=!audioReady;
  answersBox.append(selectedBox,bank,pbutton('Undo last word',()=>{if(!valid())return;const last=selected.pop();if(last){tokenButtons[last.index].disabled=false;tokenButtons[last.index].dataset.used='false'}show()}),pbutton('Clear',()=>{if(!valid())return;selected=[];for(const b of tokenButtons){b.disabled=false;b.dataset.used='false'}show()}),check);
 }else if(q.options){
  for(const option of q.options){const b=pbutton(option.label,()=>score(option.value===q.answer,{response:option.label}));b.disabled=!audioReady;answersBox.append(b)}
 }else{
  const label=pnode('label',q.type==='dictation'?'Your answer (tones matter in pinyin)':'Your translation');input=pnode('input');input.autocomplete='off';input.spellcheck=false;input.setAttribute('aria-label','Your answer');label.append(input);
  check=pbutton('Check answer',()=>{if(!input.value.trim()){feedback.textContent='Enter an answer first.';return}score(questionAccepted(q,input.value),{response:input.value})},'primary');check.disabled=!audioReady;
  input.onkeydown=e=>{if(e.key==='Enter')check.click()};answersBox.append(label,check);
 }
 controls.append(pbutton('Skip without penalty',()=>{if(!valid())return;answered=true;practiceClockActive(false);s.skipped++;s.at++;renderPracticeQuestion()}));
 card.append(controls,answersBox,feedback);phost().append(card);practiceClockActive(audioReady);
}
function renderPracticeBranch(){
 const s=practiceSession;if(!s||s.done)return;if(s.node===null){finishPracticeActivity();return}
 const node=s.scene.nodes.find(n=>n.id===s.node),sentence=exerciseContent.sentences.find(x=>x.id===node.sentence);
 const byId=new Map(practiceWords().map(w=>[w.id,w]));
 phost().replaceChildren(pbutton('End session',()=>finishPracticeActivity()));practiceHeading(s.scene.title+' — '+(s.type==='stories'?'Story':'Roleplay'));
 phost().append(pnode('p',s.scene.context),pnode('p',s.answers.length+' decisions made · '+s.correct+' correct','small'));
 for(const line of s.dialogue)phost().append(pnode('p',line,'story-line'));
 const box=pnode('article',undefined,'panel'),feedback=pnode('div','','notice');feedback.setAttribute('role','status');feedback.setAttribute('aria-atomic','true');
 if(!node.options){box.append(pnode('h3','Try this line: '+sentence.text),pnode('p',sentence.english),pnode('p',node.explanation),pbutton('Listen',()=>playPracticeAudio(sentence.text,s.settings.speed,message=>feedback.textContent=message)),pbutton('Continue',()=>{s.node=node.next;renderPracticeBranch()},'primary'));}
 else{
  box.append(pnode('h3',node.speaker+': '+node.prompt));let chosen=false;
  for(const option of practiceShuffle(node.options)){const line=exerciseContent.sentences.find(x=>x.id===option.sentence);const b=pbutton(line.text,()=>{
   if(chosen||s!==practiceSession||s.done)return;chosen=true;const q={id:s.type+':'+s.scene.id+':'+node.id,type:s.type,wordIds:sentence.tokens};
   recordPracticeAttempt(runtime.state,q,option.correct,{lesson:practiceLessonId()});save();if(option.correct)s.correct++;else s.wrong++;
   s.answers.push({id:q.id,correct:option.correct});s.dialogue.push(node.speaker+': '+line.text);
   const pinyin=sentence.tokens.map(id=>primaryForm(byId.get(id),'pinyin')).join(' ');
   feedback.replaceChildren(pnode('strong',option.correct?'Correct!':'Incorrect.'),pnode('p','Correct Answer: '+sentence.text),pnode('p','Pinyin: '+pinyin),pnode('p','Meaning: '+sentence.english),pnode('p','Explanation: '+sentence.explanation),pbutton('Listen to the correct line',()=>playPracticeAudio(sentence.text,s.settings.speed,message=>{const n=pnode('p',message);feedback.append(n)})),pbutton('Continue',()=>{s.node=option.next;renderPracticeBranch()},'primary'));
   for(const btn of box.querySelectorAll('.branch-option'))btn.disabled=true;
  },'branch-option');box.append(b)}
 }
 box.append(feedback);phost().append(box);
}
function finishPracticeActivity(){
 const s=practiceSession;if(!s||s.done)return;s.done=true;stopPracticeSession();
 const total=s.correct+s.wrong;const result={id:s.id,activity:s.type,lesson:practiceLessonId(),date:new Date().toISOString(),correct:s.correct,wrong:s.wrong,assisted:s.assisted,skipped:s.skipped,answered:s.answers.length,completed:s.node===null||s.at>=s.queue.length||s.type==='timed'&&s.settings.seconds>0&&s.remaining<=0,accuracy:total?Math.round(s.correct*100/total):null};
 if(s.answers.length){recordPracticeSession(runtime.state,result);runtime.state.results=Array.isArray(runtime.state.results)?runtime.state.results:[];runtime.state.results.push({game:'learning-'+s.type,...result});runtime.state.results=runtime.state.results.slice(-200);save()}
 phost().replaceChildren();practiceHeading('Session results');
 phost().append(pnode('p','Session XP: +'+(ensureLearning(runtime.state).xp-s.startingXp)),pnode('p',s.correct+' correct · '+s.wrong+' incorrect · '+s.assisted+' assisted/reflection · '+s.skipped+' skipped'),pnode('p',total?result.accuracy+'% accuracy on objectively scored answers.':'No objectively scored answers.'),pnode('p',s.answers.length?'Progress saved in this browser.':'No answers were recorded.'));
 for(const answer of s.answers){const q=s.queue.find(q=>q.id===answer.id);if(q)phost().append(pnode('p',(answer.assisted?'Reflection':answer.correct?'Correct':'Incorrect')+' — '+q.hanzi+' · '+q.pinyin+' · '+q.meaning))}
 const tools=pnode('div',undefined,'toolbar');tools.append(pbutton('Repeat activity',()=>showActivitySettings(s.type),'primary'),pbutton('Change activity',()=>showActivityMenu(practiceContext.lesson)),pbutton('Back to lesson',()=>go('learning')));phost().append(tools);
}
