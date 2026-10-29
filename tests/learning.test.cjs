const assert = require('node:assert/strict');
(async()=>{
 const {centralLessons,lessonWords,lessonOverview}=await import('../dist/js/learning/model.js');
 const {starter,contentLessons}=await import('../dist/js/data/vocabulary.js');
 const lessons=centralLessons(contentLessons);assert.equal(lessons.length,5);
 for(const lesson of lessons){const words=lessonWords(starter,lesson);assert(words.length>0);assert(words.every(w=>w.sections.includes(lesson.section)));}
 assert.equal(lessonWords(starter,null).length,174);
 assert.equal(lessonWords(starter,{section:'missing'}).length,0);
 const w=lessonWords(starter,lessons[0]);const summary=lessonOverview(w,{[w[0].id]:true},0);
 assert.equal(summary.viewed,1);assert.equal(summary.total,18);assert.equal(summary.percent,6);assert(summary.choices>=4);
 assert.equal(lessonOverview([]).percent,0);
 console.log('PASS Learning Center lesson boundaries, catalog, eligibility and viewed progress');
})().catch(e=>{console.error(e);process.exitCode=1});
