import { projects, questions, transcription } from './questions.js';
import { module2 } from './module2.js';
const $ = id => document.getElementById(id);
const keys = {1:'aether-question-fixture-v1',2:'aether-question-module-2-v1'};
const stored = {1:{},2:{}};
let storageAvailable = true, module = 1, page = 0;
const lastPage = {1:0,2:0};
for (const m of [1,2]) {
  try {
    const saved = JSON.parse(localStorage.getItem(keys[m]) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const id of m === 1 ? [...questions.map(q=>q.id),'transcription'] : module2.filter(q=>q.kind!=='reading').map(q=>q.id)) {
        const a=saved[id];
        if(a && typeof a==='object') stored[m][id]={choice:Number.isInteger(a.choice)&&a.choice>=0&&a.choice<4?a.choice:null,text:typeof a.text==='string'?a.text.slice(0,10000):'',submitted:a.submitted===true};
      }
    }
  } catch { storageAvailable=false; }
}
const total = () => module===1?questions.length+1:module2.length;
const question = () => module===1?questions[page]:module2[page];
const currentId = () => question()?.id || 'transcription';
const current = () => stored[module][currentId()] ||= {choice:null,text:'',submitted:false};
const hash = index => module===1?String(index+1):`module-2/${index+1}`;
function save() {
  try {localStorage.setItem(keys[module],JSON.stringify(stored[module]));} catch {storageAvailable=false;}
  $('storage').textContent=storageAvailable?'Answers are saved in this browser. No responses are sent to a service.':'Browser storage is unavailable. Answers are kept only while this tab remains open.';
}
function feedback(error='') {
  const a=current(),q=question(),el=$('feedback');el.className='';el.textContent='';
  if(error){el.className='feedback error';el.textContent=error;return;}
  if(!a.submitted)return;
  if(q?.confirmed!==undefined && a.choice!==null){
    const correct=a.choice===q.confirmed;el.className=correct?'feedback':'feedback error';
    el.textContent=correct?(q.explanation ? `This is correct\nExplanation: ${q.explanation}`:'✓ This is correct — confirmed in the supplied screenshot.'):`Answer saved. The screenshot marks ${'ABCD'[q.confirmed]} as correct. You can revise your answer.`;
  }else{el.className='feedback neutral';el.textContent='✓ Answer saved. No verified answer key was supplied for this response.';}
  $('submit').textContent='Update Answer';
}
function updateProgress(){
  const count=Object.values(stored[module]).filter(a=>a.submitted).length;
  const responses=module===1?total():module2.filter(q=>q.kind!=='reading').length;
  $('progress').textContent=`${count} of ${responses} responses submitted`;
  const q=question();
  $('answer-hint').textContent=q?.minimum?`${q.minimum} min char · Char count: ${[...$('answer').value].length}`:'Choose an option, type an answer, or do both.';
}
function notes(q){
  $('source-notes').replaceChildren();
  if(q?.missingAudio){const p=document.createElement('p');p.className='hint';p.textContent='The original audio links are shown in the photographs, but those audio files and link URLs were not supplied.';$('source-notes').append(p);}
  if(q?.sourceResponse){const d=document.createElement('details'),s=document.createElement('summary'),p=document.createElement('p'),t=document.createElement('p');s.textContent='Response shown in the source photograph';p.textContent='Reference transcription only. This response is not a verified answer key.';p.className='hint';t.textContent=q.sourceResponse;d.append(s,p,t);$('source-notes').append(d);}
}
function render(focus=false){
  document.querySelectorAll('audio').forEach(a=>a.pause());
  const q=question(),p=module===1&&q&&projects[q.project],a=current();
  document.body.classList.toggle('transcription',module===1&&!q);
  document.body.classList.toggle('module-two',module===2);
  document.documentElement.lang=module===2?'th':'en';
  $('module').value=String(module);
  $('title').textContent=module===2?q.section:(q?`${p.name} Knowledge Check`:'Transcription Knowledge Check');
  $('counter').textContent=module===2?`Page ${page+1} of ${total()}`:(q?`Question ${page+1} of ${questions.length}`:'Practice page');
  $('intro').replaceChildren();
  if(module===2){
    $('intro').innerHTML=q.html;
    $('intro').querySelectorAll('.reference-link').forEach(b=>b.addEventListener('click',()=>{ $('guideline-note').textContent='The project-instructions link URL was not supplied in the photographs. The available course guidance is reproduced on the Project Overview page.';$('guidelines').showModal();}));
  }else if(q){
    const intro=document.createElement('p');intro.textContent=`In the next section, we’re going to test your knowledge ${q.project==='flywheel'?'of':'on'} the ${p.name} project (${p.id}).`;
    const note=document.createElement('p');note.append('Here are our latest ');
    const link=document.createElement('button');link.type='button';link.className='link';link.textContent='guidelines';link.addEventListener('click',()=>{$('guideline-note').textContent=p.notes;$('guidelines').showModal();});note.append(link,' - please go through them carefully before the quiz!');$('intro').append(intro,note);
  }else $('intro').innerHTML=transcription;
  $('audio-clips').replaceChildren();
  for(const [label,src] of q?.audio||[]){const box=document.createElement('div'),h=document.createElement('h3'),audio=document.createElement('audio');h.textContent=label;audio.controls=true;audio.preload='metadata';audio.src=src;audio.setAttribute('aria-label',label);audio.addEventListener('play',()=>document.querySelectorAll('audio').forEach(other=>{if(other!==audio)other.pause();}));box.append(h,audio);$('audio-clips').append(box);}
  notes(module===2?q:null);
  $('question-form').hidden=module===2&&q.kind==='reading';
  $('question').textContent=q?.question||'';
  $('attempts').textContent=a.submitted?'Response submitted · revisions allowed':'Attempts remaining: 1';
  $('choices').replaceChildren();
  q?.options?.forEach((option,index)=>{
    const label=document.createElement('label');label.className='choice';
    const text=document.createElement('span');text.textContent=`${'ABCD'[index]}) ${option}`;
    const input=document.createElement('input');input.type='radio';input.name='choice';input.value=index;input.checked=a.choice===index;
    input.addEventListener('change',()=>{a.choice=index;a.submitted=false;save();feedback();$('submit').textContent='Submit Answer';updateProgress();});label.append(text,input);$('choices').append(label);
  });
  $('answer').value=a.text;
  $('answer').placeholder=module===2?'Type answer here...':'Type your answer here, or choose an option above…';
  $('answer-label').textContent=module===2?'Please respond below.':'Your answer';
  $('answer-warning').hidden=!(module===2&&q.minimum);
  $('answer-warning').textContent='Do not copy and paste from this field, the question, or the instructions above.';
  $('answer').setAttribute('aria-invalid','false');
  $('submit').textContent=a.submitted?'Update Answer':'Submit Answer';
  $('previous').disabled=page===0;$('next').disabled=page===total()-1;
  feedback();updateProgress();save();
  if(focus){$('title').focus({preventScroll:true});window.scrollTo(0,0);}
}
function readHash(){
  const match=location.hash.match(/^#module-2\/(\d+)$/);
  module=match?2:1;
  const value=Number(match?match[1]:location.hash.slice(1));
  page=Number.isInteger(value)&&value>=1&&value<=total()?value-1:0;
  lastPage[module]=page;render(true);
}
$('module').addEventListener('change',()=>{module=Number($('module').value);location.hash=hash(lastPage[module]);});
$('answer').addEventListener('input',()=>{const a=current();a.text=$('answer').value;a.submitted=false;$('answer').setAttribute('aria-invalid','false');save();feedback();$('submit').textContent='Submit Answer';updateProgress();});
$('question-form').addEventListener('submit',event=>{
  event.preventDefault();const a=current(),q=question();
  if(q?.minimum && [...a.text.trim()].length<q.minimum){feedback(`Please write at least ${q.minimum} characters before submitting.`);$('answer').setAttribute('aria-invalid','true');$('answer').focus();return;}
  if(a.choice===null&&!a.text.trim()){feedback('Choose an option or type your answer before submitting.');$('answer').focus();return;}
  a.submitted=true;save();feedback();updateProgress();$('attempts').textContent='Response submitted · revisions allowed';
});
$('previous').addEventListener('click',()=>{if(page>0)location.hash=hash(page-1);});
$('next').addEventListener('click',()=>{if(page<total()-1)location.hash=hash(page+1);});
window.addEventListener('hashchange',readHash);
$('close-guidelines').addEventListener('click',()=>$('guidelines').close());
$('reset').addEventListener('click',()=>$('reset-dialog').showModal());
$('cancel-reset').addEventListener('click',()=>$('reset-dialog').close());
$('confirm-reset').addEventListener('click',()=>{stored[module]={};save();$('reset-dialog').close();const h=hash(0);if(location.hash===`#${h}`)readHash();else location.hash=h;});
readHash();
