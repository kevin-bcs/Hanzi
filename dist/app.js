'use strict';
const $=id=>document.getElementById(id),KEY='hanzi-daily-v1';
const raw=[
['你','nǐ','you','Lesson 1 · First words','pronoun'],
['他','tā','he; him','Lesson 1 · First words','pronoun'],['她','tā','she; her','Lesson 1 · First words','pronoun'],
['不','bù','no; not','Lesson 1 · First words','adverb'],['来','lái','come','Lesson 1 · First words','verb'],
['爱','ài','love','Lesson 1 · First words','verb'],['买','mǎi','buy','Lesson 1 · First words','verb'],['卖','mài','sell','Lesson 1 · First words','verb'],
['读','dú','read','Lesson 1 · First words','verb'],['爸爸','bà ba','dad','Lesson 1 · First words','family'],['妈妈','mā ma','mom','Lesson 1 · First words','family'],
['笔','bǐ','pen','Lesson 1 · First words','noun'],['猫','māo','cat','Lesson 1 · First words','noun'],['包','bāo','bag','Lesson 1 · First words','noun'],
['报','bào','newspaper','Lesson 1 · First words','noun'],['衣服','yī fu','clothes','Lesson 1 · First words','noun'],['地图','dì tú','map','Lesson 1 · First words','noun'],
['吗','ma','question particle (at the end of a yes/no question)','Lesson 1 · First words','particle'],
...['一|yī|one','二|èr|two','三|sān|three','四|sì|four','五|wǔ|five','六|liù|six','七|qī|seven','八|bā|eight','九|jiǔ|nine','十|shí|ten'].map(x=>{let[a,b,c]=x.split('|');return[a,b,c,'Numbers','number']}),
['我','wǒ','I; me','Lesson 2 · People & descriptions','pronoun'],['我们','wǒ men','we; us','Lesson 2 · People & descriptions','pronoun'],
['你们','nǐ men','you (plural)','Lesson 2 · People & descriptions','pronoun'],['他们','tā men','they; them (masculine or mixed)','Lesson 2 · People & descriptions','pronoun'],
['她们','tā men','they; them (feminine)','Lesson 2 · People & descriptions','pronoun'],['的','de','structural particle; links a modifier to a noun','Lesson 2 · People & descriptions','particle'],
['哥哥','gē ge','older brother','Lesson 2 · People & descriptions','family'],['弟弟','dì di','younger brother','Lesson 2 · People & descriptions','family'],
['妹妹','mèi mei','younger sister','Lesson 2 · People & descriptions','family'],['很','hěn','very','Lesson 2 · People & descriptions','adverb'],
['好','hǎo','good; okay','Lesson 2 · People & descriptions','adjective'],['忙','máng','busy','Lesson 2 · People & descriptions','adjective'],
['累','lèi','tired','Lesson 2 · People & descriptions','adjective'],['困','kùn','sleepy','Lesson 2 · People & descriptions','adjective'],
['高','gāo','tall; high','Lesson 2 · People & descriptions','adjective'],['贵','guì','expensive','Lesson 2 · People & descriptions','adjective'],
['好看','hǎo kàn','good-looking; interesting','Lesson 2 · People & descriptions','adjective'],
['爷爷','yé ye','grandpa','Lesson 3 · Daily words','family'],['奶奶','nǎi nai','grandma','Lesson 3 · Daily words','family'],
['姐姐','jiě jie','older sister','Lesson 3 · Daily words','family'],['喝','hē','drink','Lesson 3 · Daily words','verb'],
['看','kàn','look at; watch','Lesson 3 · Daily words','verb'],['听','tīng','listen','Lesson 3 · Daily words','verb'],
['写','xiě','write','Lesson 3 · Daily words','verb'],['学习','xué xí','study; learn','Lesson 3 · Daily words','verb'],
['喜欢','xǐ huan','like','Lesson 3 · Daily words','verb'],['咖啡','kā fēi','coffee','Lesson 3 · Daily words','food & drink'],
['牛奶','niú nǎi','milk','Lesson 3 · Daily words','food & drink'],['啤酒','pí jiǔ','beer','Lesson 3 · Daily words','food & drink'],
['电影','diàn yǐng','film; movie','Lesson 3 · Daily words','noun'],['电脑','diàn nǎo','computer','Lesson 3 · Daily words','noun'],
['音乐','yīn yuè','music','Lesson 3 · Daily words','noun'],['汉语','Hàn yǔ','Chinese language','Lesson 3 · Daily words','language'],
['英语','Yīng yǔ','English language','Lesson 3 · Daily words','language'],['难','nán','difficult','Lesson 3 · Daily words','adjective'],
['便宜','pián yi','cheap','Lesson 3 · Daily words','adjective'],['谢谢','xiè xie','thank you','Lesson 3 · Daily words','expression'],
['不客气','bú kè qi','you are welcome','Lesson 3 · Daily words','expression'],['对不起','duì bu qǐ','sorry; excuse me','Lesson 3 · Daily words','expression'],
['没关系','méi guān xi','it does not matter','Lesson 3 · Daily words','expression'],
['您','nín','you (respectful)','Lesson 4 · Questions & everyday words','pronoun'],['这','zhè','this','Lesson 4 · Questions & everyday words','pronoun'],
['那','nà','that','Lesson 4 · Questions & everyday words','pronoun'],['这儿 / 这里','zhèr / zhè lǐ','here','Lesson 4 · Questions & everyday words','place'],
['那儿 / 那里','nàr / nà lǐ','there','Lesson 4 · Questions & everyday words','place'],['什么','shén me','what','Lesson 4 · Questions & everyday words','question word'],
['谁','shéi / shuí','who','Lesson 4 · Questions & everyday words','question word'],['哪儿 / 哪里','nǎr / nǎ lǐ','where','Lesson 4 · Questions & everyday words','question word'],
['是','shì','be; yes','Lesson 4 · Questions & everyday words','verb'],['去','qù','go','Lesson 4 · Questions & everyday words','verb'],
['回','huí','return; go back','Lesson 4 · Questions & everyday words','verb'],['吃','chī','eat','Lesson 4 · Questions & everyday words','verb'],
['说','shuō','say; speak','Lesson 4 · Questions & everyday words','verb'],['书','shū','book','Lesson 4 · Questions & everyday words','noun'],
['手机','shǒu jī','mobile phone','Lesson 4 · Questions & everyday words','noun'],['电视','diàn shì','television','Lesson 4 · Questions & everyday words','noun'],
['老师','lǎo shī','teacher','Lesson 4 · Questions & everyday words','people'],['学生','xué sheng','student','Lesson 4 · Questions & everyday words','people'],
['朋友','péng you','friend','Lesson 4 · Questions & everyday words','people'],['家','jiā','family; home','Lesson 4 · Questions & everyday words','place'],
['商店','shāng diàn','shop; store','Lesson 4 · Questions & everyday words','place'],['学校','xué xiào','school','Lesson 4 · Questions & everyday words','place'],
['水','shuǐ','water','Lesson 4 · Questions & everyday words','food & drink'],['茶','chá','tea','Lesson 4 · Questions & everyday words','food & drink'],
['水果','shuǐ guǒ','fruit','Lesson 4 · Questions & everyday words','food & drink'],['饭','fàn','meal; rice','Lesson 4 · Questions & everyday words','food & drink'],
['面包','miàn bāo','bread','Lesson 4 · Questions & everyday words','food & drink'],
['中国','Zhōng guó','China','Countries','proper noun'],['美国','Měi guó','United States','Countries','proper noun'],
['日本','Rì běn','Japan','Countries','proper noun'],['韩国','Hán guó','South Korea','Countries','proper noun'],
// The original starter words remain available for learners who already used the page.
['你好','nǐ hǎo','hello','Starter words','expression'],['再见','zài jiàn','goodbye','Starter words','expression'],
['今天','jīn tiān','today','Starter words','time'],['明天','míng tiān','tomorrow','Starter words','time'],
['现在','xiàn zài','now','Starter words','time'],['上海','Shàng hǎi','Shanghai','Starter words','place'],
['多少钱','duō shao qián','how much does it cost?','Starter words','question'],['宿舍','sù shè','dormitory','Starter words','place'],
['图书馆','tú shū guǎn','library','Starter words','place'],['不知道','bù zhī dào','do not know','Starter words','expression'],
['可以','kě yǐ','can; may','Starter words','expression'],['米饭','mǐ fàn','cooked rice','Starter words','food & drink'],
["零", "líng", "zero", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["一", "yī", "one", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["二", "èr", "two", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["三", "sān", "three", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["四", "sì", "four", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["五", "wǔ", "five", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["六", "liù", "six", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["七", "qī", "seven", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["八", "bā", "eight", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["九", "jiǔ", "nine", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["十", "shí", "ten", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["百", "bǎi", "hundred", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["千", "qiān", "thousand", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["万", "wàn", "ten thousand", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["两", "liǎng", "two (before measure words)", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["个", "gè", "general measure word", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["本", "běn", "measure word for books", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["页", "yè", "page", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["杯 / 杯子", "bēi / bēi zi", "cup; glass", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["瓶 / 瓶子", "píng / píng zi", "bottle", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["多少", "duō shao", "how much; how many", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["几", "jǐ", "how many; how much", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["钱", "qián", "money", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["块", "kuài", "yuan (colloquial)", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["元", "yuán", "yuan (RMB unit)", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["毛", "máo", "one tenth of a yuan (colloquial)", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["角", "jiǎo", "one tenth of a yuan", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["今天", "jīn tiān", "today", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["昨天", "zuó tiān", "yesterday", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["明天", "míng tiān", "tomorrow", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["年", "nián", "year", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["月", "yuè", "month", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["日", "rì", "day; date", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["号", "hào", "date; number", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["星期", "xīng qī", "week", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["星期天 / 星期日", "xīng qī tiān / xīng qī rì", "Sunday", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["再见", "zài jiàn", "goodbye; see you again", "Lesson 5 · Numbers, money & dates", "vocabulary"],
["观看", "guān kàn", "watch", "Pronunciation · g / k", "pronunciation"],
["开关", "kāi guān", "switch", "Pronunciation · g / k", "pronunciation"],
["功课", "gōng kè", "homework; schoolwork", "Pronunciation · g / k", "pronunciation"],
["空格", "kòng gé", "blank space", "Pronunciation · g / k", "pronunciation"],
["苛刻", "kē kè", "harsh; excessively demanding", "Pronunciation · g / k", "pronunciation"],
["哥哥", "gē ge", "older brother", "Pronunciation · g / k", "pronunciation"],
["粉红", "fěn hóng", "pink", "Pronunciation · f / h", "pronunciation"],
["寒风", "hán fēng", "cold wind", "Pronunciation · f / h", "pronunciation"],
["恢复", "huī fù", "recover; restore", "Pronunciation · f / h", "pronunciation"],
["飞虎", "Fēi hǔ", "Flying Tigers", "Pronunciation · f / h", "pronunciation"],
["黄海", "Huáng hǎi", "the Yellow Sea", "Pronunciation · f / h", "pronunciation"],
["方法", "fāng fǎ", "method", "Pronunciation · f / h", "pronunciation"],
["前头", "qián tou", "in front; ahead", "Pronunciation · Final sounds", "pronunciation"],
["拳头", "quán tou", "fist", "Pronunciation · Final sounds", "pronunciation"],
["有钱", "yǒu qián", "have money; be rich", "Pronunciation · Final sounds", "pronunciation"],
["有权", "yǒu quán", "have power or authority", "Pronunciation · Final sounds", "pronunciation"],
["演员", "yǎn yuán", "actor; performer", "Pronunciation · Final sounds", "pronunciation"],
["全面", "quán miàn", "comprehensive; all-round", "Pronunciation · Final sounds", "pronunciation"],
["节约", "jié yuē", "save; economize", "Pronunciation · ie / üe", "pronunciation"],
["解决", "jiě jué", "solve; resolve", "Pronunciation · ie / üe", "pronunciation"],
["血液", "xuè yè", "blood", "Pronunciation · ie / üe", "pronunciation"],
["确切", "què qiè", "exact; precise", "Pronunciation · ie / üe", "pronunciation"],
["音乐", "yīn yuè", "music", "Pronunciation · ie / üe", "pronunciation"],
["营业", "yíng yè", "conduct business; be open for business", "Pronunciation · ie / üe", "pronunciation"],
["西班牙", "Xī bān yá", "Spain", "Pronunciation · Tone exercises", "pronunciation"],
["意大利", "Yì dà lì", "Italy", "Pronunciation · Tone exercises", "pronunciation"],
["等一下", "děng yí xià", "wait a moment", "Pronunciation · Tone exercises", "pronunciation"],
["听不懂", "tīng bu dǒng", "cannot understand what is heard", "Pronunciation · Tone exercises", "pronunciation"],
["麦当劳", "Mài dāng láo", "McDonald’s", "Pronunciation · Tone exercises", "pronunciation"],
["国庆节", "Guó qìng Jié", "National Day", "Pronunciation · Tone exercises", "pronunciation"],
["巧克力", "qiǎo kè lì", "chocolate", "Pronunciation · Tone exercises", "pronunciation"],
["冰淇淋", "bīng qí lín", "ice cream", "Pronunciation · Tone exercises", "pronunciation"],
["博物馆", "bó wù guǎn", "museum", "Pronunciation · Tone exercises", "pronunciation"],
["电影院", "diàn yǐng yuàn", "cinema; movie theater", "Pronunciation · Tone exercises", "pronunciation"],
["明信片", "míng xìn piàn", "postcard", "Pronunciation · Tone exercises", "pronunciation"],
["普通话", "pǔ tōng huà", "Standard Mandarin", "Pronunciation · Tone exercises", "pronunciation"],
["营业员", "yíng yè yuán", "shop assistant", "Pronunciation · Tone exercises", "pronunciation"],
["服务员", "fú wù yuán", "waiter; service attendant", "Pronunciation · Tone exercises", "pronunciation"],
["夏令营", "xià lìng yíng", "summer camp", "Pronunciation · Tone exercises", "pronunciation"],
["开玩笑", "kāi wán xiào", "joke; make a joke", "Pronunciation · Tone exercises", "pronunciation"],
["玩", "wán", "play; have fun", "Pronunciation · Spelling examples", "pronunciation"]
];
const starter=raw.map((r,i)=>({id:'v'+i,hanzi:r[0],pinyin:r[1],meaning:r[2],category:r[4],section:r[3],example:'',due:0,interval:0,errors:0}));
let state={words:[],days:{},games:{},version:2};try{const old=JSON.parse(localStorage.getItem(KEY));if(old&&Array.isArray(old.words))state={...state,...old,days:old.days||{},games:old.games||{},words:old.words}}catch{}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{if($('storageWarning'))$('storageWarning').classList.remove('hidden');return false}}
function memberships(w){return [...new Set([w.section||'My words',...(Array.isArray(w.sections)?w.sections.filter(x=>typeof x==='string'):[])])]}
function inSection(w,f){return f==='*'||memberships(w).includes(f)}
function mergeStarter(){for(const w of starter){if(state.deleted.includes(w.hanzi))continue;let found=state.words.find(x=>x.hanzi===w.hanzi);if(found){found.sections=[...new Set([...memberships(found),w.section])];for(const k of ['category','meaning','pinyin'])if(!found[k])found[k]=w[k];found.errors=found.errors||0}else state.words.push({...w,sections:[w.section]})}state.version=3;save()}

state.deleted=Array.isArray(state.deleted)?state.deleted:[];
state.words=state.words.filter(w=>w&&typeof w.hanzi==='string'&&typeof w.pinyin==='string'&&typeof w.meaning==='string');
mergeStarter();
const seenIds=new Set();
for(const w of state.words){if(!w.id||seenIds.has(w.id))w.id=crypto.randomUUID();seenIds.add(w.id);for(const k of ['due','interval','errors'])if(!Number.isFinite(w[k])||w[k]<0)w[k]=0;}
save();
const day=()=>{let d=new Date;return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
function sections(){return [...new Set(state.words.flatMap(memberships))].sort()}
function fillSelect(el,all=true,chosen='All sections'){el.replaceChildren();if(all){let o=document.createElement('option');o.value='*';o.textContent='All sections';el.append(o)}for(const s of sections()){let o=document.createElement('option');o.value=s;o.textContent=s;el.append(o)}if([...el.options].some(o=>o.textContent===chosen))el.value=[...el.options].find(o=>o.textContent===chosen).value}
function fillGameSections(){
 const ordered=sections().sort((a,b)=>Number(!a.startsWith('Lesson '))-Number(!b.startsWith('Lesson '))||a.localeCompare(b));
 for(const type of ['memory','quiz','tone']){const select=$(type+'Section'),old=select.value;select.replaceChildren();
 if(type==='tone'){const o=document.createElement('option');o.value='*';o.textContent='All vocabulary';select.append(o)}
 for(const section of ordered){const o=document.createElement('option');o.value=section;o.textContent=section;select.append(o)}
 select.value=ordered.includes(old)?old:type==='tone'?'*':ordered[0]||'';
 if(type!=='tone')renderLessonButtons(type);
 }
}
function renderLessonButtons(type){
 const picker=$(type+'Lessons');picker.replaceChildren();
 for(const section of sections().filter(s=>s.startsWith('Lesson '))){const b=document.createElement('button');b.className='lesson-choice'+($(type+'Section').value===section?' selected':'');b.setAttribute('aria-pressed',String($(type+'Section').value===section));
 const title=document.createElement('strong');title.textContent=section.split(' · ')[0];const count=document.createElement('small');count.textContent=state.words.filter(w=>inSection(w,section)).length+' words';b.append(title,count);b.onclick=()=>{$(type+'Section').value=section;renderLessonButtons(type)};picker.append(b)}
}
function currentFilter(which){return $(which).value}
function group(which){let f=currentFilter(which);return state.words.filter(w=>inSection(w,f))}
function todayCount(){return state.days[day()]||0}
function updateStats(){$('wordCount').textContent=state.words.length;$('dueCount').textContent=state.words.filter(w=>(w.due||0)<=Date.now()).length;$('reviewCount').textContent=todayCount();$('dailyGoal').textContent=Math.min(todayCount(),10)+' / 10 daily reviews';$('dailyBar').style.width=Math.min(todayCount()*10,100)+'%'}
fillSelect($('studyFilter'));fillGameSections();fillSelect($('wordFilter'));
let skipped=new Set();
function chooseDue(){let pool=group('studyFilter').filter(w=>(w.due||0)<=Date.now()).sort((a,b)=>(a.due||0)-(b.due||0));let next=pool.find(w=>!skipped.has(w.id));if(!next&&pool.length){skipped.clear();next=pool[0]}return next||null}
let current=null,shown=false;
function renderCard(){current=chooseDue();shown=false;$('flashHint').textContent='Think of the meaning, then tap to reveal';updateStats();$('flashAnswer').classList.add('hidden');$('rateControls').classList.add('hidden');$('showControls').classList.remove('hidden');$('studyFeedback').textContent='';if(!current){$('flashHanzi').textContent='完成';$('flashPinyin').textContent='';$('flashMeaning').textContent=group('studyFilter').length?'All caught up':'No words in this section yet';$('flashExample').textContent='Choose another section or add vocabulary.';$('studysection').textContent='Session complete';$('flashAnswer').classList.remove('hidden');$('showControls').classList.add('hidden');$('speakCard').disabled=true;return}$('speakCard').disabled=false;$('studysection').textContent=current.section||'My words';$('flashHanzi').textContent=current.hanzi;$('flashPinyin').textContent=current.pinyin;$('flashMeaning').textContent=current.meaning;$('flashExample').textContent=current.example||'';document.querySelectorAll('[data-rate]').forEach(b=>{const kind=b.dataset.rate;const days=kind==='good'?Math.max(1,(current.interval||0)*2):Math.max(3,(current.interval||0)*3);b.textContent=kind==='again'?'Again · 1 min':(kind==='good'?'Got it':'Easy')+' · '+days+' days'})}
function revealCard(){if(!current)return;shown=true;$('flashAnswer').classList.remove('hidden');$('showControls').classList.add('hidden');$('rateControls').classList.remove('hidden');$('flashHint').textContent='How well did you remember it?'}
function rate(v){if(!current||!shown)return;if(v==='again')current.errors=(current.errors||0)+1;let interval=v==='again'?0:v==='good'?Math.max(1,(current.interval||0)*2):Math.max(3,(current.interval||0)*3);current.interval=interval;current.due=Date.now()+(v==='again'?60000:interval*86400000);state.days[day()]=todayCount()+1;save();renderCard()}
$('showAnswer').onclick=revealCard;$('flash').onclick=revealCard;$('flash').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();revealCard()}};$('skipCard').onclick=()=>{if(current){skipped.add(current.id);renderCard()}};document.querySelectorAll('[data-rate]').forEach(b=>b.onclick=()=>rate(b.dataset.rate));$('studyFilter').onchange=()=>{skipped.clear();renderCard()};
function audioMessage(message){$('audioStatus').textContent=message;$('audioStatus').classList.toggle('hidden',!message)}
function chineseVoice(){return window.speechSynthesis?.getVoices().find(v=>/^zh[-_](CN|Hans)/i.test(v.lang))||window.speechSynthesis?.getVoices().find(v=>/^zh/i.test(v.lang))}
function say(text){
 if(!('speechSynthesis' in window)||!chineseVoice()){audioMessage('No Chinese voice is available. Enable a Mandarin voice in your device’s text-to-speech settings, then reload. You can still practice with text.');return false}
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text.split('/')[0].trim());u.voice=chineseVoice();u.lang=u.voice.lang;u.rate=.82;
 u.onerror=e=>{if(!['canceled','interrupted'].includes(e.error))audioMessage('Audio could not play. Check your device’s sound and Mandarin voice settings.')};audioMessage('');speechSynthesis.speak(u);return true
}
$('speakCard').onclick=()=>current&&say(current.hanzi);
function go(tab){gameEpoch++;activeGame='';if('speechSynthesis' in window)speechSynthesis.cancel();document.querySelectorAll('main>section').forEach(s=>s.classList.toggle('hidden',s.id!==tab));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));if(tab==='study')renderCard();if(tab==='words')renderRows();if(tab==='games')showGameHome()}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>go(b.dataset.tab));
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>openGameMenu(b.dataset.game));
for(const type of ['memory','quiz'])$(type+'Section').onchange=()=>renderLessonButtons(type);
for(const type of ['memory','quiz','tone']){$(type+'Start').onclick=()=>startGame(type);$(type+'Home').onclick=showGameHome}
document.getElementById('extra').onclick=()=>{ // handled through play tab
go('games')
};
document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>go(b.dataset.goto));
let activeGame='',gameState=null;
function resetGames(){if(activeGame)startGame(activeGame)}
let gameEpoch=0;
function hideGameMenus(){for(const type of ['memory','quiz','tone'])$(type+'Menu').classList.add('hidden')}
function stopGame(){gameEpoch++;activeGame='';if('speechSynthesis' in window)speechSynthesis.cancel();$('gameArea').classList.add('hidden')}
function showGameHome(){stopGame();hideGameMenus();$('gameModes').classList.remove('hidden')}
function openGameMenu(type){stopGame();hideGameMenus();$('gameModes').classList.add('hidden');$(type+'Menu').classList.remove('hidden');if(type!=='tone')renderLessonButtons(type)}
function startGame(type){stopGame();hideGameMenus();activeGame=type;$('gameModes').classList.add('hidden');$('gameArea').classList.remove('hidden');if(type==='memory')startMemory();else if(type==='quiz')startQuiz();else{toneMode=$('toneMenuLength').value;startTone()}}
function gameTop(title,extra=''){return '<div class="gamebar"><div><b>'+title+'</b> <span class="small">'+extra+'</span><div class="small">'+escapeHTML($(activeGame+'Section').value==='*'?'All vocabulary':$(activeGame+'Section').value)+'</div></div><div><button class="btn" id="restartGame">Restart</button> <button class="btn" id="backGames">Game settings</button> <button class="btn" id="gameHome">All games</button></div></div>'}
function setupBack(){$('backGames').onclick=()=>openGameMenu(activeGame);$('gameHome').onclick=showGameHome;$('restartGame').onclick=()=>startGame(activeGame)}
function markError(w){w.errors=(w.errors||0)+1;w.due=Math.min(w.due||0,Date.now()+60000);save()}
function startMemory(){gameEpoch++;let list=shuffle([...new Map(group('memorySection').map(w=>[norm(w.pinyin)+'|'+norm(w.meaning),w])).values()]);let n=Number($('pairCount').value);list=list.slice(0,Math.min(n,list.length));if(!list.length){$('gameArea').innerHTML=gameTop('Memorama')+'<p>Add vocabulary first.</p>';setupBack();return}let deck=shuffle(list.flatMap((w,i)=>[{id:i,side:'zh',text:w.hanzi,word:w},{id:i,side:'en',text:w.pinyin+' — '+w.meaning,word:w}]));gameState={deck,open:[],matches:new Set(),tries:0,pairs:list.length};$('gameArea').innerHTML=gameTop('Memorama','Match hanzi with pinyin + English')+'<p class="muted" style="text-align:center">Attempts: <b id="tries">0</b> · Pairs found: <b id="pairsFound">0</b> / '+list.length+'</p><div class="board" id="board"></div><div class="gamefeedback" id="gameFeedback" role="status"></div>';setupBack();drawBoard()}
function drawBoard(){const board=$('board');board.replaceChildren();gameState.deck.forEach((c,i)=>{let b=document.createElement('button');b.className='tile '+(gameState.matches.has(c.id)?'match':gameState.open.includes(i)?'open':'');b.setAttribute('aria-label',gameState.matches.has(c.id)?c.text:gameState.open.includes(i)?c.text:'Hidden card');if(gameState.matches.has(c.id)||gameState.open.includes(i)){if(c.side==='en'){const pinyin=document.createElement('span');pinyin.className='card-pinyin';pinyin.textContent=c.word.pinyin;const meaning=document.createElement('span');meaning.className='card-meaning';meaning.textContent=c.word.meaning;b.append(pinyin,meaning)}else{b.textContent=c.word.hanzi;b.setAttribute('lang','zh-CN')}b.classList.add(c.side)}else{b.innerHTML='<span class="tilemark">字</span>'}b.onclick=()=>flip(i);board.append(b)})}
function flip(i){if(gameState.open.includes(i)||gameState.matches.has(gameState.deck[i].id)||gameState.open.length>=2)return;gameState.open.push(i);drawBoard();if(gameState.open.length===2){gameState.tries++;$('tries').textContent=gameState.tries;let[a,b]=gameState.open.map(i=>gameState.deck[i]);if(a.id===b.id){gameState.matches.add(a.id);$('pairsFound').textContent=gameState.matches.size;state.games.memory=(state.games.memory||0)+1;save();gameState.open=[];drawBoard();say(a.word.hanzi);if(gameState.matches.size===gameState.pairs)$('gameFeedback').textContent='Great recall! '+gameState.tries+' attempts for '+gameState.pairs+' pairs.'}else{markError(a.word);markError(b.word);$('gameFeedback').textContent='Not a match. Try to remember both cards.';(()=>{const epoch=gameEpoch;setTimeout(()=>{if(epoch!==gameEpoch||activeGame!=='memory')return;gameState.open=[];drawBoard()},850)})()}}}
let quizList=[],quizAt=0,quizScore=0;
function startQuiz(){quizList=shuffle(group('quizSection'));quizList=quizList.slice(0,Math.min(Number($('quizCount').value),quizList.length));quizAt=0;quizScore=0;if(quizList.length<2){$('gameArea').innerHTML=gameTop('Quick choice')+'<p>Choose a section with at least two words.</p>';setupBack();return}showQuiz()}
function showQuiz(){if(quizAt>=quizList.length){$('gameArea').innerHTML=gameTop('Round complete')+'<div class="empty"><h2>'+quizScore+' / '+quizList.length+' correct</h2><p>Words you missed will return sooner in your review queue.</p><button class="btn primary" id="againQuiz">Play again</button></div>';setupBack();$('againQuiz').onclick=()=>startQuiz();return}let w=quizList[quizAt],opts=shuffle([w,...shuffle([...new Map(group('quizSection').filter(x=>x.id!==w.id&&norm(x.meaning)!==norm(w.meaning)).map(x=>[norm(x.meaning),x])).values()]).slice(0,3)]);$('gameArea').innerHTML=gameTop('Quick choice','Question '+(quizAt+1)+' of '+quizList.length)+'<div class="quizword">'+escapeHTML(w.hanzi)+'</div><div class="gamefeedback"><button class="btn" id="quizListen">Listen</button></div><div class="quizopts" id="quizopts"></div><div id="qfeedback" class="gamefeedback" role="status"></div>';setupBack();$('quizListen').onclick=()=>say(w.hanzi);opts.forEach(x=>{let b=document.createElement('button');b.textContent=x.meaning;b.onclick=()=>{if(b.disabled)return;document.querySelectorAll('.quizopts button').forEach(k=>k.disabled=true);if(x.id===w.id){b.classList.add('correct');quizScore++;$('qfeedback').textContent='Correct · '+w.pinyin;state.games.quiz=(state.games.quiz||0)+1;save()}else{b.classList.add('wrong');markError(w);$('qfeedback').textContent='Answer: '+w.meaning+' · '+w.pinyin;document.querySelectorAll('.quizopts button').forEach(k=>{if(k.textContent===w.meaning)k.classList.add('correct')})}(()=>{const epoch=gameEpoch;setTimeout(()=>{if(epoch!==gameEpoch||activeGame!=='quiz')return;quizAt++;showQuiz()},1100)})()};$('quizopts').append(b)})}
const toneMarks={'ā':1,'ē':1,'ī':1,'ō':1,'ū':1,'ǖ':1,'á':2,'é':2,'í':2,'ó':2,'ú':2,'ǘ':2,'ǎ':3,'ě':3,'ǐ':3,'ǒ':3,'ǔ':3,'ǚ':3,'à':4,'è':4,'ì':4,'ò':4,'ù':4,'ǜ':4};
let toneWord=null,toneScore=0,toneTotal=0,toneMode='any';
function markedTone(s){for(const c of s.toLowerCase())if(toneMarks[c])return toneMarks[c];return 5}
function syllables(w){const text=w.pinyin.split('/')[0].trim();return text.split(/\s+/)}
function startTone(){toneScore=0;toneTotal=0;nextTone()}
function nextTone(){const pool=group('toneSection').filter(w=>syllables(w).length===Array.from(w.hanzi.split('/')[0].trim()).length).filter(w=>toneMode==='any'||(toneMode==='3'?syllables(w).length>=3:syllables(w).length===+toneMode));
$('gameArea').innerHTML=gameTop('Mandarin tone drill')+'<div class="toolbar"><label>Word length<select id="toneLength"><option value="any">Any length</option><option value="1">One syllable</option><option value="2">Two syllables</option><option value="3">Multiple syllables</option></select></label><button id="toneRestart">Start over</button></div><p class="tone-guide">Listen, choose a syllable, then identify its tone. Audio uses your browser’s Chinese voice. Answers follow the displayed pinyin; connected speech may change tones.</p><div id="toneScore" class="notice"></div><div class="gamefeedback"><button class="primary" id="tonePlay">Play word</button> <button id="toneHint">Hint</button></div><div id="tonePinyin" class="pinyin gamefeedback"></div><div id="syllables" class="syllables"></div><div id="toneButtons" class="tonebuttons"></div><p id="toneFeedback" class="gamefeedback" role="status"></p><div class="exercise-footer"><button id="toneNext">Next word</button></div>';
setupBack();$('toneLength').value=toneMode;$('toneLength').onchange=()=>{toneMode=$('toneLength').value;$('toneMenuLength').value=toneMode;nextTone()};$('toneRestart').onclick=startTone;$('toneNext').onclick=nextTone;
$('toneScore').textContent='Correct: '+toneScore+' · Wrong: '+(toneTotal-toneScore)+' · Score: '+(toneTotal?Math.round(100*toneScore/toneTotal):0)+'%';
if(!pool.length){$('toneFeedback').textContent='No suitable words. Choose another section or length. Custom tone words need spaces between pinyin syllables.';$('tonePlay').disabled=true;$('toneHint').disabled=true;return}
toneWord=pool[Math.floor(Math.random()*pool.length)];let parts=syllables(toneWord),target=0,played=false,answered=new Set();
function buttons(){document.querySelectorAll('[data-tone]').forEach(b=>b.disabled=!played||answered.has(target))}
parts.forEach((s,i)=>{let b=document.createElement('button');b.textContent='Syllable '+(i+1);b.className='syllable'+(i===0?' selected':'');b.onclick=()=>{target=i;document.querySelectorAll('.syllable').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');buttons()};$('syllables').append(b)});
['→ First','↗ Second','↘↗ Third','↘ Fourth','· Neutral'].forEach((label,i)=>{let b=document.createElement('button');b.textContent=label+' tone';b.dataset.tone=i+1;b.disabled=true;b.onclick=()=>{if(!played||answered.has(target))return;answered.add(target);toneTotal++;let correct=markedTone(parts[target])===i+1;if(correct){toneScore++;state.games.tone=(state.games.tone||0)+1;save()}else markError(toneWord);$('toneFeedback').textContent=(correct?'Correct! ':'Answer: ')+parts[target]+' · tone '+markedTone(parts[target]);$('toneScore').textContent='Correct: '+toneScore+' · Wrong: '+(toneTotal-toneScore)+' · Score: '+Math.round(100*toneScore/toneTotal)+'%';buttons()};$('toneButtons').append(b)});
$('tonePlay').onclick=()=>{played=say(toneWord.hanzi.split('/')[0]);if(!played)$('toneFeedback').textContent='Audio unavailable. Use Hint to practice from pinyin.';buttons()};$('toneHint').onclick=()=>{$('tonePinyin').textContent=toneWord.pinyin;played=true;buttons()}}

function renderRows(){let q=norm($('search').value),f=$('wordFilter').value;$('wordRows').replaceChildren();let filtered=state.words.filter(w=>inSection(w,f)&&norm([w.hanzi,w.pinyin,w.meaning,w.category].join(' ')).includes(q));for(const w of filtered){let tr=document.createElement('tr');for(const k of ['hanzi','pinyin','meaning','section']){let td=document.createElement('td');td.textContent=k==='section'?memberships(w).join(' / '):w[k]||'';tr.append(td)}let status=document.createElement('td');status.textContent=(w.errors||0)?'Review soon · '+w.errors+' misses':'In practice';tr.append(status);let action=document.createElement('td'),edit=document.createElement('button'),del=document.createElement('button');edit.className='btn';edit.textContent='Edit';edit.onclick=()=>editWord(w);del.className='btn';del.textContent='Delete';del.onclick=()=>{if(confirm('Delete '+w.hanzi+'?')){state.deleted=[...new Set([...state.deleted,w.hanzi])];state.words=state.words.filter(x=>x.id!==w.id);save();fillSelect($('studyFilter'));fillGameSections();fillSelect($('wordFilter'));renderRows();updateStats()}};action.append(edit,del);tr.append(action);$('wordRows').append(tr)}if(!filtered.length){let tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=6;td.textContent='No words found.';tr.append(td);$('wordRows').append(tr)}}
function editWord(w){let h=prompt('Chinese characters',w.hanzi);if(h===null)return;let p=prompt('Pinyin',w.pinyin);if(p===null)return;let m=prompt('Meaning',w.meaning);if(m===null)return;let s=prompt('Lesson or section',w.section||'My words');if(s===null)return;if(!h.trim()||!p.trim()||!m.trim()||!s.trim()){alert('Characters, pinyin, meaning and section cannot be empty.');return}if(state.words.some(x=>x.id!==w.id&&x.hanzi===h.trim())){alert('This word already exists. Edit its existing entry.');return}if(w.hanzi!==h.trim())state.deleted.push(w.hanzi);w.hanzi=h.trim();w.pinyin=p.trim();w.meaning=m.trim();w.section=s.trim();w.sections=[...new Set([...memberships(w),w.section])];save();fillSelect($('studyFilter'));fillGameSections();fillSelect($('wordFilter'));renderRows();updateStats()}
$('search').oninput=renderRows;$('wordFilter').onchange=renderRows;
$('addForm').onsubmit=e=>{e.preventDefault();let v=Object.fromEntries(new FormData(e.target));for(let k in v)v[k]=v[k].trim();if(!v.hanzi||!v.pinyin||!v.meaning||!v.section){$('saved').textContent='Please complete all required fields.';return}const existing=state.words.find(w=>w.hanzi===v.hanzi);if(existing&&!inSection(existing,v.section)){existing.sections=[...memberships(existing),v.section];save();fillSelect($('studyFilter'));fillGameSections();fillSelect($('wordFilter'));$('saved').textContent='Existing word added to this section; progress preserved.';return}if(existing){$('saved').textContent='This word is already in this section.';return}state.deleted=state.deleted.filter(h=>h!==v.hanzi);state.words.push({...v,id:crypto.randomUUID(),category:'custom',due:0,interval:0,errors:0});save();e.target.reset();$('saved').textContent='Added and ready to practice.';fillSelect($('studyFilter'));fillGameSections();fillSelect($('wordFilter'));updateStats()};
function exportBackup(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='hanzi-daily-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importData(d){
 if(!d||!Array.isArray(d.words)||d.words.length>5000||!d.words.every(w=>w&&['hanzi','pinyin','meaning'].every(k=>typeof w[k]==='string'&&w[k].trim()&&w[k].length<=500)&&(!w.sections||Array.isArray(w.sections))))throw Error('Invalid backup');
 const numeric=(x)=>Number.isFinite(x)&&x>=0?x:0;
 const next=JSON.parse(JSON.stringify(state));
 for(const w of d.words){let existing=next.words.find(x=>x.hanzi===w.hanzi);const clean={hanzi:w.hanzi,pinyin:w.pinyin,meaning:w.meaning,section:typeof w.section==='string'?w.section:'Imported',sections:memberships(w),example:typeof w.example==='string'?w.example:'',category:typeof w.category==='string'?w.category:'custom',due:numeric(w.due),interval:numeric(w.interval),errors:numeric(w.errors)};
 if(existing){existing.sections=[...new Set([...memberships(existing),...memberships(clean)])];if(clean.due>numeric(existing.due)){existing.due=clean.due;existing.interval=clean.interval}existing.errors=Math.max(numeric(existing.errors),clean.errors)}else next.words.push({...clean,id:crypto.randomUUID()});
 next.deleted=next.deleted.filter(h=>h!==w.hanzi);
 }
 for(const field of ['days','games'])if(d[field]&&typeof d[field]==='object'&&!Array.isArray(d[field]))for(const [k,v]of Object.entries(d[field])){if(['__proto__','constructor','prototype'].includes(k))continue;next[field][k]=Math.max(numeric(next[field][k]),numeric(v))}
 state=next;save();
}
$('export').onclick=exportBackup;$('importBtn').onclick=()=>$('import').click();$('import').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>2000000)throw Error();importData(JSON.parse(await file.text()));fillSelect($('studyFilter'));fillGameSections();fillSelect($('wordFilter'));renderRows();updateStats();alert('Backup merged. Vocabulary, review schedules and game scores preserved.')}catch{alert('Could not import this backup. Choose a valid Hanzi Daily JSON file.')}finally{e.target.value=''}};
setInterval(()=>{if(!$('study').classList.contains('hidden')&&!current)renderCard()},15000);
$('today').textContent=new Intl.DateTimeFormat('en',{weekday:'long',month:'short',day:'numeric'}).format(new Date());renderCard();updateStats();
