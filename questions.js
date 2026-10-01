export const projects = {
  flywheel: { name: 'Flywheel', id: 'vs-1786070369-maiv2p0-prod-test-i18n-audio-transcription-v1', notes: 'The supplied screenshot shows B, “Leave BOT unchanged; only edit the blue USER track”, marked correct for the typo question. The full linked guidelines were not supplied.' },
  caption: { name: 'Caption Evals', id: 'vs-1788998179-multilingual-caption-eval', notes: 'These questions and choices are reproduced from the supplied screenshots. The linked guidelines and an official answer key were not supplied, so submissions are recorded without grading.' },
  arena: { name: 'Multimodal Agent Arena', id: 'vs-1785279484-multimodal-agent-arena-review', notes: 'These questions and choices are reproduced from the supplied screenshot. The linked guidelines and an official answer key were not supplied, so submissions are recorded without grading.' }
};
export const questions = [
  { id: 'flywheel-typo', project: 'flywheel', question: "You notice the bot's reply transcript has a typo. What do you do?", options: ['Fix the typo on the green BOT track', 'Leave BOT unchanged; only edit the blue USER track', 'Delete the BOT segment and re-add it', 'Report as row defect and skip the whole task'], confirmed: 1 },
  { id: 'flywheel-hum', project: 'flywheel', question: 'A USER segment covers 2 seconds of only HVAC hum - no speech. What do you do?', options: ['Leave it and set transcript to `<noise>`', 'Merge it into the next segment', 'Delete the USER segment', 'Mark all four Y/N flags Yes'] },
  { id: 'caption-quote', project: 'caption', question: 'The description says: C1 says: "The meeting is on Thursday at the main office."\nIn the clip, C1 says the meeting is on Thursday. He never says where. The rest of the description is fine. What do you do?', options: ['Mark the whole quote 🟢 Correct - the general meaning is close enough', 'Skip the clip - the quote is incomplete', 'Mark the whole sentence 🔴 Wrong', 'Mark at the main office 🔴 Wrong (speech that nobody said). Mark The meeting is on Thursday 🟢 Correct'] },
  { id: 'caption-age', project: 'caption', question: 'The description says: A man of South Asian descent in his late 40s to mid-50s with a stocky build. In the clip he is clearly in his twenties. Descent and build match. What do you mark?', options: ['🔴 Wrong on late 40s to mid-50s only. 🟢 Correct on the rest of the sentence', '🔴 Wrong on the whole sentence', '🟡 Uncertain on the whole sentence - age is hard', 'Leave the sentence unmarked; only quoted speech needs a colour'] },
  { id: 'caption-overview', project: 'caption', question: 'You watched the clip and checked the Overview. Every line there is right. You are in a hurry, so you only mark the one wrong word in Shot 1, and you leave the Overview with no colour. Is that OK?', options: ['Yes - green is only for quoted speech', 'Yes - if nothing is wrong, you can leave it blank', 'No. Text with no colour counts as not checked. Mark the Overview 🟢 Correct', 'No - you must skip any task where most of the text is correct'] },
  { id: 'arena-loading', project: 'arena', question: 'You open Response B. A spinner is moving. At 12 seconds, the menu starts to appear. Response A already works. What do you do?', options: ['Reject Sample now - B is still spinning.', 'Pick A as much better and skip B - A already works.', 'Mark every B rubric as Bad - it was not ready right away.', 'Wait, then rate B once it has loaded - progress means it is still loading.'] },
  { id: 'arena-bugs', project: 'arena', question: 'Response A works. Response B loads a real page, but one button is broken and some content is missing. What do you do?', options: ['Rate both sides - a rendered page with bugs is still rated.', 'Reject Sample - a broken button makes it unusable.', 'Delete the rubrics B would fail, then vote.', 'Mark a Tie - both pages loaded.'] }
];
export const transcription = `
<h2>Transcription Sample Tasks</h2>
<p><em>from the project vs-1776344557-i18n-videoasr-testset-transcription</em></p>
<h3>Project Context &amp; Rules</h3>
<ul>
<li><strong>Project Goal:</strong> In this task, you will listen to a short audio clip and correct or type the provided transcript so that it matches the spoken audio exactly to help train Automatic Speech Recognition (ASR) models.</li>
<li><strong>Your Role:</strong> You must adhere to the Golden Rule, every single audio event must have a corresponding textual event. If you can hear it, you must transcribe it verbatim.</li>
<li><strong>Platform:</strong> All tasks must be completed on the <u>multimango.com</u> platform while being logged in to Outlier with the timer on.</li>
<li><strong>Guideline Isolation:</strong> You must only use the transcription guidelines specifically outlined for the <code>vs-1776344557-i18n-videoasr-testset-transcription</code> project and avoid applying rules from other Aether projects.</li>
<li><strong>Strict Prohibition:</strong> Using ChatGPT or other AI tools to write prompts, evaluate responses, or write justifications is strictly forbidden and will result in your account being flagged for removal from both the project and the platform.</li>
</ul>
<h3>Task Workflow</h3><h4>Step 1: Choose the Language and Locale</h4>
<ul><li>At the start of the task, choose your native Language and Locale from the dropdown menu. Only work on your native language to ensure the highest quality.</li></ul>
<p class="hint">Reference text reproduced from the screenshot. No audio clip was provided. The input below is a local practice field.</p>`;
