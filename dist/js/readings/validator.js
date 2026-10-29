/** Pure content contract shared by local build and tests. */
export const readingLevels=['beginner','elementary','intermediate','advanced'];
export function validateReading(r,categories){
 const errors=[],fail=(field,message)=>errors.push(field+': '+message),text=x=>typeof x==='string'&&x.trim();
 for(const k of ['id','title','titleHanzi','category','level','description'])if(!text(r?.[k]))fail(k,'required text');
 if(!categories.some(c=>c.id===r.category))fail('category','unknown category');if(!readingLevels.includes(r.level))fail('level','invalid level');if(!Number.isInteger(r.version)||r.version<1)fail('version','positive integer required');
 const unique=(items,field)=>{if(!Array.isArray(items)||!items.length){fail(field,'nonempty array required');return []}const seen=new Set();items.forEach((x,i)=>{if(!text(x.id)||seen.has(x.id))fail(field+'.'+i+'.id','missing or duplicate');seen.add(x.id)});return items};
 const speakers=unique(r.speakers,'speakers');for(const [i,s]of speakers.entries())if(!text(s.name))fail('speakers.'+i+'.name','required');
 for(const [i,t]of unique(r.turns,'turns').entries()){
 if(t.order!==i+1)fail('turns.'+i+'.order','must match array order, starting at 1');if(!speakers.some(s=>s.id===t.speaker))fail('turns.'+i+'.speaker','unknown speaker');if(!text(t.text)||!text(t.translation))fail('turns.'+i,'text and translation required');if(!Array.isArray(t.units)||!t.units.length){fail('turns.'+i+'.units','required');continue}
 if(t.units.map(u=>u.hanzi).join('')!==t.text)fail('turns.'+i+'.units','must reconstruct Chinese text exactly');
 for(const [j,u]of t.units.entries()){const p='turns.'+i+'.units.'+j;if(!text(u.hanzi))fail(p+'.hanzi','required');if(u.kind!=='punctuation'){if(!text(u.pinyin)||!text(u.gloss))fail(p,'pinyin and contextual gloss required');if(!Array.isArray(u.alignment)||u.alignment.map(a=>a.hanzi).join('')!==u.hanzi||u.alignment.map(a=>a.pinyin).join(' ')!==u.pinyin||u.alignment.some(a=>(Array.from(a.hanzi).length!==1&&!(a.hanzi.endsWith('儿')&&a.pinyin.endsWith('r')))||!text(a.pinyin)))fail(p+'.alignment','one character per syllable; must reconstruct hanzi and pinyin')}if(u.audio&&!(typeof u.audio==='string'&&/^(https:\/\/|\/(?!\/))/.test(u.audio)))fail(p+'.audio','HTTPS URL or root-relative path required')}
 }
 if(r.questions){if(!Array.isArray(r.questions)||r.questions.length<3||r.questions.length>5)fail('questions','use 3–5 questions');else for(const [i,q]of unique(r.questions,'questions').entries())if(!text(q.prompt)||!text(q.explanation)||!Array.isArray(q.options)||q.options.length<2||q.options.some(o=>!text(o))||new Set(q.options).size!==q.options.length||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length||!Array.isArray(q.evidence)||!q.evidence.length||q.evidence.some(id=>!r.turns.some(t=>t.id===id)))fail('questions.'+i,'invalid options, answer, explanation or evidence')}
 return errors;
}
