// debounce.js - small helper, vanilla JS
export function debounce(fn, wait = 300){
  let timer = null;
  return function(...args){
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=> {
      timer = null;
      fn.apply(this, args);
    }, wait);
  };
}