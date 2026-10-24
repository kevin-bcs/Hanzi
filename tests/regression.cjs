const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const source=fs.readFileSync('dist/app.js','utf8'),html=fs.readFileSync('dist/index.html','utf8');
function boot(saved){const elements=new Map(),storage=new Map(saved?[["hanzi-daily-v1",JSON.stringify(saved)]]:[]),timers=[];
class Element{constructor(){this.value='';this.children=[];this.dataset={};this.style={};this.classList={add(){},remove(){},contains(){return false},toggle(){}}}set innerHTML(v){this.html=v;for(const m of v.matchAll(/id="([^"]+)"/g))elements.set(m[1],new Element())}get options(){return this.children}append(...x){this.children.push(...x);if(this.children.length===1&&x[0].value)this.value=x[0].value}replaceChildren(){this.children=[]}setAttribute(){}click(){this.onclick?.()}reset(){}}
for(const m of html.matchAll(/id="([^"]+)"/g))elements.set(m[1],new Element());elements.get('pairCount').value='4';elements.get('quizCount').value='10';elements.get('toneMenuLength').value='any';
const ctx=vm.createContext({document:{getElementById:id=>elements.get(id)||null,createElement:()=>new Element(),querySelectorAll:()=>[]},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{},crypto,Intl,Date,console,Blob,URL,confirm:()=>true,alert:()=>{},prompt:()=>null,setTimeout:f=>timers.push(f),setInterval:()=>{},FormData:class{constructor(){return new Map()}}});vm.runInContext(source,ctx);return {run:s=>vm.runInContext(s,ctx),elements,storage,timers};}
let app=boot();assert.equal(app.run('state.words.length'),174);assert.equal(app.run("state.words.filter(w=>inSection(w,'Lesson 5 · Numbers, money & dates')).length"),37);
assert.equal(app.run('new Set(state.words.map(w=>w.id)).size'),174);
const first=app.run('current.id');app.elements.get('skipCard').click();assert.notEqual(app.run('current.id'),first);
app.run("revealCard();rate('good')");assert.equal(app.run('todayCount()'),1);
app.run("go('words');renderRows()");const removed=app.run('state.words[0].hanzi');app.elements.get('wordRows').children[0].children[5].children[1].click();let saved=JSON.parse(app.storage.get('hanzi-daily-v1'));app=boot(saved);assert.equal(app.run(`state.words.some(w=>w.hanzi===${JSON.stringify(removed)})`),false);
app.run("importData({words:[{hanzi:'测试',pinyin:'cè shì',meaning:'test',section:'Custom',due:9999999999999,interval:8,errors:2}],days:{'2026-1-1':12},games:{quiz:5}})");assert.equal(app.run("state.words.find(w=>w.hanzi==='测试').interval"),8);assert.equal(app.run('state.games.quiz'),5);
const count=app.run('state.words.length');assert.throws(()=>app.run("importData({words:[{hanzi:'bad'}]})"));assert.equal(app.run('state.words.length'),count);
app.run("startGame('memory')");assert.equal(app.run('gameState.deck.length'),8);app.run("flip(0);flip(gameState.deck.findIndex((x,i)=>i!==0&&x.id===gameState.deck[0].id))");assert.equal(app.run('gameState.matches.size'),1);
app.run("startGame('quiz')");assert.equal(app.elements.get('quizopts').children.length,4);app.run("startGame('tone')");assert.ok(app.elements.get('toneButtons').children.length===5);
assert.equal(app.run("say('你好')"),false);assert.match(app.elements.get('audioStatus').textContent,/No Chinese voice/);
app.run("go('study')");assert.equal(app.run('activeGame'),'');
console.log('PASS: startup, 174 words, Lesson 5, unique IDs, skip, review scheduling, persistent deletion, backup schedules/scores, invalid imports, memory pairs, quiz, tones, audio fallback, navigation.');
app=boot();assert.equal(app.elements.get('memoryLessons').children.length,5);assert.ok(app.elements.get('memorySection').options.every(o=>o.value!=='*'));
for(const [index,count]of [18,17,23,27,37].entries()){
 app.elements.get('memoryLessons').children[index].click();
 assert.equal(app.run("group('memorySection').length"),count);
 app.run("startGame('memory')");assert.equal(app.run("gameState.deck.every(c=>inSection(c.word,$('memorySection').value))"),true);
 app.run("flip(gameState.deck.findIndex(c=>c.side==='en'))");
 const position=app.run("gameState.deck.findIndex(c=>c.side==='en')");const tile=app.elements.get('board').children[position];
 assert.equal(tile.children[0].textContent,app.run('gameState.deck['+position+'].word.pinyin'));assert.equal(tile.children[1].textContent,app.run('gameState.deck['+position+'].word.meaning'));
 app.run("$('quizSection').value=$('memorySection').value;startGame('quiz')");assert.equal(app.run("quizList.every(w=>inSection(w,$('quizSection').value))"),true);
 app.run("startGame('tone')");assert.equal(app.run("inSection(toneWord,$('toneSection').value)"),true);
}
console.log('PASS: five separate lessons with exact counts; memory, quiz and tones confined to selected lesson; pinyin and English on paired cards.');

app=boot();app.run("$('memorySection').value='Lesson 5 · Numbers, money & dates';$('quizSection').value='Lesson 2 · People & descriptions';$('toneSection').value='Pronunciation · Tone exercises';$('quizCount').value='5';openGameMenu('quiz');startGame('quiz')");assert.equal(app.run('quizList.length'),5);assert.equal(app.run("quizList.every(w=>inSection(w,'Lesson 2 · People & descriptions'))"),true);app.run("openGameMenu('tone');startGame('tone')");assert.equal(app.run("inSection(toneWord,'Pronunciation · Tone exercises')"),true);app.run("openGameMenu('memory');startGame('memory')");assert.equal(app.run("gameState.deck.every(c=>inSection(c.word,'Lesson 5 · Numbers, money & dates'))"),true);app.elements.get('backGames').click();assert.equal(app.run('activeGame'),'');app.elements.get('memoryHome').click();assert.equal(app.run('activeGame'),'');console.log('PASS: independent settings, quiz length, tone pool, menu returns and clean game transitions.');
