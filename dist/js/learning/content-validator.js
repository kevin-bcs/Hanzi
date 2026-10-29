/** Lesson membership, reconstruction and finite branches are build-time contracts. */
export function validateExercises(data, vocabulary, lessons) {
 const errors=[],words=new Map(vocabulary.map(w=>[w.id,w])),lessonMap=new Map(lessons.map(l=>[l.id,l])),seen=new Set();
 const fail=(file,field,message)=>errors.push('content/exercises/'+file+'.json '+field+': '+message);
 for(const s of data.sentences || []) {
  const l=lessonMap.get(s.lesson);const field=s.id || '(missing id)';
  if(typeof s.id!=='string'||!s.id||seen.has(s.id))fail('sentences',field,'duplicate/missing ID');seen.add(s.id);
  if(!l||!Array.isArray(s.tokens)||s.tokens.length<2||s.tokens.some(id=>!words.has(id)||!l.words.includes(id))) {fail('sentences',field,'invalid tokens or word outside lesson');continue}
  const reconstructed=s.tokens.map(id=>words.get(id).hanzi.split('/')[0].trim()).join('');
  if(s.text!==reconstructed+'。'&&s.text!==reconstructed+'？')fail('sentences',field+'.text','must reconstruct tokens and punctuation');
  for(const id of s.tokens){const w=words.get(id);if(Array.from(w.hanzi.split('/')[0].trim()).length!==w.pinyin.split('/')[0].trim().split(/\s+/).length)fail('sentences',field+'.tokens','unaligned pinyin '+id)}
  if(!s.english||!s.explanation||!Array.isArray(s.accepted)||!s.accepted.includes(s.english)||!s.accepted.every(x=>typeof x==='string'&&x.trim()))fail('sentences',field,'translations/explanation required');
  if(!Number.isInteger(s.blank)||s.blank<0||s.blank>=s.tokens.length)fail('sentences',field+'.blank','invalid position');
 }
 const scenarios=new Set();
 for(const scene of data.scenarios || []) {
  if(!scene.id||scenarios.has(scene.id))fail('scenarios',scene.id,'duplicate/missing ID');scenarios.add(scene.id);
  if(!scene.title||!scene.context||!lessonMap.has(scene.lesson)||!Array.isArray(scene.nodes)){fail('scenarios',scene.id,'invalid fields');continue}
  const nodes=new Map(scene.nodes.map(n=>[n.id,n]));if(nodes.size!==scene.nodes.length||!nodes.has(scene.start))fail('scenarios',scene.id,'duplicate nodes or missing start');
  for(const n of scene.nodes){const s=data.sentences.find(s=>s.id===n.sentence);if(!s||s.lesson!==scene.lesson)fail('scenarios',scene.id+'.'+n.id,'sentence outside lesson');
   if(n.options){if(n.options.length<2||n.options.filter(o=>o.correct===true).length!==1||new Set(n.options.map(o=>o.sentence)).size!==n.options.length)fail('scenarios',scene.id+'.'+n.id,'ambiguous options');for(const o of n.options){if(!data.sentences.some(s=>s.id===o.sentence&&s.lesson===scene.lesson))fail('scenarios',scene.id+'.'+n.id,'invalid option');if(o.next!==null&&!nodes.has(o.next))fail('scenarios',scene.id+'.'+n.id,'unknown branch');if(o.correct&&o.sentence!==n.sentence)fail('scenarios',scene.id+'.'+n.id,'correct option differs from target')}}else if(!n.explanation||n.next!==null&&!nodes.has(n.next))fail('scenarios',scene.id+'.'+n.id,'invalid recovery node');
  }
  const visiting=new Set(),visited=new Set();function walk(id){if(id===null)return;if(visiting.has(id)){fail('scenarios',scene.id,'cyclic path');return}if(visited.has(id)||!nodes.has(id))return;visiting.add(id);const n=nodes.get(id);for(const next of n.options?n.options.map(o=>o.next):[n.next])walk(next);visiting.delete(id);visited.add(id)}walk(scene.start);if(visited.size!==nodes.size)fail('scenarios',scene.id,'unreachable nodes');
 }
 return errors;
}
