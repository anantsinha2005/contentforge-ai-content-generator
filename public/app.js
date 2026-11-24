const form = document.querySelector('#content-form');
const topic = document.querySelector('#topic');
const generateBtn = document.querySelector('#generate');
const resultArea = document.querySelector('#result-area');
const actions = document.querySelector('#result-actions');
const copyBtn = document.querySelector('#copy-btn');
const againBtn = document.querySelector('#again-btn');
let selectedType = 'social';
let lastRequest = null;

document.querySelectorAll('.type-card').forEach(card => card.addEventListener('click', () => {
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedType = card.dataset.type;
}));

async function generateContent() {
  if (!form.reportValidity()) return;
  lastRequest = {
    type: selectedType,
    topic: topic.value.trim(),
    audience: document.querySelector('#audience').value,
    platform: document.querySelector('#platform').value,
    tone: document.querySelector('#tone').value,
    length: document.querySelector('#length').value
  };
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span>✦</span> Creating your content…';
  resultArea.innerHTML = '<div class="empty-state"><h3>Working on your idea…</h3><p>Gemini is writing your content.</p></div>';
  actions.hidden = true;
  try {
    const response = await fetch('/api/generate', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(lastRequest) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Generation request failed.');
    resultArea.innerHTML = '';
    const content = document.createElement('div');
    content.className = 'result-content';
    content.textContent = data.content;
    resultArea.appendChild(content);
    actions.hidden = false;
  } catch (err) {
    resultArea.innerHTML = '';
    const message = document.createElement('div');
    message.className = 'result-content';
    message.textContent = `Unable to generate content. ${err.message}`;
    resultArea.appendChild(message);
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<span>✦</span> Generate content <span class="arrow">→</span>';
  }
}
form.addEventListener('submit', e => { e.preventDefault(); generateContent(); });
againBtn.addEventListener('click', generateContent);
copyBtn.addEventListener('click', async () => {
  const text = resultArea.querySelector('.result-content')?.textContent || '';
  if (!text) return;
  try { await navigator.clipboard.writeText(text); copyBtn.textContent = '✓ Copied'; setTimeout(() => copyBtn.textContent = '▣ Copy', 1300); }
  catch { copyBtn.textContent = 'Copy unavailable'; }
});
