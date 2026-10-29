import {learningQuestionPriority} from './srs.js';
import {exerciseContent} from '../data/generated-exercises.js';
/** Shared deterministic contracts; randomization only changes item/option order, never language. */
export const activityDefinitions = [
 ['choice','Multiple Choice','选择题','Choose the English meaning of the Chinese word.'],
 ['matching','Word Matching','词语配对','Match two representations of the same word.'],
 ['listening','Listening','听力理解','Listen first, then choose the English meaning.'],
 ['speaking','Speaking Practice','口语练习','Listen and speak. Transcript feedback is approximate; tones are not evaluated.'],
 ['builder','Word Bank','组句练习','Arrange the provided Chinese words to match the English sentence.'],
 ['blanks','Fill in the Blanks','填空练习','Complete the sentence so it matches its English meaning.'],
 ['translation','Translation','翻译练习','Translate using accepted answers or the supplied choices.'],
 ['dictation','Dictation','听写练习','Listen, then write the hanzi or tone-marked pinyin, or arrange characters.'],
 ['picture','Picture Vocabulary','图片识词','Choose the Chinese word for the illustration.'],
 ['reading','Reading','阅读理解','Read lesson examples using the interactive reader, then check comprehension.'],
 ['stories','Interactive Stories','互动故事','Follow a short scenario and choose the appropriate line.'],
 ['roleplay','Roleplay','情景对话','Respond to the situation. Your choice determines the next branch.'],
 ['mistakes','Mistake Review','错题复习','Review recent and recurring mistakes that are ready to practice again.'],
 ['timed','Timed Challenge','限时挑战','Answer vocabulary, translation and listening questions. Audio time is excluded.'],
 ['personalized','Personalized Practice','个性化练习','Mix recognition, listening, translation, writing and reading using your review history.']
].map(([id,title,hanzi,instructions])=>({id,title,hanzi,instructions}));
export function practiceNormalize(s) { return String(s).normalize('NFC').toLowerCase().replace(/[\s.,!?。！？，、'’“”";；:：-]/gu,''); }
export function primaryForm(w,field='hanzi'){return w[field].split('/')[0].trim()}
export function practiceShuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const meaningAliases=w=>[...w.meaning.split(';'),...(w.acceptedEnglish||[])].map(practiceNormalize);
function practiceOptions(target,pool,field,random){
 const used=new Set([practiceNormalize(target[field])]),aliases=meaningAliases(target);
 const distractors=practiceShuffle(pool.filter(w=>w.id!==target.id && !meaningAliases(w).some(x=>aliases.includes(x))),random)
 .sort((a,b)=>Number(b.category===target.category)-Number(a.category===target.category));
 const out=[{value:target.id,label:field==='hanzi'?primaryForm(target):target[field]}];
 for(const w of distractors){const label=field==='hanzi'?primaryForm(w):w[field],key=practiceNormalize(label);if(used.has(key))continue;used.add(key);out.push({value:w.id,label});if(out.length===4)break}
 return out.length===4?practiceShuffle(out,random):null;
}
export function questionAccepted(q,response){return q.accepted.some(x=>practiceNormalize(x)===practiceNormalize(response))}
export function questionFeedback(q){return {answer:q.answerLabel,pinyin:q.pinyin,meaning:q.meaning,explanation:q.explanation}}
export function buildPracticeQuestions(type,words,lessonId='*',settings={},progress={},random=Math.random,learning=null){
 const byId=new Map(words.map(w=>[w.id,w]));const sentences=exerciseContent.sentences.filter(s=>(lessonId==='*'||s.lesson===lessonId)&&s.tokens.every(id=>byId.has(id)));
 const result=[];
 const types=type==='personalized'?['choice','listening','translation','dictation','reading']:type==='timed'?['choice','translation','listening']:type==='mistakes'?['choice','listening','translation','dictation','builder','blanks','picture','reading','stories','roleplay']:[type];
 for(const kind of types){
  if(['stories','roleplay'].includes(kind)){
   for(const scene of exerciseContent.scenarios.filter(s=>lessonId==='*'||s.lesson===lessonId)){
    for(const node of scene.nodes.filter(n=>n.options)){
     const sentence=sentences.find(s=>s.id===node.sentence);if(!sentence)continue;
     const options=node.options.map(o=>{const line=sentences.find(s=>s.id===o.sentence);return line?{value:o.sentence,label:line.text}:null});if(options.some(o=>!o))continue;
     result.push({id:kind+':'+scene.id+':'+node.id,type:kind,wordIds:sentence.tokens,lesson:scene.lesson,prompt:node.prompt,hanzi:sentence.text,pinyin:sentence.tokens.map(id=>primaryForm(byId.get(id),'pinyin')).join(' '),meaning:sentence.english,answer:sentence.id,answerLabel:sentence.text,accepted:[sentence.text],explanation:sentence.explanation,options:practiceShuffle(options,random)});
    }
   }continue;
  }
  if(['builder','blanks','reading','translation','listening','dictation'].includes(kind)){
   for(const s of sentences){const tokens=s.tokens.map(id=>byId.get(id)),pinyin=tokens.map(w=>primaryForm(w,'pinyin')).join(' ');
    const q={id:kind+':'+s.id,type:kind,wordIds:s.tokens,lesson:s.lesson,prompt:s.english,hanzi:s.text,pinyin,meaning:s.english,explanation:s.explanation,answerLabel:s.text,accepted:[s.text],tokens:tokens.map(w=>({value:w.id,label:primaryForm(w)}))};
    if(kind==='blanks'){const target=tokens[s.blank],options=practiceOptions(target,words,'hanzi',random);if(!options)continue;Object.assign(q,{prompt:s.english,display:tokens.map((w,i)=>i===s.blank?'____':primaryForm(w)).join('')+s.text.slice(-1),options,answer:target.id,answerLabel:primaryForm(target),accepted:[primaryForm(target)]})}
    if(kind==='reading'){const reading=exerciseContent.readings.find(r=>r.lesson===s.lesson),question=reading.questions.find(q=>q.evidence.includes(s.id));Object.assign(q,{prompt:question.prompt,reading:reading.turns.find(t=>t.id===s.id),options:practiceShuffle(question.options.map((label,i)=>({label,value:String(i)})),random),answer:String(question.answer),answerLabel:question.options[question.answer],accepted:[question.options[question.answer]]})}
    if(['translation','listening','dictation'].includes(kind)){
     const direction=settings.direction||'zh-en';
     q.id+=':'+((kind==='translation')?direction:kind==='dictation'?(settings.dictationInput||'hanzi'):'audio');
     q.input=kind==='translation'?(settings.translationInput||'choices'):kind==='dictation'?(settings.dictationInput||'hanzi'):null;
     q.prompt=kind==='translation'&&direction==='zh-en'?s.text:s.english;
     q.accepted=kind==='dictation'?[q.input==='pinyin'?pinyin:s.text]:kind==='translation'&&direction==='en-zh'?[s.text]:s.accepted;
     q.answerLabel=q.accepted[0];
     if(kind==='listening'||kind==='translation'&&q.input==='choices'){
      const candidates=sentences.filter(x=>x.id!==s.id);const selected=[s,...practiceShuffle(candidates,random).slice(0,3)];if(selected.length<4)continue;
      q.options=practiceShuffle(selected.map(x=>({value:x.id,label:kind==='translation'&&direction==='en-zh'?x.text:x.english})),random);q.answer=s.id;
     }
    }
    result.push(q);
   }if(['builder','blanks','reading'].includes(kind))continue;
  }
  for(const w of words){
   if(['listening','dictation'].includes(kind)&&words.some(other=>other.id!==w.id&&practiceNormalize(primaryForm(other,'pinyin'))===practiceNormalize(primaryForm(w,'pinyin'))&&primaryForm(other)!==primaryForm(w)))continue;
   if(kind==='picture'&&!w.image)continue;
   const q={id:kind+':'+w.id,type:kind,wordIds:[w.id],hanzi:primaryForm(w),pinyin:primaryForm(w,'pinyin'),meaning:w.meaning,prompt:primaryForm(w),answerLabel:w.meaning,accepted:[...w.meaning.split(';').map(x=>x.trim()),...(w.acceptedEnglish||[])],explanation:'“'+primaryForm(w)+'” ('+primaryForm(w,'pinyin')+') means “'+w.meaning+'”.',image:w.image,imageAlt:w.imageAlt};
   if(kind==='translation'){
    q.id+=':'+(settings.direction||'zh-en');
    if(settings.direction==='en-zh'){q.prompt=w.meaning;q.accepted=w.hanzi.split('/').map(x=>x.trim());q.answerLabel=primaryForm(w)}
    q.input=settings.translationInput||'choices';
   }
   if(kind==='dictation'){q.input=settings.dictationInput||'hanzi';q.id+=':'+q.input;q.accepted=(q.input==='pinyin'?w.pinyin:w.hanzi).split('/').map(x=>x.trim());q.answerLabel=q.accepted[0];q.prompt='Listen and enter '+(q.input==='pinyin'?'pinyin with tone marks':'the Chinese word')+'.';}
   if(kind==='speaking'){q.prompt=primaryForm(w);q.answerLabel=primaryForm(w);q.accepted=w.hanzi.split('/').map(x=>x.trim());}
   const field=kind==='picture'||kind==='translation'&&settings.direction==='en-zh'?'hanzi':'meaning';
   if(['choice','listening','picture'].includes(kind)||kind==='translation'&&q.input==='choices'){
    q.options=practiceOptions(w,words,field,random);if(!q.options)continue;q.answer=w.id;
   }
   result.push(q);
  }
 }
 if(type==='mistakes'){
  result.push(...buildPracticeQuestions('translation',words,lessonId,{direction:'en-zh'},progress,random),...buildPracticeQuestions('dictation',words,lessonId,{dictationInput:'pinyin'},progress,random),...buildPracticeQuestions('dictation',words,lessonId,{dictationInput:'characters'},progress,random));
 }
 if(type==='mistakes')return result.filter(q=>{const item=progress[q.id];return item ? item.errors>0&&(item.next||0)<=Date.now() : q.type==='choice'&&q.wordIds.some(id=>(words.find(w=>w.id===id)?.errors||0)>0)}).sort((a,b)=>practicePriority(b,words,progress,Date.now(),learning)-practicePriority(a,words,progress,Date.now(),learning));
 if(type==='personalized'){
  const sorted=result.sort((a,b)=>practicePriority(b,words,progress,Date.now(),learning)-practicePriority(a,words,progress,Date.now(),learning));
  const groups=types.map(kind=>sorted.filter(q=>q.type===kind)),mixed=[];let previous='';
  while(groups.some(g=>g.length))for(const group of groups){if(!group.length)continue;let at=group.findIndex(q=>q.wordIds.join('|')!==previous);if(at<0)at=0;const [q]=group.splice(at,1);mixed.push(q);previous=q.wordIds.join('|')}
  return mixed;
 }
 return practiceShuffle(result,random);
}
export function practicePriority(q,words,items,now=Date.now(),learning=null){
 const item=items[q.id]||{},mistakes=item.errors||0,correct=item.correct||0;
 const due=q.wordIds.reduce((n,id)=>{const w=words.find(x=>x.id===id);return n+(w&&(w.due||0)<=now?2:0)+(w?.errors||0)},0);
 const recent=item.last?Math.max(0,1-(now-item.last)/604800000):0;
 return learningQuestionPriority(q,learning,now)+due+Math.min(mistakes,10)*3-Math.min(correct,10)+(mistakes?recent*2:0)-(item.next>now?20:0);
}

export function practiceDifference(expected,received){const a=Array.from(practiceNormalize(expected)),b=Array.from(practiceNormalize(received));const index=a.findIndex((char,i)=>char!==b[i]);const at=index<0?Math.min(a.length,b.length):index;return 'Ignoring spaces and punctuation, position '+(at+1)+': expected '+(a[at]||'(end)')+', received '+(b[at]||'(missing)')+'.'}

/** Menu eligibility reuses a few shared pools instead of generating all fifteen sessions. */
export function practiceAvailability(words,lessonId='*',items={}){
 const ids=new Set(words.map(w=>w.id)),sentences=exerciseContent.sentences.filter(s=>(lessonId==='*'||s.lesson===lessonId)&&s.tokens.every(id=>ids.has(id)));
 const choice=buildPracticeQuestions('choice',words,lessonId).length,listening=buildPracticeQuestions('listening',words,lessonId).length,dictation=buildPracticeQuestions('dictation',words,lessonId).length;
 const scopes=new Set(sentences.map(s=>s.lesson));
 const scene=exerciseContent.scenarios.filter(s=>scopes.has(s.lesson)&&exerciseContent.sentences.filter(x=>x.lesson===s.lesson).every(x=>x.tokens.every(id=>ids.has(id)))).length;
 const reading=exerciseContent.readings.filter(r=>scopes.has(r.lesson)&&r.turns.every(t=>sentences.some(s=>s.id===t.id))).length;
 return {choice,matching:words.length>=6?words.length:0,listening,speaking:words.length,builder:sentences.length,blanks:words.length>=4?sentences.length:0,translation:words.length,dictation,picture:buildPracticeQuestions('picture',words,lessonId).length,reading,stories:scene,roleplay:scene,mistakes:buildPracticeQuestions('mistakes',words,lessonId,{},items).length,timed:choice+listening,personalized:choice+listening+dictation};
}
