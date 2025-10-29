// ticker-search.js
// Vanilla JS ticker search widget using debounce and skeleton states.
// Usage: include <script type="module" src="js/ticker-search.js"></script> and ensure
// ticker-search.html markup is present in the page.

import { debounce } from './debounce.js';

const MIN_QUERY = 2;
const input = document.getElementById('ticker-search-input');
const suggestions = document.getElementById('ticker-suggestions');
const clearBtn = document.getElementById('clear-search');

let activeIndex = -1;
let currentItems = [];
let abortController = null;

function renderSuggestions(items, loading = false){
  suggestions.innerHTML = '';
  if(loading){
    const s = document.createElement('div');
    s.className = 'card';
    s.style.padding = '12px';
    s.innerHTML = `
      <div class="skeleton title"></div>
      <div style="height:8px"></div>
      <div class="skeleton text"></div>
      <div style="height:6px"></div>
      <div class="skeleton text"></div>
    `;
    suggestions.appendChild(s);
    return;
  }
  if(!items || items.length === 0){
    suggestions.style.display = 'none';
    return;
  }
  suggestions.style.display = 'block';
  const list = document.createElement('div');
  list.className = 'card';
  list.style.padding = '6px';
  items.forEach((it, i) => {
    const row = document.createElement('div');
    row.setAttribute('role','option');
    row.tabIndex = 0;
    row.dataset.index = i;
    row.style.padding = '8px';
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.cursor = 'pointer';
    row.style.borderRadius = '6px';
    row.innerHTML = `<div><strong>${it.ticker}</strong> <span class="small" style="margin-left:8px">${it.name}</span></div><div class="small" style="opacity:0.6">${it.exchange||''}</div>`;
    row.addEventListener('click', ()=>selectItem(i));
    row.addEventListener('keydown', (e)=>{ if(e.key==='Enter') selectItem(i); });
    list.appendChild(row);
  });
  suggestions.appendChild(list);
}

function selectItem(i){
  const item = currentItems[i];
  if(!item) return;
  // Dispatch custom event with selected ticker
  const ev = new CustomEvent('ticker-selected', {detail: item});
  window.dispatchEvent(ev);
  input.value = item.ticker;
  suggestions.innerHTML = '';
  suggestions.style.display = 'none';
}

async function fetchTickers(q){
  if(abortController){
    abortController.abort();
  }
  abortController = new AbortController();
  const signal = abortController.signal;
  renderSuggestions(null, true);
  try{
    const res = await fetch(`/api/search_tickers?q=${encodeURIComponent(q)}`, {signal});
    if(!res.ok) throw new Error('Network');
    const data = await res.json();
    currentItems = data;
    renderSuggestions(data);
    activeIndex = -1;
  }catch(e){
    if(e.name === 'AbortError') return;
    console.error('Ticker search error', e);
    renderSuggestions([]);
  }
}

const debouncedFetch = debounce((q)=>{
  if(q.length < MIN_QUERY){ suggestions.innerHTML=''; suggestions.style.display='none'; return; }
  fetchTickers(q);
}, 300);

if(input){
  input.addEventListener('input', (e)=> debouncedFetch(e.target.value.trim()));
  input.addEventListener('keydown', (e)=>{
    const list = suggestions.querySelectorAll('[role="option"]');
    if(e.key === 'ArrowDown'){
      e.preventDefault();
      activeIndex = Math.min(list.length - 1, activeIndex + 1);
      if(list[activeIndex]) { list[activeIndex].focus(); }
    }else if(e.key === 'ArrowUp'){
      e.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
      if(list[activeIndex]) { list[activeIndex].focus(); }
    }else if(e.key === 'Escape'){
      suggestions.innerHTML = '';
      suggestions.style.display = 'none';
    }else if(e.key === 'Enter'){
      if(activeIndex >= 0 && list[activeIndex]) {
        list[activeIndex].click();
      }
    }
  });
}

if(clearBtn){
  clearBtn.addEventListener('click', ()=>{
    input.value = '';
    suggestions.innerHTML = '';
    suggestions.style.display = 'none';
  });
}