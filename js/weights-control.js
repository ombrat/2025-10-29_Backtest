// weights-control.js - lightweight weights manager (vanilla JS).
// Expected usage: include weights-control.html markup and import this module as a module script.

const weightsList = document.getElementById('weights-list');
const normalizeBtn = document.getElementById('normalize-btn');
const resetBtn = document.getElementById('reset-weights');
const sumEl = document.getElementById('weights-sum');
const applyBtn = document.getElementById('apply-weights');

// For demo: initial assets (replace with real data from your app)
let assets = [
  { ticker: 'AAPL', weight: 50 },
  { ticker: 'MSFT', weight: 25 },
  { ticker: 'GOOGL', weight: 25 }
];

function render(){
  weightsList.innerHTML = '';
  assets.forEach((a, idx) => {
    const row = document.createElement('div');
    row.style.display='flex';
    row.style.alignItems='center';
    row.style.gap='12px';
    row.style.padding='8px 0';
    row.innerHTML = `
      <div style="width:120px"><strong>${a.ticker}</strong></div>
      <input class="input" type="number" min="0" max="100" step="0.01" value="${a.weight}" data-idx="${idx}" style="width:120px" />
      <input type="range" min="0" max="100" step="0.01" value="${a.weight}" data-idx-range="${idx}" style="flex:1" />
      <div style="width:64px;text-align:right" class="small"><span data-idx-val="${idx}">${a.weight}</span>%</div>
    `;
    weightsList.appendChild(row);
  });
  updateSum();
  attachEvents();
}

function attachEvents(){
  weightsList.querySelectorAll('input[type="number"]').forEach(inp => {
    inp.addEventListener('input', (e)=>{
      const idx = Number(e.target.dataset.idx);
      const v = parseFloat(e.target.value) || 0;
      assets[idx].weight = v;
      // sync range
      const range = weightsList.querySelector(`input[data-idx-range="${idx}"]`);
      if(range) range.value = v;
      const valLabel = weightsList.querySelector(`span[data-idx-val="${idx}"]`);
      if(valLabel) valLabel.textContent = round2(v);
      updateSum();
    });
  });
  weightsList.querySelectorAll('input[type="range"]').forEach(range => {
    range.addEventListener('input', (e)=>{
      const idx = Number(e.target.dataset.idxRange);
      const v = parseFloat(e.target.value) || 0;
      assets[idx].weight = v;
      const num = weightsList.querySelector(`input[data-idx="${idx}"]`);
      if(num) num.value = v;
      const valLabel = weightsList.querySelector(`span[data-idx-val="${idx}"]`);
      if(valLabel) valLabel.textContent = round2(v);
      updateSum();
    });
  });
}

function round2(v){ return Math.round(v*100)/100 }

function updateSum(){
  const s = assets.reduce((acc,x)=>acc+Number(x.weight||0),0);
  sumEl.textContent = round2(s);
  if(s > 100.001){
    sumEl.style.color = 'var(--color-danger)';
  }else if(s < 99.999){
    sumEl.style.color = 'var(--muted)';
  }else{
    sumEl.style.color = 'var(--color-success)';
  }
}

function normalizeWeights(){
  const total = assets.reduce((acc,x)=>acc+Number(x.weight||0),0) || 1;
  assets = assets.map(a => ({...a, weight: round2((a.weight/total)*100)}));
  render();
}

function resetWeights(){
  assets = assets.map(a => ({...a, weight: Math.round((100/assets.length)*100)/100}));
  render();
}

normalizeBtn.addEventListener('click', normalizeWeights);
resetBtn.addEventListener('click', resetWeights);
applyBtn.addEventListener('click', ()=>{
  // Dispatch event with normalized weights (fractions 0-1)
  const payload = assets.map(a => ({ ticker: a.ticker, weight: (Number(a.weight)||0)/100 }));
  const ev = new CustomEvent('weights-applied', {detail: payload});
  window.dispatchEvent(ev);
});

// Initialize
render();