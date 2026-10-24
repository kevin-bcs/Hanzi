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
let storageBlocked=false;
let state={words:[],days:{},games:{},results:[],version:4};
try{const rawSaved=localStorage.getItem(KEY);if(rawSaved){const old=JSON.parse(rawSaved);if(!old||!Array.isArray(old.words))throw Error('Invalid stored data');if(!localStorage.getItem(KEY+'-before-v4'))localStorage.setItem(KEY+'-before-v4',rawSaved);state={...state,...old,days:old.days||{},games:old.games||{}}}}catch{storageBlocked=true;$('storageWarning').textContent='Stored data could not be read or backed up. Automatic saving is paused to protect it. Export your data before continuing.';$('storageWarning').classList.remove('hidden')}

function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function save(){if(storageBlocked)return false;try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{if($('storageWarning'))$('storageWarning').classList.remove('hidden');return false}}
function memberships(w){return [...new Set([w.section||'My words',...(Array.isArray(w.sections)?w.sections.filter(x=>typeof x==='string'):[])])]}
function inSection(w,f){return f==='*'||memberships(w).includes(f)}
function mergeStarter(){for(const w of starter){if(state.deleted.includes(w.hanzi))continue;if(state.words.some(x=>x.id===w.id))continue;let found=state.words.find(x=>x.hanzi===w.hanzi);if(found){found.sections=[...new Set([...memberships(found),w.section])];for(const k of ['category','meaning','pinyin'])if(!found[k])found[k]=w[k];found.errors=found.errors||0}else state.words.push({...w,sections:[w.section]})}state.version=3;save()}

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
 if(['tone','initials'].includes(type)){const o=document.createElement('option');o.value='*';o.textContent='All vocabulary';select.append(o)}
 for(const section of ordered){const o=document.createElement('option');o.value=section;o.textContent=section;select.append(o)}
 select.value=ordered.includes(old)?old:['tone','initials'].includes(type)?'*':ordered[0]||'';
 if(!['tone','initials'].includes(type))renderLessonButtons(type);
 }
}
function renderLessonButtons(type){
 const picker=$(type+'Lessons');picker.replaceChildren();
 for(const section of sections().filter(s=>s.startsWith('Lesson '))){const b=document.createElement('button');b.className='lesson-choice'+($(type+'Section').value===section?' selected':'');b.setAttribute('aria-pressed',String($(type+'Section').value===section));
 const title=document.createElement('strong');title.textContent=section.split(' · ')[0];const count=document.createElement('small');count.textContent=state.words.filter(w=>inSection(w,section)).length+' words';b.append(title,count);b.onclick=()=>{$(type+'Section').value=section;renderLessonButtons(type);if(type==='memory')updateCardOptions()};picker.append(b)}
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
function go(tab){stopTimers();gameEpoch++;activeGame='';if('speechSynthesis' in window)speechSynthesis.cancel();document.querySelectorAll('main>section').forEach(s=>s.classList.toggle('hidden',s.id!==tab));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));if(tab==='progress')renderProgress();if(tab==='learn')renderLearningLevels();if(tab==='study')renderCard();if(tab==='words')renderRows();if(tab==='games')showGameHome()}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>go(b.dataset.tab));
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>openGameMenu(b.dataset.game));
for(const type of ['memory','quiz'])$(type+'Section').onchange=()=>renderLessonButtons(type);
for(const type of ['memory','quiz','tone','initials']){$(type+'Start').onclick=()=>startGame(type);$(type+'Home').onclick=showGameHome}
document.getElementById('extra').onclick=()=>{ // handled through play tab
go('games')
};
document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>go(b.dataset.goto));
let activeGame='',gameState=null;
var gameTimer=null,gameDelay=null;
function stopTimers(){clearInterval(gameTimer);clearTimeout(gameDelay);gameTimer=null;gameDelay=null}
function recordResult(game,data){state.results=Array.isArray(state.results)?state.results:[];state.results.push({game,date:new Date().toISOString(),...data});state.results=state.results.slice(-200);save()}
function resetGames(){if(activeGame)startGame(activeGame)}
let gameEpoch=0;
function hideGameMenus(){for(const type of ['memory','quiz','tone','initials'])$(type+'Menu').classList.add('hidden')}
function stopGame(){stopTimers();gameEpoch++;activeGame='';if('speechSynthesis' in window)speechSynthesis.cancel();if(window.lessonAudio)window.lessonAudio.pause();$('gameArea').classList.add('hidden')}
function showGameHome(){stopGame();hideGameMenus();$('gameModes').classList.remove('hidden')}
function openGameMenu(type){if(type==='initials'){showSoundModes();return}stopGame();if(type==='memory')updateCardOptions();hideGameMenus();$('gameModes').classList.add('hidden');$(type+'Menu').classList.remove('hidden');if(!['tone','initials'].includes(type))renderLessonButtons(type)}
function startGame(type){stopGame();hideGameMenus();activeGame=type;$('gameModes').classList.add('hidden');$('gameArea').classList.remove('hidden');if(type==='memory')startMemory(false);else if(type==='quiz')startQuiz();else if(type==='initials')startInitials();else{toneMode=$('toneMenuLength').value;startTone()}}
function gameTop(title,extra=''){return '<div class="gamebar"><div><b>'+title+'</b> <span class="small">'+extra+'</span><div class="small">'+escapeHTML(activeGame==='initials'?(soundRound?.mode||soundMode):$(activeGame+'Section').value==='*'?'All vocabulary':$(activeGame+'Section').value)+'</div></div><div><button class="btn" id="restartGame">Restart</button>'+(activeGame==='memory'?'<button class="btn" id="newMemory">Restart all</button>':'')+' <button class="btn" id="backGames">Game settings</button> <button class="btn" id="gameHome">All games</button> <button class="btn" id="backLesson">Back to lesson</button></div></div>'}
function setupBack(){$('backLesson').onclick=()=>go('learn');$('backGames').onclick=()=>openGameMenu(activeGame);$('gameHome').onclick=showGameHome;$('restartGame').onclick=()=>activeGame==='memory'?startMemory(true):startGame(activeGame);if($('newMemory'))$('newMemory').onclick=()=>startMemory(false)}
function markError(w){w.errors=(w.errors||0)+1;w.due=Math.min(w.due||0,Date.now()+60000);save()}
function memoryPool(){return [...new Map(group('memorySection').map(w=>[norm(w.pinyin)+'|'+norm(w.meaning),w])).values()]}
function updateCardOptions(){const max=Math.min(100,memoryPool().length*2),selected=Number($('pairCount').value);$('pairCount').replaceChildren();for(let cards=6;cards<=max;cards+=2){const o=document.createElement('option');o.value=cards/2;o.textContent=cards+' cards · '+cards/2+' pairs';$('pairCount').append(o)}$('pairCount').value=String(Math.max(3,Math.min(selected||6,max/2)));$('memoryStart').disabled=max<6}
function startMemory(same=false){stopTimers();gameEpoch++;let list=same&&gameState?gameState.selection:[...shuffle(memoryPool())].slice(0,Number($('pairCount').value));if(list.length<3){$('gameArea').innerHTML=gameTop('Memorama')+'<p>At least three distinct pairs are required.</p>';setupBack();return}
const names=$('memoryPlayers').value.split(/[,\n]/).map(x=>x.trim()).filter(Boolean).slice(0,12);const players=(names.length?names:['Player 1']).map(name=>({name,score:0}));
let deck=shuffle(list.flatMap((w,i)=>[{id:i,side:'zh',text:w.hanzi,word:w},{id:i,side:'en',text:w.pinyin+' — '+w.meaning,word:w}]));gameState={selection:list,players,turn:0,deck,open:[],matches:new Set(),tries:0,pairs:list.length,finished:false};
$('gameArea').innerHTML=gameTop('Memorama','Match hanzi with pinyin + English')+'<div id="memoryScores" class="notice"></div><p class="gamefeedback">Attempts: <b id="tries">0</b> · Pairs found: <b id="pairsFound">0</b> / '+list.length+' · <span id="turnClock"></span></p><div class="board" id="board"></div><div class="gamefeedback" id="gameFeedback" role="status"></div>';setupBack();drawBoard();memoryTurn();}
function memoryTurn(){stopTimers();if(gameState.finished)return;gameState.open=[];drawBoard();$('memoryScores').textContent='Active: '+gameState.players[gameState.turn].name+' | '+gameState.players.map(p=>p.name+': '+p.score).join(' · ');$('memoryScores').style.borderLeft='6px solid '+['#28594c','#bd7136','#6c54a1'][gameState.turn%3];if($('memoryTimer').checked){const deadline=Date.now()+5000,epoch=gameEpoch;$('turnClock').textContent='5.0s';gameTimer=setInterval(()=>{if(epoch!==gameEpoch)return;const remaining=Math.max(0,deadline-Date.now());$('turnClock').textContent=(remaining/1000).toFixed(1)+'s';if(!remaining){stopTimers();gameState.turn=(gameState.turn+1)%gameState.players.length;memoryTurn()}},50)}else $('turnClock').textContent='No time limit'}
function drawBoard(){const board=$('board');board.replaceChildren();gameState.deck.forEach((c,i)=>{let b=document.createElement('button');b.className='tile '+(gameState.matches.has(c.id)?'match':gameState.open.includes(i)?'open':'');b.setAttribute('aria-label',gameState.matches.has(c.id)?c.text:gameState.open.includes(i)?c.text:'Hidden card');if(gameState.matches.has(c.id)||gameState.open.includes(i)){if(c.side==='en'){const pinyin=document.createElement('span');pinyin.className='card-pinyin';pinyin.textContent=c.word.pinyin;const meaning=document.createElement('span');meaning.className='card-meaning';meaning.textContent=c.word.meaning;b.append(pinyin,meaning)}else{b.textContent=c.word.hanzi;b.setAttribute('lang','zh-CN')}b.classList.add(c.side)}else{b.innerHTML='<span class="tilemark">字</span>'}b.onclick=()=>flip(i);board.append(b)})}
function flip(i){const g=gameState;if(g.finished||g.open.includes(i)||g.matches.has(g.deck[i].id)||g.open.length>=2)return;g.open.push(i);drawBoard();if(g.open.length!==2)return;g.tries++;$('tries').textContent=g.tries;const [a,b]=g.open.map(i=>g.deck[i]);if(a.id===b.id){stopTimers();g.matches.add(a.id);g.players[g.turn].score++;$('pairsFound').textContent=g.matches.size;state.games.memory=(state.games.memory||0)+1;save();say(a.word.hanzi);g.open=[];drawBoard();if(g.matches.size===g.pairs){g.finished=true;recordResult('memory',{correct:g.pairs,wrong:g.tries-g.pairs,players:g.players});$('memoryScores').textContent=g.players.map(p=>p.name+': '+p.score).join(' · ');$('gameFeedback').textContent='Complete! '+g.tries+' attempts. Winner(s): '+g.players.filter(p=>p.score===Math.max(...g.players.map(x=>x.score))).map(p=>p.name).join(', ');$('turnClock').textContent='Finished'}else memoryTurn()}else{const epoch=gameEpoch;gameDelay=setTimeout(()=>{if(epoch!==gameEpoch||g!==gameState)return;stopTimers();g.turn=(g.turn+1)%g.players.length;memoryTurn()},650)}}
let quizList=[],quizAt=0,quizScore=0,quizStarted=0;
function startQuiz(){stopTimers();gameEpoch++;quizList=shuffle(group('quizSection').filter(w=>$('quizDifficulty').value!=='long'||Array.from(w.hanzi.split('/')[0].trim()).length>=3));quizList=quizList.slice(0,Math.min(Number($('quizCount').value),quizList.length));quizAt=0;quizScore=0;quizStarted=Date.now();showQuiz()}
function showQuiz(){stopTimers();if(!quizList.length){$('gameArea').innerHTML=gameTop('Quick choice')+'<p>No words match these settings. Choose another lesson or difficulty.</p>';setupBack();return}if(quizAt>=quizList.length){const seconds=Math.round((Date.now()-quizStarted)/1000);recordResult('quiz',{correct:quizScore,wrong:quizList.length-quizScore,seconds});$('gameArea').innerHTML=gameTop('Round complete')+'<div class="empty"><h2>'+quizScore+' / '+quizList.length+' correct</h2><p>'+(quizList.length-quizScore)+' wrong · '+Math.round(100*quizScore/quizList.length)+'% accuracy · '+seconds+' seconds</p><button class="primary" id="againQuiz">Play again</button></div>';setupBack();$('againQuiz').onclick=()=>startQuiz();return}
const w=quizList[quizAt],opts=shuffle([w,...shuffle([...new Map(group('quizSection').filter(x=>x.id!==w.id&&norm(x.meaning)!==norm(w.meaning)).map(x=>[norm(x.meaning),x])).values()]).slice(0,3)]),epoch=gameEpoch;let answered=false;
$('gameArea').innerHTML=gameTop('Quick choice','Question '+(quizAt+1)+' of '+quizList.length)+'<p id="quizClock" class="notice"></p><div class="quizword">'+escapeHTML(w.hanzi)+'</div>'+($('quizPinyin').checked?'<p class="gamefeedback pinyin">'+escapeHTML(w.pinyin)+'</p>':'')+'<div class="gamefeedback"><button id="quizListen">Listen</button></div><div id="quizopts" class="quizopts"></div><p id="qfeedback" class="gamefeedback" role="status"></p>';setupBack();$('quizListen').onclick=()=>say(w.hanzi);
function answer(x){if(answered||epoch!==gameEpoch)return;answered=true;stopTimers();const correct=x?.id===w.id;if(correct){quizScore++;state.games.quiz=(state.games.quiz||0)+1;save()}else markError(w);for(const b of $('quizopts').children){b.disabled=true;if(b.textContent===w.meaning)b.classList.add('correct');else if(b.textContent===x?.meaning)b.classList.add('wrong')}$('qfeedback').textContent=(correct?'Correct! ':x?'Answer: ':'Time expired. Answer: ')+w.meaning+' · '+w.pinyin;gameDelay=setTimeout(()=>{if(epoch===gameEpoch&&activeGame==='quiz'){quizAt++;showQuiz()}},1200)}
for(const x of opts){const b=document.createElement('button');b.textContent=x.meaning;b.onclick=()=>answer(x);$('quizopts').append(b)}
const limit=Number($('quizTime').value);if(limit){const deadline=Date.now()+limit*1000;$('quizClock').textContent=limit+'s remaining';gameTimer=setInterval(()=>{if(epoch!==gameEpoch)return;const left=Math.max(0,deadline-Date.now());$('quizClock').textContent=(left/1000).toFixed(1)+'s remaining';if(!left)answer(null)},50)}else $('quizClock').textContent='No time limit';}
const toneMarks={'ā':1,'ē':1,'ī':1,'ō':1,'ū':1,'ǖ':1,'á':2,'é':2,'í':2,'ó':2,'ú':2,'ǘ':2,'ǎ':3,'ě':3,'ǐ':3,'ǒ':3,'ǔ':3,'ǚ':3,'à':4,'è':4,'ì':4,'ò':4,'ù':4,'ǜ':4};
let toneWord=null,toneScore=0,toneTotal=0,toneMode='any',toneRounds=0;
function markedTone(s){for(const c of s.toLowerCase())if(toneMarks[c])return toneMarks[c];return 5}
function syllables(w){const text=w.pinyin.split('/')[0].trim();return text.split(/\s+/)}
function startTone(){toneScore=0;toneTotal=0;toneRounds=0;nextTone()}
function nextTone(){if(toneRounds>=10){recordResult('tone',{correct:toneScore,wrong:toneTotal-toneScore});$('gameArea').innerHTML=gameTop('Tone drill — Results')+'<div class="empty"><h2>'+toneScore+' / '+toneTotal+' correct</h2><p>10 words completed.</p></div>';setupBack();return}toneRounds++;const pool=group('toneSection').filter(w=>syllables(w).length===Array.from(w.hanzi.split('/')[0].trim()).length).filter(w=>toneMode==='any'||(toneMode==='3'?syllables(w).length>=3:syllables(w).length===+toneMode));
$('gameArea').innerHTML=gameTop('Mandarin tone drill')+'<div class="toolbar"><label>Word length<select id="toneLength"><option value="any">Any length</option><option value="1">One syllable</option><option value="2">Two syllables</option><option value="3">Multiple syllables</option></select></label><button id="toneRestart">Start over</button></div><p class="tone-guide">Listen, choose a syllable, then identify its tone. Audio uses your browser’s Chinese voice. Answers follow the displayed pinyin; connected speech may change tones.</p><div id="toneScore" class="notice"></div><div class="gamefeedback"><button class="primary" id="tonePlay">Play word</button> <button id="toneHint">Hint</button></div><div id="tonePinyin" class="pinyin gamefeedback"></div><div id="syllables" class="syllables"></div><div id="toneButtons" class="tonebuttons"></div><p id="toneFeedback" class="gamefeedback" role="status"></p><div class="exercise-footer"><button id="toneNext">Next word</button></div>';
setupBack();$('toneLength').value=toneMode;$('toneLength').onchange=()=>{toneMode=$('toneLength').value;$('toneMenuLength').value=toneMode;nextTone()};$('toneRestart').onclick=startTone;$('toneNext').onclick=nextTone;
$('toneScore').textContent='Correct: '+toneScore+' · Wrong: '+(toneTotal-toneScore)+' · Score: '+(toneTotal?Math.round(100*toneScore/toneTotal):0)+'%';
if(!pool.length){$('toneFeedback').textContent='No suitable words. Choose another section or length. Custom tone words need spaces between pinyin syllables.';$('tonePlay').disabled=true;$('toneHint').disabled=true;return}
toneWord=pool[Math.floor(Math.random()*pool.length)];let parts=syllables(toneWord),target=0,played=false,answered=new Set();
function buttons(){document.querySelectorAll('[data-tone]').forEach(b=>b.disabled=!played||answered.has(target))}
parts.forEach((s,i)=>{let b=document.createElement('button');b.textContent='Syllable '+(i+1);b.className='syllable'+(i===0?' selected':'');b.onclick=()=>{target=i;document.querySelectorAll('.syllable').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');say(toneWord.hanzi.split('/')[0]);buttons()};$('syllables').append(b)});
['→ First','↗ Second','↘↗ Third','↘ Fourth','· Neutral'].forEach((label,i)=>{let b=document.createElement('button');b.textContent=label+' tone';b.dataset.tone=i+1;b.disabled=true;b.onclick=()=>{if(!played||answered.has(target))return;answered.add(target);toneTotal++;let correct=markedTone(parts[target])===i+1;if(correct){toneScore++;state.games.tone=(state.games.tone||0)+1;save()}else markError(toneWord);$('toneFeedback').textContent=(correct?'Correct! ':'Answer: ')+parts[target]+' · tone '+markedTone(parts[target]);$('toneScore').textContent='Correct: '+toneScore+' · Wrong: '+(toneTotal-toneScore)+' · Score: '+Math.round(100*toneScore/toneTotal)+'%';buttons()};$('toneButtons').append(b)});
$('tonePlay').onclick=()=>{played=say(toneWord.hanzi.split('/')[0]);if(!played)$('toneFeedback').textContent='Audio unavailable. Use Hint to practice from pinyin.';buttons()};$('toneHint').onclick=()=>{$('tonePinyin').textContent=toneWord.pinyin;played=true;buttons()};$('tonePlay').onclick()}

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

// Phonetic inventory: explicit syllables and spelling categories; never build syllables by concatenation.
// y/w are orthographic onsets, not two additional consonant phonemes.
const soundInitialData=[
['b','波|bō','八|bā','stop','bilabial','Close both lips, then release with little air. Mandarin b is normally unvoiced, unlike English b.','p m f'],
['p','坡|pō','怕|pà','stop','bilabial','Close both lips, then release with a strong puff of air. Compare English p at the start of pin.','b m f'],
['m','妈|mā','马|mǎ','nasal','bilabial','Close the lips and let air flow through the nose, approximately like English m.','n b p'],
['f','发|fā','饭|fàn','fricative','labiodental','Bring the upper teeth gently against the lower lip and let air hiss through, roughly like English f.','h p b'],
['d','低|dī','大|dà','stop','alveolar','Touch the tongue tip behind the upper teeth at the ridge, then release without a strong puff. It is not English voiced d.','t n l'],
['t','梯|tī','他|tā','stop','alveolar','Touch the tongue tip to the ridge behind the upper teeth and release with a puff, as in English initial t.','d n l'],
['n','你|nǐ','拿|ná','nasal','alveolar','Place the tongue tip at the ridge behind the upper teeth and send air through the nose, roughly English n.','l m d'],
['l','梨|lí','拉|lā','lateral','alveolar','Keep the tongue tip at the upper gum ridge and let air pass around its sides. Avoid the dark English final l.','n r d'],
['g','哥|gē','高|gāo','stop','velar','Raise the back of the tongue to the soft palate, then release with little air. Mandarin g is normally unvoiced.','k h d'],
['k','科|kē','看|kàn','stop','velar','Raise the tongue back to the soft palate and release with a strong puff. Compare English initial k.','g h t'],
['h','喝|hē','好|hǎo','fricative','velar','Narrow the space between tongue back and soft palate. Friction is farther back than ordinary English h.','f k g'],
['j','鸡|jī','家|jiā','affricate','palatal','Keep the tongue tip down and raise the tongue blade toward the hard palate. Release a brief closure into friction, with little air. Not English j.','q x z'],
['q','七|qī','去|qù','affricate','palatal','Keep the tongue tip down; raise the blade toward the hard palate and release with friction and a puff. Not English ch.','j x c'],
['x','西|xī','下|xià','fricative','palatal','Keep the tip down near the lower teeth and raise the blade toward the hard palate. Make continuous fine friction, without the closure in j/q.','q j s'],
['zh','知|zhī','找|zhǎo','affricate','retroflex','Raise the tongue tip toward the region behind the gum ridge. Release a brief closure into friction with little air. Farther back than z.','ch sh r'],
['ch','吃|chī','茶|chá','affricate','retroflex','Raise the tongue tip behind the gum ridge. Release a brief closure into friction with a strong puff. More retracted than English ch.','zh sh r'],
['sh','诗|shī','少|shǎo','fricative','retroflex','Raise the tongue tip behind the gum ridge and produce continuous friction without a closure. Farther back than s.','zh ch r'],
['r','日|rì','人|rén','approximant/fricative','retroflex','Raise the tongue tip behind the gum ridge and use voicing. Friction varies by speaker. This is not an exact match for English r.','sh zh l'],
['z','资|zī','早|zǎo','affricate','dental','Keep the tongue tip near the upper teeth/gum ridge. Release a brief closure into s-like friction, without a strong puff. Not English z.','c s zh'],
['c','词|cí','菜|cài','affricate','dental','Use a tongue-tip closure near the upper teeth, then release into s-like friction with a puff. Not English k.','z s ch'],
['s','丝|sī','三|sān','fricative','dental','Keep the tongue tip near the lower teeth and make a narrow passage near the upper teeth for continuous s-like friction.','z c sh'],
['w','乌|wū','我|wǒ','glide/spelling','rounded','Round the lips and raise the tongue back for a u-like onset. w marks the spelling of a syllable beginning with u; it is not a separate consonant in the traditional 21-initial inventory.','y l r'],
['y','衣|yī','也|yě','glide/spelling','front','Raise the tongue front toward the hard palate with the tip down. y marks zero-initial spelling of i/ü-family syllables; it is not always an English y consonant.','w j x']
];
const soundFinalData=[
['a','八|bā','大|dà','open','Open the jaw; keep the tongue low and the lips unrounded. English father is only a rough comparison.','o e ai'],
['o','波|bō','坡|pō','rounded','Round the lips for a mid-back vowel. After b/p/m/f, a brief u-like transition may be heard. Do not use an English long o glide.','uo u e'],
['e','哥|gē','河|hé','unrounded-back','Keep lips unrounded and raise the tongue back for a mid-back vowel. No exact ordinary English equivalent.','o a er'],
['i','衣|yī','米|mǐ','front','Keep the tongue high and forward with lips unrounded, roughly English ee. The i in zi/ci/si and zhi/chi/shi/ri has a different realization and is not used here.','ü ie in'],
['u','乌|wū','路|lù','back','Raise the tongue back and round the lips, roughly English oo with less gliding.','ü o uo'],
['ü','女|nǚ','绿|lǜ','front-rounded','Hold the tongue in the high-front position of i while rounding the lips. Unlike u, the tongue stays forward; no common English equivalent.','u i üe'],
['ai','白|bái','爱|ài','diphthong','Start with an open low vowel and glide toward i without making two separate syllables. English eye is approximate.','ei ao ia'],
['ei','杯|bēi','北|běi','diphthong','Start with a mid-front vowel and glide toward i. Compare English day approximately, without a consonant.','ai ui ie'],
['ui','归|guī','水|shuǐ','diphthong','ui abbreviates uei after a consonant: start rounded with u, move through e, and glide toward i.','ei uai uo'],
['ao','高|gāo','好|hǎo','diphthong','Start open and low, then glide toward a back rounded ending. Roughly English ow in how.','ou iao ai'],
['ou','口|kǒu','豆|dòu','diphthong','Start at a mid-back rounded vowel and close toward u; less open than ao.','ao iu o'],
['iu','九|jiǔ','六|liù','diphthong','iu abbreviates iou: begin with an i-like glide, then move through a back rounded vowel toward u.','ou iao ie'],
['ie','街|jiē','铁|tiě','front-glide','Begin with a high-front i-like glide and open into a front vowel. Keep lips unrounded.','üe ia ei'],
['üe','月|yuè','雪|xuě','front-rounded-glide','Begin with a rounded high-front ü position, then open toward a front vowel. Written ue after j/q/x and y, but pronounced with ü.','ie ü üan'],
['er','二|èr','耳|ěr','rhotic','Use a central vowel with an r-colored tongue posture; lips are relaxed. Do not add a separate English r syllable. er stands alone.','e en eng'],
['an','安|ān','看|kàn','n-coda','Open into a low vowel and finish with the tongue tip touching near the upper teeth for n; no extra vowel after n.','ang en ian'],
['en','门|mén','很|hěn','n-coda','Start with a central vowel, then touch the tongue tip to the upper gum area for n. Less open than an.','eng an in'],
['in','音|yīn','新|xīn','n-coda','Use high-front i followed by a tongue-tip n closure. Avoid the tongue-back ending of ing.','ing en ün'],
['un','春|chūn','轮|lún','n-coda','un here is the spelling of uen after a consonant: rounded u glide, central vowel, then tongue-tip n. It is distinct from ün in jun/qun/xun.','uen-placeholder ün ueng'],
['ün','云|yún','群|qún','n-coda','Use high-front rounded ü, then tongue-tip n. Dots are omitted after j/q/x and y: yun/qun still contain ü.','in un üan'],
['ang','方|fāng','忙|máng','ng-coda','Open the jaw for a low vowel, then raise the tongue back to the soft palate for ng. The tip does not close against the upper teeth.','an eng ong'],
['eng','灯|dēng','能|néng','ng-coda','Use a central/back vowel then a tongue-back ng closure. Contrast tongue-tip en.','en ang ing'],
['ing','星|xīng','听|tīng','ng-coda','Use high-front i, with a possible short transition, then raise the tongue back for ng rather than tongue-tip n.','in eng iong'],
['ong','东|dōng','红|hóng','ng-coda','Keep lips rounded and use a back vowel leading to tongue-back ng. Do not pronounce it as English long o.','eng iong uang'],
['ia','家|jiā','下|xià','front-glide','Begin with i, then lower the tongue and open the jaw toward a in one syllable.','ie ua iao'],
['iao','小|xiǎo','鸟|niǎo','front-glide','Begin with i, open toward a, then glide to a rounded back ending. All movements belong to one syllable.','ao iu ia'],
['ian','天|tiān','年|nián','n-coda','Start with i, open to a front vowel (not a full isolated a), and end with tongue-tip n.','iang an üan'],
['iang','香|xiāng','想|xiǎng','ng-coda','Begin with i, open toward a and finish with tongue-back ng, unlike the n in ian.','ian uang ang'],
['iong','兄|xiōng','穷|qióng','ng-coda','Use a front-to-rounded glide and a rounded vowel ending in tongue-back ng. The transition is not an English yong sequence of two syllables.','ong ing üan'],
['ua','花|huā','瓜|guā','back-glide','Round the lips for a u glide, then open the jaw and lips toward a.','uo ia uai'],
['uo','多|duō','火|huǒ','back-glide','Start with rounded u, then open to a mid-back rounded vowel. Keep it one syllable.','o ua ui'],
['uai','快|kuài','怀|huái','back-glide','Start with rounded u, open to a, then close toward i.','ui ai ua'],
['uan','关|guān','晚|wǎn','n-coda','Start with rounded u, open toward a and finish with tongue-tip n. Contrast üan, whose initial glide is high-front rounded.','uang üan an'],
['uang','光|guāng','黄|huáng','ng-coda','Start with u, open toward a and finish with tongue-back ng. Do not substitute the n of uan.','uan iang ang'],
['ueng','翁|wēng','瓮|wèng','ng-coda','Begin with a rounded u glide, then a central vowel and tongue-back ng. This final is conventionally spelled weng as a standalone syllable.','un eng ong'],
['üan','圆|yuán','远|yuǎn','n-coda','Begin in the high-front rounded ü position, open toward a front vowel, and finish with n. Written yuan or uan after j/q/x.','uan ian ün']
];
const phoneticBank={initials:soundInitialData.map(([id,a,b,kind,place,articulation,near])=>({id,kind,place,articulation,near:near.split(' '),examples:[a,b].map(s=>{const [hanzi,pinyin]=s.split('|');return {hanzi,pinyin}})})),finals:soundFinalData.map(([id,a,b,kind,articulation,near])=>({id,kind,articulation,near:near.replace('uen-placeholder','en').split(' '),examples:[a,b].map(s=>{const [hanzi,pinyin]=s.split('|');return {hanzi,pinyin}})}))};
let soundMode='initials',soundRound=null;
const soundSettings={initials:{difficulty:'intermediate',count:10,variation:true},finals:{difficulty:'intermediate',count:10,variation:true}};
function showSoundModes(){stopGame();hideGameMenus();$('gameModes').classList.add('hidden');$('initialsMenu').classList.remove('hidden');$('soundModes').classList.remove('hidden');$('soundConfig').classList.add('hidden')}
function configureSounds(mode){soundMode=mode;$('soundModes').classList.add('hidden');$('soundConfig').classList.remove('hidden');$('soundConfigTitle').textContent=mode==='initials'?'Initials configuration':'Finals configuration';const settings=soundSettings[mode];$('soundDifficulty').value=settings.difficulty;$('soundCount').value=String(settings.count);$('soundVariation').checked=settings.variation;$('soundInventory').textContent=phoneticBank[mode].map(x=>x.id).join(' · ')}
function soundOptions(target,mode,difficulty){const bank=phoneticBank[mode],rest=bank.filter(x=>x.id!==target.id),near=target.near.map(id=>bank.find(x=>x.id===id)).filter(Boolean);let candidates;if(difficulty==='advanced')candidates=[...shuffle(near),...shuffle(rest)];else if(difficulty==='intermediate')candidates=[...shuffle(near).slice(0,1),...shuffle(rest.filter(x=>x.kind===target.kind)),...shuffle(rest)];else candidates=[...shuffle(rest.filter(x=>!target.near.includes(x.id)&&x.kind!==target.kind)),...shuffle(rest)];const ids=[target.id];for(const candidate of candidates)if(!ids.includes(candidate.id)&&ids.length<4)ids.push(candidate.id);return shuffle(ids)}
function startInitials(onlyMissed=false){
 const settings={difficulty:$('soundDifficulty').value,count:Number($('soundCount').value),variation:$('soundVariation').checked};if(settings.difficulty==='expert'){alert('Expert needs validated recordings. Use Advanced with the device voice for now.');return}soundSettings[soundMode]=settings;
 const last=soundRound;let bank=phoneticBank[soundMode];if(onlyMissed&&last)bank=bank.filter(x=>last.performance[x.id]?.wrong>0);if(!bank.length){alert('No missed sounds to practice.');return}
 state.soundCoverage=state.soundCoverage||{};const coverage=state.soundCoverage[soundMode]||{},queue=[];let cycle=0;while(queue.length<settings.count){let batch=shuffle(bank).sort((a,b)=>(coverage[a.id]||0)-(coverage[b.id]||0));if(cycle++)batch=shuffle(bank);if(queue.length&&batch.length>1&&batch[0].id===queue.at(-1).target.id)[batch[0],batch[1]]=[batch[1],batch[0]];for(const target of batch){if(queue.length>=settings.count)break;queue.push({target,example:settings.variation?shuffle(target.examples)[0]:target.examples[0],options:soundOptions(target,soundMode,settings.difficulty)})}}
 soundRound={mode:soundMode,settings,queue,at:0,correct:0,wrong:0,started:Date.now(),performance:{},saved:false};showSoundQuestion();
}
function showSoundQuestion(){
 const r=soundRound;if(r.at>=r.queue.length){finishSounds();return}const q=r.queue[r.at],epoch=gameEpoch,at=r.at;let answered=false,heard=false;
 $('gameArea').innerHTML=gameTop('Initials & Finals — Pinyin Sound Challenge',(r.at+1)+' / '+r.queue.length+' · '+r.settings.difficulty)+'<progress style="width:100%" value="'+r.at+'" max="'+r.queue.length+'"></progress><h2 class="gamefeedback">Listen carefully. Which '+(r.mode==='initials'?'initial':'final')+' did you hear?</h2><div class="gamefeedback"><button id="soundReplay" class="primary">Replay audio</button></div><p class="small">You hear a complete syllable. Identify only its '+(r.mode==='initials'?'onset spelling':'final')+'. Tone is not scored.</p><div class="quizopts" id="soundAnswers"></div><p id="soundStatus" role="status" class="notice"></p><div id="soundExplanation"></div><button id="soundNext" disabled>Next exercise</button>';
 setupBack();const current=()=>activeGame==='initials'&&epoch===gameEpoch&&r===soundRound&&r.at===at;
 const listen=()=>{if(!current())return;heard=say(q.example.hanzi);for(const b of $('soundAnswers').children)b.disabled=answered||!heard;$('soundStatus').textContent=heard?'Listen, then choose one of four sounds.':'No Mandarin voice is available. Enable a Mandarin voice, then press Replay. This question is not scored until audio can be requested.'};
 for(const id of q.options){const b=document.createElement('button');b.textContent=id;b.style.fontSize='28px';b.disabled=true;b.onclick=()=>{if(!current()||answered||!heard)return;answered=true;for(const x of $('soundAnswers').children){x.disabled=true;if(x.textContent===q.target.id)x.classList.add('correct');else if(x===b)x.classList.add('wrong')}const correct=id===q.target.id;r[correct?'correct':'wrong']++;const perf=r.performance[q.target.id]||(r.performance[q.target.id]={correct:0,wrong:0});perf[correct?'correct':'wrong']++;state.soundCoverage[r.mode]=state.soundCoverage[r.mode]||{};state.soundCoverage[r.mode][q.target.id]=(state.soundCoverage[r.mode][q.target.id]||0)+1;save();$('soundStatus').textContent=(correct?'Correct! ':'Correct answer: '+q.target.id+'. ')+q.example.hanzi+' · '+q.example.pinyin;
 const desc=document.createElement('p');desc.textContent=q.target.articulation;$('soundExplanation').append(desc);if(!correct){const other=phoneticBank[r.mode].find(x=>x.id===id);const compare=document.createElement('p');compare.textContent='Compare '+id+': '+other.articulation;$('soundExplanation').append(compare)}$('soundNext').disabled=false};$('soundAnswers').append(b)}
 $('soundReplay').onclick=listen;$('soundNext').onclick=()=>{if(!current()||!answered)return;r.at++;showSoundQuestion()};listen();
}
function finishSounds(){const r=soundRound,seconds=Math.round((Date.now()-r.started)/1000);if(!r.saved){recordResult('sounds-'+r.mode,{correct:r.correct,wrong:r.wrong,seconds,performance:r.performance,difficulty:r.settings.difficulty});r.saved=true}
 $('gameArea').innerHTML=gameTop('Pinyin Sound Challenge — Results',r.mode)+'<div class="notice">'+r.queue.length+' questions · '+r.correct+' correct · '+r.wrong+' incorrect · '+Math.round(100*r.correct/r.queue.length)+'% · '+seconds+' seconds</div><h2>Performance by sound</h2><div id="soundResults"></div><p id="soundMisses"></p><div class="toolbar"><button id="soundAgain" class="primary">Repeat this session</button><button id="soundMissed">Practice missed sounds</button></div>';setupBack();for(const [id,p]of Object.entries(r.performance)){const row=document.createElement('p');row.textContent=id+': '+p.correct+' correct / '+p.wrong+' wrong';$('soundResults').append(row)}const missed=Object.entries(r.performance).filter(([,p])=>p.wrong).sort((a,b)=>b[1].wrong-a[1].wrong);$('soundMisses').textContent='Most missed: '+(missed.map(([id,p])=>id+' ('+p.wrong+')').join(', ')||'None');$('soundMissed').disabled=!missed.length;$('soundMissed').onclick=()=>{gameEpoch++;startInitials(true)};$('soundAgain').onclick=()=>{gameEpoch++;r.at=0;r.correct=0;r.wrong=0;r.started=Date.now();r.performance={};r.saved=false;showSoundQuestion()};
}

// Content hierarchy, learning and local content tools.
function contentModel(){
 if(!Array.isArray(state.levels))state.levels=[{id:'foundation',title:'Foundations'},{id:'extra',title:'Additional practice'}];
 if(!Array.isArray(state.lessons))state.lessons=[];
 for(const section of sections())if(!state.lessons.some(l=>l.section===section))state.lessons.push({id:'section:'+section,level:section.startsWith('Lesson ')?'foundation':'extra',title:section,section});
 return {levels:state.levels,lessons:state.lessons};
}
function refreshContent(){contentModel();fillSelect($('studyFilter'));fillSelect($('wordFilter'));fillGameSections();renderLearningLevels();updateStats()}
let learningWords=[],learningAt=0;
function renderLearningLevels(){const model=contentModel(),selected=$('learnLevel').value;$('learnLevel').replaceChildren();for(const l of model.levels){const o=document.createElement('option');o.value=l.id;o.textContent=l.title;$('learnLevel').append(o)}if(model.levels.some(l=>l.id===selected))$('learnLevel').value=selected;renderLearningLessons()}
function renderLearningLessons(){const selected=$('learnLesson').value;$('learnLesson').replaceChildren();for(const l of contentModel().lessons.filter(l=>l.level===$('learnLevel').value)){const o=document.createElement('option');o.value=l.id;o.textContent=l.title;$('learnLesson').append(o)}if([...$('learnLesson').options].some(o=>o.value===selected))$('learnLesson').value=selected;loadLearningLesson()}
function selectedLesson(){return contentModel().lessons.find(l=>l.id===$('learnLesson').value)}
function loadLearningLesson(){learningAt=0;const lesson=selectedLesson();learningWords=lesson?state.words.filter(w=>inSection(w,lesson.section)):[];renderLearningWord()}
function renderLearningWord(){const w=learningWords[learningAt];$('learnHanzi').textContent=w?.hanzi||'No content yet';$('learnPinyin').textContent=w?.pinyin||'';$('learnMeaning').textContent=w?.meaning||'';$('learnExample').textContent=w?.example||'';$('learnPosition').textContent=learningWords.length?(learningAt+1)+' / '+learningWords.length:'0 / 0';$('learnPrevious').disabled=!learningAt;$('learnNext').disabled=learningAt>=learningWords.length-1;$('learnListen').disabled=!w;$('learnPractice').disabled=!w;if(w){state.learned=state.learned||{};state.learned[w.id]=true;save()}}
function playLearningWord(){const w=learningWords[learningAt];if(!w)return;if(w.audio){if(window.lessonAudio)window.lessonAudio.pause();window.lessonAudio=new Audio(w.audio);window.lessonAudio.play().catch(()=>audioMessage('Recorded audio could not play. Use the device voice button.'))}else say(w.hanzi)}
function renderProgress(){const seen=Object.keys(state.learned||{}).length;$('progressSummary').textContent=seen+' words viewed · '+todayCount()+' reviews today · data saved only in this browser.';$('progressRows').replaceChildren();for(const r of (state.results||[]).slice().reverse()){const p=document.createElement('p');p.textContent=new Date(r.date).toLocaleString()+' · '+r.game+' · '+(r.correct||0)+' correct / '+(r.wrong||0)+' wrong'+(r.assisted?' · '+r.assisted+' with hints':'');$('progressRows').append(p)}}
const unsafeKeys=new Set(['__proto__','constructor','prototype']);
function validateBackup(d){
 if(!d||!Array.isArray(d.words)||d.words.length>10000)throw Error('Backup must contain a words array (maximum 10,000).');
 const ids=new Set();for(const [i,w]of d.words.entries()){for(const k of ['id','hanzi','pinyin','meaning'])if(typeof w?.[k]!=='string'||!w[k].trim()||w[k].length>1000)throw Error('Word '+(i+1)+': invalid '+k);if(ids.has(w.id))throw Error('Word '+(i+1)+': duplicate ID');ids.add(w.id);if(w.sections&&!Array.isArray(w.sections))throw Error('Word '+(i+1)+': invalid sections');for(const k of ['due','interval','errors'])if(w[k]!==undefined&&(!Number.isFinite(w[k])||w[k]<0))throw Error('Word '+(i+1)+': invalid '+k)}
 if(d.deleted!==undefined&&(!Array.isArray(d.deleted)||d.deleted.some(x=>typeof x!=='string')))throw Error('Invalid deletion list');
 for(const k of ['levels','lessons','results'])if(d[k]!==undefined&&!Array.isArray(d[k]))throw Error('Invalid '+k);
 for(const k of ['days','games','learned'])if(d[k]!==undefined&&(!d[k]||typeof d[k]!=='object'||Array.isArray(d[k])||Object.keys(d[k]).some(x=>unsafeKeys.has(x))))throw Error('Invalid '+k);
 for(const [i,w]of d.words.entries()){if(w.section!==undefined&&typeof w.section!=='string')throw Error('Word '+(i+1)+': invalid section');if(w.sections&&w.sections.some(x=>typeof x!=='string'))throw Error('Invalid section membership')}
 if(d.levels&&d.levels.some(x=>!x||typeof x.id!=='string'||typeof x.title!=='string'))throw Error('Invalid levels');
 if(d.lessons&&d.lessons.some(x=>!x||typeof x.id!=='string'||typeof x.title!=='string'||typeof x.section!=='string'||typeof x.level!=='string'))throw Error('Invalid lessons');
 if(d.results&&d.results.some(x=>!x||typeof x.game!=='string'||typeof x.date!=='string'))throw Error('Invalid results');
 for(const k of ['days','games'])if(d[k]&&Object.values(d[k]).some(x=>!Number.isFinite(x)||x<0))throw Error('Invalid '+k+' counts');
 return JSON.parse(JSON.stringify(d));
}
function restoreBackup(data){const d=validateBackup(data);if(storageBlocked)throw Error('Saving is paused. Recover your stored data first.');const before=localStorage.getItem(KEY);if(before)localStorage.setItem(KEY+'-before-restore',before);const candidate={words:[],days:{},games:{},deleted:[],results:[],...d,version:4};localStorage.setItem(KEY,JSON.stringify(candidate));state=candidate;contentModel();refreshContent();renderRows();renderCard();}
// Atomic content validation. Existing IDs never silently overwrite content.
function validateLessonFile(d){
 const errors=[],duplicates=[],items=[],levels=[],lessons=[];const model=contentModel();
 if(!d||!Array.isArray(d.levels)||!Array.isArray(d.lessons)||!Array.isArray(d.items)||d.items.length>5000)return {errors:['Expected levels, lessons and items arrays; maximum 5,000 items.'],duplicates,items,levels,lessons};
 const lv=new Map(model.levels.map(x=>[x.id,x])),ls=new Map(model.lessons.map(x=>[x.id,x]));
 for(const [i,l]of d.levels.entries()){if(typeof l?.id!=='string'||!l.id.trim()||unsafeKeys.has(l.id)||typeof l.title!=='string'||!l.title.trim()){errors.push('Level '+(i+1)+': id and title required');continue}if(lv.has(l.id)){if(lv.get(l.id).title!==l.title)errors.push('Level '+l.id+': conflicting title')}else{const clean={id:l.id,title:l.title};lv.set(l.id,clean);levels.push(clean)}}
 for(const [i,l]of d.lessons.entries()){if(typeof l?.id!=='string'||!l.id.trim()||typeof l.title!=='string'||!lv.has(l.level)){errors.push('Lesson '+(i+1)+': id, title and valid level required');continue}if(ls.has(l.id)){if(ls.get(l.id).level!==l.level||ls.get(l.id).title!==l.title)errors.push('Lesson '+l.id+': conflicting definition')}else{const clean={id:l.id,title:l.title,level:l.level,section:l.title+' ['+l.id+']'};ls.set(l.id,clean);lessons.push(clean)}}
 const ids=new Set();for(const [i,input]of d.items.entries()){const w={...input,level:input?.level??input?.nivel,lesson:input?.lesson??input?.leccion,meaning:input?.meaning??input?.traduccion,tones:input?.tones??input?.tonos,type:input?.type??input?.tipo,category:input?.category??input?.categoria,difficulty:input?.difficulty??input?.dificultad};const row='Record '+(i+1)+': ';let bad=false;const fail=m=>{errors.push(row+m);bad=true};for(const k of ['id','hanzi','pinyin','meaning','level','lesson'])if(typeof w[k]!=='string'||!w[k].trim()||w[k].length>1000)fail(k+' must be a nonempty string');if(!ls.has(w.lesson)||ls.get(w.lesson)?.level!==w.level)fail('lesson/level reference is invalid');if(w.type&&!['word','phrase','palabra','frase'].includes(w.type))fail('type must be word or phrase');const parts=typeof w.pinyin==='string'?syllables(w):[];if(w.tones!==undefined&&(!Array.isArray(w.tones)||w.tones.length!==parts.length||w.tones.some((t,j)=>!Number.isInteger(t)||t<1||t>5||t!==markedTone(parts[j]))))fail('tones must match marked pinyin (1–5), one per syllable');if(w.audio!==undefined&&(typeof w.audio!=='string'||!(/^(https:\/\/|\/(?!\/))/.test(w.audio))))fail('audio must be an HTTPS URL or a root-relative path');if(w.difficulty!==undefined&&(!Number.isInteger(w.difficulty)||w.difficulty<1||w.difficulty>5))fail('difficulty must be 1–5');if(ids.has(w.id))fail('duplicate ID within file');ids.add(w.id);if(bad)continue;const old=state.words.find(x=>x.id===w.id);if(old){if(old.hanzi!==w.hanzi||old.pinyin!==w.pinyin||old.meaning!==w.meaning)fail('existing ID has different content; use a new ID or edit explicitly');else duplicates.push(w.id);continue}
 const same=state.words.find(x=>x.hanzi===w.hanzi&&x.pinyin===w.pinyin&&x.meaning===w.meaning);items.push({id:w.id,hanzi:w.hanzi,pinyin:w.pinyin,meaning:w.meaning,section:ls.get(w.lesson)?.section,category:w.category||'imported',type:['phrase','frase'].includes(w.type)?'phrase':'word',difficulty:w.difficulty||1,audio:w.audio||'',example:typeof w.example==='string'?w.example:'',due:0,interval:0,errors:0,existingId:same?.id});if(same)duplicates.push(w.id+' shares vocabulary with '+same.id);
 }
 return {errors,duplicates,items,levels,lessons};
}
function applyLessonFile(report){if(report.errors.length)throw Error('Fix all validation errors before import');const next=JSON.parse(JSON.stringify(state));next.levels.push(...report.levels);next.lessons.push(...report.lessons);for(const item of report.items){const {existingId,...w}=item;if(existingId){const old=next.words.find(x=>x.id===existingId);old.sections=[...new Set([...memberships(old),w.section])]}else next.words.push(w)}if(storageBlocked)throw Error('Saving is paused');localStorage.setItem(KEY+'-before-content',JSON.stringify(state));localStorage.setItem(KEY,JSON.stringify(next));state=next;refreshContent();return report.items.length}
let pendingContent=null;
$('learnLevel').onchange=renderLearningLessons;$('learnLesson').onchange=loadLearningLesson;$('learnPrevious').onclick=()=>{learningAt--;renderLearningWord()};$('learnNext').onclick=()=>{learningAt++;renderLearningWord()};$('learnListen').onclick=playLearningWord;$('learnVoice').onclick=()=>learningWords[learningAt]&&say(learningWords[learningAt].hanzi);$('learnPractice').onclick=()=>{const lesson=selectedLesson();go('games');for(const type of ['memory','quiz','tone'])$(type+'Section').value=lesson.section;renderLessonButtons('memory');renderLessonButtons('quiz')};
$('contentFile').onchange=async e=>{pendingContent=null;$('applyContent').disabled=true;try{const f=e.target.files[0];if(!f)return;if(f.size>2000000)throw Error('Maximum file size: 2 MB');const r=validateLessonFile(JSON.parse(await f.text()));pendingContent=r;$('contentReport').textContent=r.items.length+' new entries · '+r.duplicates.length+' duplicates or shared entries · '+r.errors.length+' errors\n'+r.errors.join('\n');$('applyContent').disabled=!!r.errors.length}catch(err){$('contentReport').textContent=err.message}};
$('applyContent').onclick=()=>{if(!pendingContent||pendingContent.errors.length)return;if(!confirm('Import this validated content into this browser only?'))return;try{applyLessonFile(pendingContent);pendingContent=null;$('applyContent').disabled=true;$('contentReport').textContent='Content imported locally. New levels and lessons are ready.'}catch(e){$('contentReport').textContent=e.message}};
$('import').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>2000000)throw Error('File too large');const d=JSON.parse(await f.text());validateBackup(d);if(!confirm('Restore this backup? It replaces this browser’s current collection and progress with the backup, including edits and deletions. A recovery copy of the current data will be kept.'))return;restoreBackup(d);alert('Backup restored, including edits, deletions and progress.')}catch(err){alert('Backup not restored: '+err.message)}finally{e.target.value=''}};
$('recoverData').onclick=()=>{const raw=localStorage.getItem(KEY+'-before-restore')||localStorage.getItem(KEY+'-before-v4');if(!raw){alert('No recovery snapshot is available');return}if(confirm('Restore the recovery snapshot?'))try{restoreBackup(JSON.parse(raw))}catch(e){alert(e.message)}};
$('memorySection').onchange=()=>{renderLessonButtons('memory');updateCardOptions()};
contentModel();renderLearningLevels();updateCardOptions();go('home');

$('chooseInitials').onclick=()=>configureSounds('initials');$('chooseFinals').onclick=()=>configureSounds('finals');$('soundModeBack').onclick=showSoundModes;
