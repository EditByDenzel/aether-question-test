import { projects, questions, transcription } from './questions.js';
const $ = id => document.getElementById(id);
const key = 'aether-question-fixture-v1';
let answers = {}, storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for (const id of [...questions.map(q => q.id), 'transcription']) {
      const a = saved[id];
      if (a && typeof a === 'object') answers[id] = { choice: Number.isInteger(a.choice) && a.choice >= 0 && a.choice < 4 ? a.choice : null, text: typeof a.text === 'string' ? a.text.slice(0,10000) : '', submitted: a.submitted === true };
    }
  }
} catch { storageAvailable = false; }
let page = 0;
const currentId = () => questions[page]?.id || 'transcription';
const current = () => answers[currentId()] ||= { choice: null, text: '', submitted: false };
function save() {
  try { localStorage.setItem(key, JSON.stringify(answers)); } catch { storageAvailable = false; }
  $('storage').textContent = storageAvailable ? 'Answers are saved in this browser. No responses are sent to a service.' : 'Browser storage is unavailable. Answers are kept only while this tab remains open.';
}
function feedback(error = '') {
  const a = current(), q = questions[page];
  const el = $('feedback');
  el.className = '';
  el.textContent = '';
  if (error) { el.className = 'feedback error'; el.textContent = error; return; }
  if (!a.submitted) return;
  if (q?.confirmed !== undefined && a.choice !== null) {
    const correct = a.choice === q.confirmed;
    el.className = correct ? 'feedback' : 'feedback error';
    el.textContent = correct ? '✓ This is correct — confirmed in the supplied screenshot.' : 'Answer saved. The screenshot marks B as correct. You can revise your answer.';
  } else {
    el.className = 'feedback neutral';
    el.textContent = '✓ Answer saved. No verified answer key was supplied for this response.';
  }
  $('submit').textContent = 'Update Answer';
}
function updateProgress() {
  const count = Object.values(answers).filter(a => a.submitted).length;
  $('progress').textContent = `${count} of ${questions.length + 1} responses submitted`;
}
function render(focus = false) {
  const q = questions[page], p = q && projects[q.project], a = current();
  document.body.classList.toggle('transcription', !q);
  $('title').textContent = q ? `${p.name} Knowledge Check` : 'Transcription Knowledge Check';
  $('counter').textContent = q ? `Question ${page + 1} of ${questions.length}` : 'Practice page';
  $('intro').replaceChildren();
  if (q) {
    const intro = document.createElement('p');
    intro.textContent = `In the next section, we’re going to test your knowledge ${q.project === 'flywheel' ? 'of' : 'on'} the ${p.name} project (${p.id}).`;
    const note = document.createElement('p');
    note.append('Here are our latest ');
    const link = document.createElement('button');
    link.type = 'button'; link.className = 'link'; link.textContent = 'guidelines';
    link.addEventListener('click', () => { $('guideline-note').textContent = p.notes; $('guidelines').showModal(); });
    note.append(link, ' - please go through them carefully before the quiz!');
    $('intro').append(intro, note);
  } else $('intro').innerHTML = transcription;
  $('question').textContent = q?.question || '';
  $('attempts').textContent = a.submitted ? 'Response submitted · revisions allowed' : 'Attempts remaining: 1';
  $('choices').replaceChildren();
  q?.options.forEach((option, index) => {
    const label = document.createElement('label'); label.className = 'choice';
    const text = document.createElement('span'); text.textContent = `${'ABCD'[index]}) ${option}`;
    const input = document.createElement('input'); input.type = 'radio'; input.name = 'choice'; input.value = index; input.checked = a.choice === index;
    input.addEventListener('change', () => { a.choice = index; a.submitted = false; save(); feedback(); $('submit').textContent = 'Submit Answer'; updateProgress(); });
    label.append(text, input); $('choices').append(label);
  });
  $('answer').value = a.text;
  $('submit').textContent = a.submitted ? 'Update Answer' : 'Submit Answer';
  $('previous').disabled = page === 0;
  $('next').disabled = page === questions.length;
  feedback(); updateProgress(); save();
  if (focus) { $('title').focus({ preventScroll: true }); window.scrollTo(0, 0); }
}
function readHash() {
  const value = Number(location.hash.slice(1));
  page = Number.isInteger(value) && value >= 1 && value <= questions.length + 1 ? value - 1 : 0;
  render(true);
}
$('answer').addEventListener('input', () => { const a = current(); a.text = $('answer').value; a.submitted = false; save(); feedback(); $('submit').textContent = 'Submit Answer'; updateProgress(); });
$('question-form').addEventListener('submit', event => {
  event.preventDefault(); const a = current();
  if (a.choice === null && !a.text.trim()) { feedback('Choose an option or type your answer before submitting.'); $('answer').focus(); return; }
  a.submitted = true; save(); feedback(); updateProgress(); $('attempts').textContent = 'Response submitted · revisions allowed';
});
$('previous').addEventListener('click', () => { if (page > 0) location.hash = String(page); });
$('next').addEventListener('click', () => { if (page < questions.length) location.hash = String(page + 2); });
window.addEventListener('hashchange', readHash);
$('close-guidelines').addEventListener('click', () => $('guidelines').close());
$('reset').addEventListener('click', () => $('reset-dialog').showModal());
$('cancel-reset').addEventListener('click', () => $('reset-dialog').close());
$('confirm-reset').addEventListener('click', () => { answers = {}; save(); $('reset-dialog').close(); if (location.hash === '#1') readHash(); else location.hash = '1'; });
readHash();
