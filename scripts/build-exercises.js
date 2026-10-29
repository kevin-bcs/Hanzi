import fs from 'node:fs';
import {validateReading} from '../dist/js/readings/validator.js';
import {validateExercises} from '../dist/js/learning/content-validator.js';
const vocabulary=JSON.parse(fs.readFileSync('content/vocabulary/vocabulary.json','utf8'));
const lessons=fs.readdirSync('content/lessons').filter(n=>n.endsWith('.json')&&!n.includes('template')).map(n=>JSON.parse(fs.readFileSync('content/lessons/'+n,'utf8')));
const sentences=JSON.parse(fs.readFileSync('content/exercises/sentences.json','utf8'));
const scenarios=JSON.parse(fs.readFileSync('content/exercises/scenarios.json','utf8'));
const errors=validateExercises({sentences,scenarios},vocabulary,lessons);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
const byId=new Map(vocabulary.map(w=>[w.id,w]));
const readings=lessons.filter(l=>sentences.filter(s=>s.lesson===l.id).length>=3).map(l=>{
 const bank=sentences.filter(s=>s.lesson===l.id);
 return {id:'practice-'+l.id,title:l.title+' — Short reading',titleHanzi:bank[0].text,category:'daily-life',level:'beginner',version:1,lesson:l.id,
 description:'Short lines from this lesson. Read each line, then check its meaning. These are independent examples, not a continuous conversation.',
 speakers:[{id:'a',name:'Lesson examples'}],turns:bank.map((s,i)=>({id:s.id,speaker:'a',order:i+1,text:s.text,translation:s.english,units:[...s.tokens.map(id=>{const w=byId.get(id),hanzi=w.hanzi.split('/')[0].trim(),pinyin=w.pinyin.split('/')[0].trim();return {hanzi,pinyin,gloss:w.english,kind:'word',alignment:Array.from(hanzi).map((h,i)=>({hanzi:h,pinyin:pinyin.split(/\s+/)[i]}))}}),{kind:'punctuation',hanzi:s.text.slice(-1)}]})),
 questions:bank.map(s=>({id:s.id+'-meaning',prompt:'What does “'+s.text+'” mean?',options:[s.english,...bank.filter(x=>x.id!==s.id).map(x=>x.english)],answer:0,explanation:s.explanation,evidence:[s.id]}))};
});
for(const r of readings){const invalid=validateReading(r,[{id:'daily-life'}]);if(invalid.length)throw Error('content/exercises/sentences.json '+r.lesson+': '+invalid.join('; '))}
const data={sentences,scenarios,readings};
const out='dist/js/data/generated-exercises.js';fs.writeFileSync(out+'.tmp','/** GENERATED. Edit content/exercises, then npm run build:content. */\nexport const exerciseContent='+JSON.stringify(data)+';\n');fs.renameSync(out+'.tmp',out);
console.log('Validated '+sentences.length+' sentences, '+scenarios.length+' branching scenarios and '+readings.length+' lesson readings');
