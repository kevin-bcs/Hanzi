const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const {ensureLearning,recordLearningAttempt,recordLearningCompletion,wordMastery,skillMastery,learningSkill,learningSummary,lessonLearningSummary,learningQuestionPriority,validateLearningData,learningDayMs:DAY,learningDay}=await import('../dist/js/learning/srs.js');
 const state={words:Array.from({length:30},(_,i)=>({id:'w'+i,due:0,interval:0,errors:0})),practice:{version:1,items:{},sessions:[]},days:{old:42}};
 const base=new Date(2026,9,1,12).getTime();const original=JSON.stringify(state.words),q={id:'choice:w0',type:'choice',wordIds:['w0']};
 ensureLearning(state,base);assert.equal(state.learning.xp,0);assert.equal(learningSummary(state,state.words,base).streak,0);assert.deepEqual(state.days,{old:42});
 assert.equal(recordLearningAttempt(state,q,true,{now:base}).xp,8);let skill=state.learning.words.w0.skills.recognition;
 assert.equal(skill.next,base+DAY);assert.equal(skill.correct,1);assert(!wordMastery(state.learning,'w0',base).mastered);
 assert.equal(recordLearningAttempt(state,{...q,id:'picture:w0',type:'picture'},true,{now:base+1000}).xp,0);assert.equal(skill.correct,1);assert.equal(skill.next,base+DAY);
 recordLearningAttempt(state,q,true,{assisted:true,now:base+2000});assert.equal(skill.correct,1);assert.equal(skill.assisted,1);
 // Separate skills have independent intervals; pinyin and character choices are not hanzi production.
 const listening={id:'listening:w0',type:'listening',wordIds:['w0']};recordLearningAttempt(state,listening,true,{now:base});assert.equal(state.learning.words.w0.skills.listening.correct,1);
 assert.equal(learningSkill({id:'dictation:w0:pinyin',type:'dictation',input:'pinyin'}),'listening');assert.equal(learningSkill({id:'dictation:w0:characters',type:'dictation',input:'characters'}),'recognition');assert.equal(learningSkill({id:'translation:w0:en-zh',type:'translation',input:'text'}),'writing');
 let now=base+DAY;for(let i=0;i<4;i++){recordLearningAttempt(state,q,true,{now});recordLearningAttempt(state,listening,true,{now});recordLearningAttempt(state,{id:'dictation:w0:hanzi',type:'dictation',wordIds:['w0'],input:'hanzi'},true,{now});now=state.learning.words.w0.skills.recognition.next}
 assert(wordMastery(state.learning,'w0',now-1).mastered);assert(wordMastery(state.learning,'w0',now+200*DAY).percent<wordMastery(state.learning,'w0',now-1).percent);
 recordLearningAttempt(state,q,false,{now:now-1000});assert(!wordMastery(state.learning,'w0',now).mastered);assert.equal(skill.stage,0);assert.equal(skill.next,now-1000+60000);
 const corrected=recordLearningAttempt(state,q,true,{now:now+60000});assert.equal(corrected.xp,0);assert.equal(skill.stage,0);
 const fresh={words:state.words};for(let i=0;i<25;i++)recordLearningAttempt(fresh,{id:'choice:w'+i,type:'choice',wordIds:['w'+i]},true,{now:base});assert.equal(fresh.learning.xp,120);assert.equal(fresh.learning.days[learningDay(base)].xp,120);
 const habits={words:state.words};for(let d=0;d<3;d++)for(let i=0;i<3;i++)recordLearningAttempt(habits,{id:'reflection:'+i,type:'speaking',wordIds:['w'+i]},true,{assisted:true,now:base+d*DAY});assert.equal(learningSummary(habits,habits.words,base+2*DAY).streak,3);assert.equal(habits.learning.xp,0);assert(habits.learning.achievements['three-day']);assert.equal(learningSummary(habits,habits.words,base+4*DAY).streak,0);
 // The streak counter outlives the rolling 400-day ledger.
 for(let d=3;d<405;d++)for(let i=0;i<3;i++)recordLearningAttempt(habits,{id:'reflection:'+i,type:'speaking',wordIds:['w'+i]},true,{assisted:true,now:base+d*DAY});assert.equal(learningSummary(habits,habits.words,base+404*DAY).streak,405);assert.equal(Object.keys(habits.learning.days).length,400);
 recordLearningCompletion(fresh,{activity:'choice',lesson:'l1',completed:false,correct:5,date:new Date(base).toISOString()});assert(!fresh.learning.completed.l1);
 recordLearningCompletion(fresh,{activity:'choice',lesson:'l1',completed:true,correct:5,date:new Date(base).toISOString()});assert.equal(lessonLearningSummary(fresh,fresh.words,'l1',['choice','listening'],base).completed,1);
 const legacy={words:[{id:'old',interval:10,due:base+5*DAY}]};recordLearningAttempt(legacy,{id:'choice:old',type:'choice',wordIds:['old']},true,{now:base});assert.equal(legacy.learning.xp,0);assert.equal(legacy.learning.words.old.skills.recognition.next,base+5*DAY);assert.equal(legacy.words[0].due,base+5*DAY);
 assert(learningQuestionPriority(listening,state.learning,now+DAY)>learningQuestionPriority(listening,state.learning,base));
 assert.equal(JSON.stringify(state.words),original);validateLearningData(state.learning);const roundtrip=JSON.parse(JSON.stringify(state));validateLearningData(roundtrip.learning);assert.equal(roundtrip.learning.xp,state.learning.xp);
 const invalid=structuredClone(state.learning);invalid.words.w0.skills.recognition.next=-1;assert.throws(()=>validateLearningData(invalid));const bad=structuredClone(state.learning);bad.xp=NaN;assert.throws(()=>validateLearningData(bad));
 const html=fs.readFileSync('dist/index.html','utf8');assert(html.includes('Skip to learning content'));assert(html.includes('id="dailyPractice"'));for(const match of html.matchAll(/href="(css\/[^"]+)"/g))assert(fs.existsSync('dist/'+match[1]));
 console.log('PASS spaced skill intervals, mastery evidence/decay/lapse, XP caps and repeat protection, aided exclusions, daily goal/streak, 400-day rollover, completion, legacy migration, backup validation and UI asset/skip-link contracts');
})().catch(e=>{console.error(e);process.exitCode=1});
