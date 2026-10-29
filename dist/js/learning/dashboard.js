import {learningSummary,wordMastery,ensureLearning,achievementDefinitions,learningSkills} from './srs.js';
const dashNode=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
export function renderLearningDashboard(host,state){
 if(!host)return;const summary=learningSummary(state);host.replaceChildren();
 host.setAttribute('aria-label','Learning overview');
 const grid=dashNode('div',undefined,'learning-stats');
 for(const [value,label]of [[summary.xp,'XP earned'],[summary.streak,'day learning streak'],[Math.min(summary.daily,5)+' / 5','different words practiced today'],[summary.due,'words due for a skill review']]){
  const card=dashNode('div',undefined,'learning-stat');card.append(dashNode('strong',String(value)),dashNode('span',label));grid.append(card);
 }
 const goal=dashNode('progress');goal.max=5;goal.value=Math.min(summary.daily,5);goal.setAttribute('aria-label','Daily practice: '+summary.daily+' of 5 words');
 host.append(grid,goal,dashNode('p','Practice three different words to keep a streak, and five to reach your daily goal. XP rewards correct, unassisted reviews that are due.','small'));
}
export function renderLearningDetails(host,state){
 if(!host)return;renderLearningDashboard(host,state);const l=ensureLearning(state);
 host.append(dashNode('h3','Achievements'));const achievements=dashNode('ul',undefined,'achievement-list');
 for(const a of achievementDefinitions){const row=dashNode('li',undefined,l.achievements[a.id]?'achievement unlocked':'achievement');row.append(dashNode('strong',(l.achievements[a.id]?'Unlocked: ':'Goal: ')+a.title),dashNode('span',a.description));achievements.append(row)}host.append(achievements);
 host.append(dashNode('h3','Vocabulary mastery by skill'),dashNode('p','Estimated from spaced, unassisted evidence. Viewing a word, using a hint, or matching a speech transcript does not establish mastery.','small'));
 const wrapper=dashNode('div',undefined,'table-scroll');wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','Vocabulary skill progress');
 const table=dashNode('table'),caption=dashNode('caption','Practiced vocabulary (most recent first; dates use this device’s time zone)'),head=dashNode('thead'),tr=dashNode('tr');
 for(const text of ['Word','Recognition','Listening','Writing','Context','Next review']){const th=dashNode('th',text);th.setAttribute('scope','col');tr.append(th)}head.append(tr);const body=dashNode('tbody');
 const words=(state.words||[]).filter(w=>l.words[w.id]).sort((a,b)=>Math.max(...Object.values(l.words[b.id].skills).map(s=>s.last),0)-Math.max(...Object.values(l.words[a.id].skills).map(s=>s.last),0));
 for(const w of words){const m=wordMastery(l,w.id),row=dashNode('tr'),label=dashNode('th',w.hanzi+' · '+w.meaning);label.setAttribute('scope','row');row.append(label);for(const key of learningSkills)row.append(dashNode('td',l.words[w.id].skills[key]?m.skills[key]+'%':'Not practiced'));
  const due=Object.values(l.words[w.id].skills).filter(s=>s.correct||s.errors).map(s=>s.next);const next=due.length?Math.min(...due):null;
  row.append(dashNode('td',next===null?'No scored schedule':next<=Date.now()?'Due now':new Date(next).toLocaleDateString()));body.append(row);
 }
 table.append(caption,head,body);wrapper.append(table);host.append(wrapper);
 if(!words.length)host.append(dashNode('p','Complete an activity to begin building your skill history.'));
}
