import {recordLearningAttempt,recordLearningCompletion} from './srs.js';
/** Additive progress schema: the legacy key, words, schedules and backups are untouched. */
export function practiceHistory(state){
 if(!state.practice||state.practice.version!==1||!state.practice.items||Array.isArray(state.practice.items)||typeof state.practice.items!=='object')state.practice={version:1,items:{},sessions:[]};
 if(!Array.isArray(state.practice.sessions))state.practice.sessions=[];
 state.practice.sessions=state.practice.sessions.filter(s=>s&&typeof s==='object'&&typeof s.id==='string');
 return state.practice;
}
export function recordPracticeAttempt(state,q,correct,{assisted=false,now=Date.now(),lesson='*'}={}){
 const history=practiceHistory(state);const old=history.items[q.id];const item=old&&typeof old==='object'?old:{};
 const num=n=>Number.isFinite(n)&&n>=0?n:0;
 item.correct=num(item.correct);item.errors=num(item.errors);item.assisted=num(item.assisted);
 if(assisted)item.assisted++;else if(correct)item.correct++;else item.errors++;
 item.last=now;item.wordIds=q.wordIds;item.type=q.type;item.lesson=lesson;
 // A successful correction waits a day; a missed item waits one minute. Session queues are finite.
 if(!assisted){item.next=now+(correct?86400000:60000);item.lastCorrect=correct;}else if(item.next===undefined)item.next=0;
 history.items[q.id]=item;
 const keys=Object.keys(history.items);if(keys.length>2500){keys.sort((a,b)=>history.items[a].last-history.items[b].last);for(const key of keys.slice(0,keys.length-2500))delete history.items[key]}
 item.lastXp=recordLearningAttempt(state,q,correct,{assisted,now}).xp;
 return item;
}
export function recordPracticeSession(state,session){const h=practiceHistory(state);if(h.sessions.some(s=>s.id===session.id))return false;h.sessions.push(session);h.sessions=h.sessions.slice(-200);recordLearningCompletion(state,session);return true}
