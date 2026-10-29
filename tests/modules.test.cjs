const vm=require('vm'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {boot}=require('./regression.cjs');const app=boot(),context=app.context,cache=new Map();
function load(file){file=path.resolve(file);if(!cache.has(file))cache.set(file,new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{context,identifier:file}));return cache.get(file)}
(async()=>{
 const entry=load('dist/js/app.js');await entry.link((specifier,parent)=>load(path.resolve(path.dirname(parent.identifier),specifier)));await entry.evaluate();
 const runtime=load('dist/js/state/app-state.js').namespace.runtime;
 assert.equal(runtime.state.words.length,174);
 const center=load('dist/js/learning/center.js').namespace,lessons=load('dist/js/data/generated-content.js').namespace.contentLessons;
 center.renderLearningCenter();assert.equal(context.document.getElementById('learningCards').children.length,6);
 center.launchLearningActivity('quiz',lessons[0]);assert.equal(context.document.getElementById('quizSection').value,lessons[0].section);
 center.launchLearningActivity('learn',null);assert.equal(runtime.learningWords.length,174);assert.equal(runtime.learningAll,true);
 const activities=load('dist/js/learning/activities.js').namespace;
 const host=context.document.getElementById('practice');
 const button=text=>host.querySelectorAll('button').find(b=>b.textContent===text);
 activities.showActivityMenu(lessons[0]);assert.equal(host.querySelectorAll('.activity-card').length,15);
 activities.showActivitySettings('choice');button('Start activity').click();
 const option=host.querySelectorAll('.exercise-options')[0].children[0];option.click();
 assert.equal(Object.keys(runtime.state.practice.items).length,1);const first=Object.values(runtime.state.practice.items)[0];const scored=first.correct+first.errors;option.click();assert.equal(first.correct+first.errors,scored);
 button('End session').click();assert.equal(runtime.state.practice.sessions.length,1);
 const attempts=Object.keys(runtime.state.practice.items).length;
 activities.showActivitySettings('dictation');button('Start activity').click();
 await button('Play / Repeat audio').onclick();
 assert(host.querySelectorAll('div').some(n=>n.textContent?.includes('No Mandarin voice')));
 button('Check answer').click();assert.equal(Object.keys(runtime.state.practice.items).length,attempts);
 button('Skip without penalty').click();button('End session').click();assert.equal(runtime.state.practice.sessions.length,1);
 // Builder uses authored sentence order; repeated word tiles remain distinct controls.
 activities.showActivitySettings('builder');button('Start activity').click();
 const content=load('dist/js/data/generated-exercises.js').namespace.exerciseContent;
 const sentence=content.sentences.find(s=>host.querySelectorAll('h3').some(n=>n.textContent===s.english));assert(sentence);
 const bank=host.querySelectorAll('.word-bank')[0];
 for(const id of sentence.tokens){const word=runtime.state.words.find(w=>w.id===id);bank.children.find(b=>!b.disabled&&b.textContent===word.hanzi.split('/')[0].trim()).click()}
 button('Check answer').click();assert.equal(runtime.state.practice.items['builder:'+sentence.id].correct,1);button('End session').click();
 // Reader integration uses the existing renderer and records comprehension exactly once.
 activities.showActivitySettings('reading');button('Start activity').click();button('Check comprehension').click();
 for(const field of host.querySelectorAll('fieldset'))field.querySelectorAll('button')[0].click();
 const submit=button('Submit answers');submit.click();submit.click();
 assert.equal(runtime.state.practice.sessions.filter(s=>s.activity==='reading').length,1);
 assert.equal(runtime.state.practice.sessions.find(s=>s.activity==='reading').correct,4);
 // A wrong roleplay response follows an authored recovery branch.
 activities.showActivityMenu(lessons[0]);activities.showActivitySettings('roleplay');button('Start activity').click();
 const scene=content.scenarios.find(s=>s.lesson===lessons[0].id),node=scene.nodes.find(n=>n.id===scene.start);
 const wrong=node.options.find(o=>!o.correct),wrongLine=content.sentences.find(s=>s.id===wrong.sentence);
 button(wrongLine.text).click();button('Continue').click();assert(host.querySelectorAll('h3').some(n=>n.textContent?.startsWith('Try this line:')));button('Continue').click();button('End session').click();
 assert.equal(runtime.state.practice.items['roleplay:'+scene.id+':'+node.id].errors,1);
 // Timed audio latency never spends answering time; stale audio cannot score after navigation.
 const utterances=[];context.window.speechSynthesis={getVoices:()=>[{lang:'zh-CN'}],speak:u=>utterances.push(u),cancel:()=>{}};context.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
 activities.showActivitySettings('timed');button('Start activity').click();const tick=app.timers[app.timers.length-1];
 let play=button('Play / Repeat audio');while(!play){button('Skip without penalty').click();play=button('Play / Repeat audio')}const pending=play.onclick();app.advance(61000);tick();assert(button('End session'));utterances.at(-1).onend();await pending;
 app.advance(61000);tick();assert(host.querySelectorAll('h2').some(n=>n.textContent==='Session results'));
 const count=runtime.state.practice.sessions.length;tick();assert.equal(runtime.state.practice.sessions.length,count);
 const memory=load('dist/js/games/memory.js').namespace;context.document.getElementById('memorySection').value=lessons[0].section;context.document.getElementById('memoryFormat').value='hanzi-pinyin';
 assert(memory.memoryPool().every(w=>!['v1','v2'].includes(w.id)));
 assert(JSON.parse(app.storage.get('hanzi-daily-v1')).practice);
 console.log('PASS native ES module graph; 15 activity menus; single-answer scoring; missing-audio skip; authored word bank; reader comprehension; roleplay recovery; audio-excluded timing; unambiguous pinyin matching; persisted practice history');
})().catch(e=>{console.error(e);process.exitCode=1});
