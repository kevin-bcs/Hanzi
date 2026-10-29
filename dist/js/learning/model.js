/** Pure Learning Center contracts. Stable lesson/word IDs remain authoritative. */
export function centralLessons(lessons) {
  return lessons.filter(l => l.level === 'foundation').slice().sort((a,b) => a.title.localeCompare(b.title, 'en', {numeric:true}));
}
export function lessonWords(words, lesson) {
  if (!lesson) return [...words];
  return words.filter(w => new Set([w.section, ...(w.sections || [])]).has(lesson.section));
}
export function lessonOverview(words, learned = {}, now = Date.now()) {
  const viewed = words.filter(w => learned[w.id]).length;
  return {total:words.length, viewed, percent:words.length ? Math.round(viewed / words.length * 100) : 0,
    due:words.filter(w => (w.due || 0) <= now).length,
    choices:new Set(words.map(w => w.meaning.trim().toLowerCase())).size,
    pairs:new Set(words.map(w => w.pinyin.trim().toLowerCase()+'|'+w.meaning.trim().toLowerCase())).size};
}
