/** Additive local learning schema. Never rewrites legacy word schedules or awards retroactive XP. */
export const learningSkills=['recognition','listening','writing','context'];
export const learningDayMs=86400000;
const learningIntervals=[0,1,3,7,14,30,60,90];
export function learningDay(now=Date.now()){const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function learningPreviousDay(day){return new Date(Date.parse(day+'T12:00:00Z')-learningDayMs).toISOString().slice(0,10)}
export function ensureLearning(state,now=Date.now()){
 if(!state.learning)state.learning={version:1,xp:0,words:{},days:{},achievements:{},completed:{},streak:{lastDay:"",count:0,best:0},migratedAt:now};
 if(!state.learning.streak)state.learning.streak={lastDay:"",count:0,best:0};
 return state.learning;
}
export function learningSkill(q){
 if(q.type==='speaking'||q.type==='self-review')return null;
 if(q.type==='listening'||q.type==='dictation'&&q.input==='pinyin')return 'listening';
 if(q.type==='dictation'&&q.input!=='characters'||q.type==='translation'&&q.id.endsWith(':en-zh')&&q.input==='text')return 'writing';
 if(['reading','builder','blanks','stories','roleplay'].includes(q.type))return 'context';
 return 'recognition';
}
function learningSkillRecord(learning,word,skill){
 const entry=learning.words[word.id]||(learning.words[word.id]={skills:{}});
 if(!entry.skills[skill])entry.skills[skill]={correct:0,errors:0,attempts:0,assisted:0,stage:0,first:0,last:0,next:skill==='recognition'&&word.interval>0?word.due||0:0,interval:0,lastCreditDay:'',history:[]};
 return entry.skills[skill];
}
function learningDaily(learning,day){return learning.days[day]||(learning.days[day]={xp:0,words:{},activities:{}})}
function updateLearningStreak(learning,day){
 const streak=learning.streak;
 if(Object.keys(learning.days[day]?.words||{}).length<3||day<=streak.lastDay)return;
 streak.count=streak.lastDay===learningPreviousDay(day)?streak.count+1:1;
 streak.lastDay=day;streak.best=Math.max(streak.best,streak.count);
}
export function learningStreak(learning,now=Date.now()){
 const day=learningDay(now),streak=learning.streak;
 if(!streak)return 0;
 return streak.lastDay===day||streak.lastDay===learningPreviousDay(day)?streak.count:0;
}
export function skillMastery(skill,now=Date.now()){
 if(!skill||!skill.correct)return 0;
 const accuracy=skill.correct/Math.max(1,skill.correct+skill.errors),span=skill.first?now-skill.first:0;
 const spacing=Math.min(1,span/(7*learningDayMs));
 const overdue=skill.next<now?Math.max(.45,1-(now-skill.next)/Math.max(learningDayMs,skill.interval*learningDayMs*2)):1;
 return Math.round(Math.min(skill.stage===0?.3:1,skill.correct/5)*accuracy*(.7+.3*spacing)*overdue*100);
}
export function wordMastery(learning,wordId,now=Date.now()){
 const skills=learning.words[wordId]?.skills||{};
 const core=['recognition','listening','writing'].map(key=>skillMastery(skills[key],now));
 const practiced=core.filter(n=>n>0).length;
 // Unseen skills stay at zero. Context comprehension alone cannot imply word mastery.
 const percent=Math.round(core.reduce((a,b)=>a+b,0)/3);
 const secure=['recognition','listening','writing'].filter(key=>{const s=skills[key];return s&&s.stage>=4&&s.correct>=4&&s.first>0&&now-s.first>=7*learningDayMs&&s.correct/Math.max(1,s.correct+s.errors)>=.8&&skillMastery(s,now)>=70}).length;
 return {percent,practiced,mastered:secure>=2&&percent>=70&&['recognition','listening','writing'].every(key=>!skills[key]||skills[key].stage>0),skills:Object.fromEntries(learningSkills.map(key=>[key,skillMastery(skills[key],now)]))};
}
export function learningSummary(state,words=state.words||[],now=Date.now()){
 const learning=ensureLearning(state,now),today=learning.days[learningDay(now)],ids=new Set(words.map(w=>w.id));
 let total=0,mastered=0,due=0;
 for(const word of words){const m=wordMastery(learning,word.id,now);total+=m.percent;if(m.mastered)mastered++;const skills=learning.words[word.id]?.skills||{};if(Object.values(skills).some(s=>s.next<=now&&(s.correct||s.errors)))due++}
 return {xp:learning.xp,streak:learningStreak(learning,now),daily:Object.keys(today?.words||{}).filter(id=>ids.has(id)).length,goal:5,mastered,mastery:words.length?Math.round(total/words.length):0,due,achievements:learning.achievements};
}
export function lessonLearningSummary(state,words,lessonId,available=[],now=Date.now()){
 const summary=learningSummary(state,words,now),done=state.learning.completed[lessonId]||{};
 const completed=available.filter(id=>done[id]).length;
 return {...summary,completed,available:available.length,progress:available.length?Math.round((summary.mastery+completed/available.length*100)/2):summary.mastery};
}
export const achievementDefinitions=[
 {id:'first-correct',title:'First step',description:'Record a correct, unassisted answer in a scheduled review.'},
 {id:'daily-five',title:'Daily explorer',description:'Practice five different words in one day.'},
 {id:'three-day',title:'Steady learner',description:'Practice at least three different words on three consecutive days.'},
 {id:'three-skills',title:'Skill explorer',description:'Practice recognition, listening and writing without hints.'},
 {id:'first-mastered',title:'Lasting memory',description:'Build spaced evidence of mastery in more than one skill.'}
];
export function refreshLearningAchievements(state,now=Date.now()){
 const l=ensureLearning(state,now),all=Object.values(l.words),unlock=id=>{if(!l.achievements[id])l.achievements[id]=now};
 if(all.some(w=>Object.values(w.skills).some(s=>s.correct>0)))unlock('first-correct');
 if(Object.keys(l.days[learningDay(now)]?.words||{}).length>=5)unlock('daily-five');
 if(learningStreak(l,now)>=3)unlock('three-day');
 if(['recognition','listening','writing'].every(key=>all.some(w=>w.skills[key]?.correct>0)))unlock('three-skills');
 if((state.words||[]).some(w=>wordMastery(l,w.id,now).mastered))unlock('first-mastered');
}
export function recordLearningAttempt(state,q,correct,{assisted=false,now=Date.now()}={}){
 const l=ensureLearning(state,now),day=learningDay(now),daily=learningDaily(l,day),skill=learningSkill(q);
 const ids=[...new Set(q.wordIds||[])],words=new Map((state.words||[]).map(w=>[w.id,w]));let xp=0;
 for(const id of ids){const word=words.get(id);if(!word)continue;
  // Reflections may support a habit, but hints and self-ratings never award XP or mastery.
  daily.words[id]=true;
  if(!skill)continue;
  const s=learningSkillRecord(l,word,skill);s.attempts++;s.last=now;
  if(assisted){s.assisted++;continue}
  const due=s.next<=now,credited=due&&s.lastCreditDay!==day;
  if(credited){s.lastCreditDay=day;if(!s.first)s.first=now;
   if(correct){s.correct++;s.stage=Math.min(learningIntervals.length-1,s.stage+1);s.interval=learningIntervals[s.stage];s.next=now+s.interval*learningDayMs;
    const reward=Math.min(Math.max(1,Math.floor(8/ids.length)),8-xp,120-daily.xp);xp+=Math.max(0,reward);daily.xp+=Math.max(0,reward);
   }else{s.errors++;s.lastErrorDay=day;s.stage=0;s.interval=0;s.next=now+60000}
  }else if(!correct){s.lastCreditDay=day;if(s.lastErrorDay!==day){s.errors++;s.lastErrorDay=day}s.stage=0;s.interval=0;s.next=now+60000}
  else if(due)s.next=now+learningDayMs;
  s.history.push({at:now,correct,credited});s.history=s.history.slice(-20);
 }
 l.xp+=xp;updateLearningStreak(l,day);
 const days=Object.keys(l.days).sort();for(const key of days.slice(0,Math.max(0,days.length-400)))delete l.days[key];
 refreshLearningAchievements(state,now);return {xp,skill};
}
export function recordLearningCompletion(state,session){
 const l=ensureLearning(state);if(!session.completed||!session.activity||typeof session.lesson!=='string'||(session.correct||0)+(session.wrong||0)+(session.assisted||0)<3)return;
 l.completed[session.lesson]=l.completed[session.lesson]||{};
 l.completed[session.lesson][session.activity]=Date.parse(session.date)||Date.now();
 const day=learningDaily(l,learningDay(Date.parse(session.date)||Date.now()));day.activities[session.activity]=true;
}
export function learningQuestionPriority(q,learning,now=Date.now()){
 if(!learning)return 0;const skill=learningSkill(q);if(!skill)return 0;
 return (q.wordIds||[]).reduce((score,id)=>{const s=learning.words[id]?.skills[skill];if(!s)return score+3;if(s.next>now)return score+(s.next-now<=6*3600000?2:-15);return score+8+Math.min(20,(now-s.next)/learningDayMs)+Math.min(10,s.errors*2)},0)/Math.max(1,q.wordIds?.length||0);
}
/** Reject malformed new-schema backups before the existing atomic restore writes anything. */
export function validateLearningData(l){
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x),unsafe=k=>['__proto__','constructor','prototype'].includes(k),finite=n=>Number.isFinite(n)&&n>=0;
 if(!object(l)||l.version!==1||!finite(l.xp)||!object(l.words)||!object(l.days)||!object(l.completed)||!object(l.achievements))throw Error('Invalid learning progress');
 if(l.streak!==undefined&&(!object(l.streak)||typeof l.streak.lastDay!=='string'||l.streak.lastDay!==''&&!/^\d{4}-\d{2}-\d{2}$/.test(l.streak.lastDay)||!finite(l.streak.count)||!finite(l.streak.best)))throw Error('Invalid learning streak');
 if(Object.keys(l.words).length>10000||Object.keys(l.days).length>400)throw Error('Learning progress exceeds limits');
 for(const [id,entry]of Object.entries(l.words)){if(unsafe(id)||!object(entry)||!object(entry.skills))throw Error('Invalid learning word');for(const [key,s]of Object.entries(entry.skills)){if(!learningSkills.includes(key)||!object(s)||!['correct','errors','attempts','assisted','stage','first','last','next','interval'].every(k=>finite(s[k]))||!Number.isInteger(s.stage)||s.stage>7||!Array.isArray(s.history)||s.history.length>20||s.history.some(h=>!object(h)||!finite(h.at)||typeof h.correct!=='boolean'||typeof h.credited!=='boolean'))throw Error('Invalid learning skill '+id)}}
 for(const [day,d]of Object.entries(l.days))if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!object(d)||!finite(d.xp)||d.xp>120||!object(d.words)||!object(d.activities)||Object.keys(d.words).some(unsafe))throw Error('Invalid learning day');
 for(const [lesson,activities]of Object.entries(l.completed))if(unsafe(lesson)||!object(activities)||Object.entries(activities).some(([key,n])=>unsafe(key)||!finite(n)))throw Error('Invalid lesson completion');
 for(const [id,n]of Object.entries(l.achievements))if(!achievementDefinitions.some(a=>a.id===id)||!finite(n))throw Error('Invalid learning achievement');
 return l;
}
