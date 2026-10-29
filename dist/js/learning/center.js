/** One catalog and selection bridge; existing activity engines retain their settings. */
import {runtime} from '../state/app-state.js';
import {$} from '../config/constants.js';
import {contentLessons} from '../data/vocabulary.js';
import {centralLessons, lessonWords, lessonOverview} from './model.js';
import {go, openGameMenu} from '../navigation/router.js';
import {renderLearningLessons, loadLearningLesson} from '../components/lesson-view.js';
import {renderLessonButtons} from '../components/content-selectors.js';
import {updateCardOptions} from '../games/memory.js';

export function renderLearningCenter() {
  const host = $('learningCards'); host.replaceChildren();
  const lessons = [...centralLessons(contentLessons), null];
  for (const lesson of lessons) {
    const words = lessonWords(runtime.state.words, lesson);
    const summary = lessonOverview(words, runtime.state.learned);
    const card = document.createElement('article'); card.className = 'panel learning-card';
    const heading = document.createElement('h3'); heading.textContent = lesson?.title || 'All Lessons';
    const count = document.createElement('p'); count.className = 'small';
    count.textContent = summary.total+' words · '+summary.due+' ready to review';
    const progress = document.createElement('progress'); progress.max = 100; progress.value = summary.percent;
    progress.setAttribute('aria-label', (lesson?.title || 'All Lessons')+' vocabulary viewed');
    const label = document.createElement('p'); label.className = 'small';
    label.textContent = summary.viewed+' / '+summary.total+' words viewed · '+summary.percent+'%';
    const actions = document.createElement('div'); actions.className = 'learning-actions';
    for (const [type, title, enabled] of [
      ['learn','Study vocabulary',words.length>0], ['study','Spaced review',words.length>0],
      ['quiz','Multiple Choice',summary.choices>=4], ['memory','Word Matching',summary.pairs>=3],
      ['tone','Tone Drill',words.length>0]]) {
      const button = document.createElement('button'); button.textContent = title; button.disabled = !enabled;
      if (!enabled) button.title = type==='quiz' ? 'Needs four distinct meanings in this selection.' : 'Not enough vocabulary for this activity.';
      button.onclick = () => launchLearningActivity(type, lesson);
      actions.append(button);
    }
    card.append(heading,count,progress,label,actions); host.append(card);
  }
}
export function launchLearningActivity(type, lesson) {
  const section = lesson?.section || '*';
  runtime.learningSelection = {lessonId:lesson?.id || '*', section};
  if (type==='learn') {
    go('learn');
    if (lesson) {
      $('learnLevel').value=lesson.level; renderLearningLessons();
      $('learnLesson').value=lesson.id; loadLearningLesson();
    } else {
      $('learnLesson').value='*'; loadLearningLesson();
    }
  } else if (type==='study') {
    $('studyFilter').value=section; runtime.skipped.clear(); go('study');
  } else {
    go('games'); $(type+'Section').value=section; openGameMenu(type);
    if(type!=='tone') renderLessonButtons(type);
    if(type==='memory') updateCardOptions();
  }
}
