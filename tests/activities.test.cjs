const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const {starter,contentLessons}=await import('../dist/js/data/vocabulary.js');
 const {exerciseContent}=await import('../dist/js/data/generated-exercises.js');
 const {buildPracticeQuestions,questionAccepted,practiceNormalize,activityDefinitions}=await import('../dist/js/learning/questions.js');
 const {validateExercises}=await import('../dist/js/learning/content-validator.js');
 const {recordPracticeAttempt,recordPracticeSession,practiceHistory}=await import('../dist/js/learning/history.js');
 const {validateReading}=await import('../dist/js/readings/validator.js');
 const vocab=JSON.parse(fs.readFileSync('content/vocabulary/vocabulary.json'));
 const lessons=fs.readdirSync('content/lessons').filter(x=>x.endsWith('.json')&&!x.includes('template')).map(f=>JSON.parse(fs.readFileSync('content/lessons/'+f)));
 assert.equal(activityDefinitions.length,15);assert.deepEqual(validateExercises(exerciseContent,vocab,lessons),[]);
 for(const lesson of contentLessons.filter(l=>l.level==='foundation')){
  const words=starter.filter(w=>w.sections.includes(lesson.section)),ids=new Set(words.map(w=>w.id));
  for(const type of ['choice','listening','speaking','builder','blanks','translation','dictation','personalized','timed','reading']){
   const questions=buildPracticeQuestions(type,words,lesson.id,{},{});assert(questions.length>0,lesson.title+': '+type);
   for(const q of questions){assert(q.wordIds.every(id=>ids.has(id)));assert(q.accepted.length>0);if(q.options){assert.equal(q.options.filter(o=>o.value===q.answer).length,1);assert.equal(new Set(q.options.map(o=>practiceNormalize(o.label))).size,q.options.length);if(q.type!=='reading')assert.equal(q.options.length,4)}}
  }
  const reading=exerciseContent.readings.find(r=>r.lesson===lesson.id);assert.deepEqual(validateReading(reading,[{id:'daily-life'}]),[]);
  const personalized=buildPracticeQuestions('personalized',words,lesson.id,{},{}).slice(0,5);assert.equal(new Set(personalized.map(q=>q.type)).size,5);
 }
 assert.equal(buildPracticeQuestions('choice',starter.slice(0,2)).length,0);
 const homophones=starter.filter(w=>['v1','v2'].includes(w.id));assert.equal(buildPracticeQuestions('dictation',homophones).length,0);
 const q=buildPracticeQuestions('dictation',starter,'*',{dictationInput:'pinyin'}).find(q=>q.wordIds.length===1&&q.wordIds[0]==='v0');assert(questionAccepted(q,' nǐ '));assert(!questionAccepted(q,'ni'));assert(!questionAccepted(q,'nì'));
 const translation=buildPracticeQuestions('translation',starter,'*',{translationInput:'text'}).find(q=>q.wordIds.length===1&&q.wordIds[0]==='v1');assert(questionAccepted(translation,'him'));assert(!questionAccepted(translation,'she'));
 const altered=structuredClone(exerciseContent);altered.sentences[0].tokens.push('v28');assert(validateExercises(altered,vocab,lessons).some(e=>e.includes('outside lesson')));
 const cyclic=structuredClone(exerciseContent);cyclic.scenarios[0].nodes[0].options[0].next='step-1';assert(validateExercises(cyclic,vocab,lessons).some(e=>e.includes('cyclic')));
 const state={words:starter,days:{},games:{}};const target=buildPracticeQuestions('choice',starter)[0],now=Date.now();
 recordPracticeAttempt(state,target,false,{now,lesson:'*'});assert.equal(state.practice.items[target.id].errors,1);
 assert(!buildPracticeQuestions('mistakes',starter,'*',{},state.practice.items).some(q=>q.id===target.id));
 state.practice.items[target.id].next=0;assert(buildPracticeQuestions('mistakes',starter,'*',{},state.practice.items).some(q=>q.id===target.id));
 recordPracticeAttempt(state,target,true,{now:now+60001});assert.equal(state.practice.items[target.id].next,now+60001+86400000);
 recordPracticeAttempt(state,target,true,{assisted:true,now:now+60002});assert.equal(state.practice.items[target.id].correct,1);assert.equal(state.practice.items[target.id].assisted,1);
 assert(recordPracticeSession(state,{id:'test'}));assert(!recordPracticeSession(state,{id:'test'}));assert.equal(JSON.parse(JSON.stringify(state)).practice.items[target.id].errors,1);
 assert.deepEqual(practiceHistory({practice:null}),{version:1,items:{},sessions:[]});
 console.log('PASS 15 activity contracts; five lesson boundaries; validated sentences/readings/branches; adaptive skill mix; ambiguous audio exclusion; tone-sensitive answers; mistake cooldown; additive progress and session deduplication');
})().catch(e=>{console.error(e);process.exitCode=1});
