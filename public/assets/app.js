import {mountLab} from './labs.js';
const data=JSON.parse(document.querySelector('#book-data') .textContent );
const lang=data.lang             ,t=(ja       ,en       )=>lang==='ja'?ja:en;
const $=                                   (s       )=>document.querySelector   (s) ;
const all=                                   (s       )=>[...document.querySelectorAll   (s)];
const saved=(key       ,fallback    )=>{try{return JSON.parse(localStorage.getItem(key)??'null')??fallback;}catch{return fallback;}};
const save=(key       ,value    )=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
const storedProgress=saved('atelier-progress',[]);
const learned=new Set        ((Array.isArray(storedProgress)?storedProgress:[]).filter(id=>all('.chapter').some(c=>c.id===id)));
const refreshProgress=()=>{all                   ('[data-complete]').forEach(b=>{const yes=learned.has(b.dataset.complete );b.setAttribute('aria-pressed',String(yes));b.textContent=(yes?b.dataset.done:b.dataset.default)+' ✓';});all                   ('.chapter-link').forEach(a=>a.classList.toggle('learned',learned.has(a.dataset.id )));$('#progress-label').textContent=`${learned.size} / 24`;$                     ('#progress').value=learned.size;};
all                   ('[data-complete]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.complete ;learned.has(id)?learned.delete(id):learned.add(id);save('atelier-progress',[...learned]);refreshProgress();}));
const mounted=new Set        ();
function navigate(scroll=true){
  let id=decodeURIComponent(location.hash.slice(1)||'orientation');const chapters=all('.chapter');if(!chapters.some(c=>c.id===id))id='orientation';
  chapters.forEach(c=>c.hidden=c.id!==id);all('.chapter-link').forEach(a=>{const yes=a.dataset.id===id;a.classList.toggle('active',yes);yes?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
  const current=$('#'+id);$('#current-section').textContent=String(current.dataset.index).padStart(2,'0')+' / '+id.toUpperCase();
  $                   ('#language-link').hash=id;
  document.title='LISP ATELIER — '+current.querySelector('h1') .textContent;
  if(!mounted.has(id)){current.querySelectorAll             ('.lab').forEach(l=>mountLab(l,lang));mounted.add(id);}
  $('#contents').classList.remove('mobile-open');$('#toc-toggle').setAttribute('aria-expanded','false');all                   ('dialog').forEach(d=>{if(d.open)d.close();});
  if(scroll){window.scrollTo({top:0,behavior:'instant'});$('#reader').focus({preventScroll:true});}
}
window.addEventListener('hashchange',()=>navigate());navigate(false);refreshProgress();
window.addEventListener('load',()=>window.scrollTo({top:0,behavior:'instant'}),{once:true});
document.addEventListener('click',e=>{const a=(e.target               ).closest                   ('a[href^="#"]');if(a&&a.getAttribute('href')===location.hash){e.preventDefault();navigate();}});
$('#toc-toggle').addEventListener('click',()=>{const yes=$('#contents').classList.toggle('mobile-open');$('#toc-toggle').setAttribute('aria-expanded',String(yes));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#contents').classList.remove('mobile-open');$('#toc-toggle').setAttribute('aria-expanded','false');}});
document.addEventListener('click',e=>{if(!$('#contents').contains(e.target        )&&!$('#toc-toggle').contains(e.target        )){$('#contents').classList.remove('mobile-open');$('#toc-toggle').setAttribute('aria-expanded','false');}});
$('#theme-toggle').addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('atelier-theme',theme);}catch{}all('.lab').forEach(l=>l.dispatchEvent(new Event('themechange')));});
let large=saved('atelier-large',false);const setSize=()=>{document.documentElement.style.setProperty('--body-size',large?'19px':matchMedia('(max-width:520px)').matches?'15px':'16px');$('#font-toggle').setAttribute('aria-pressed',String(large));};setSize();window.addEventListener('resize',setSize);
$('#font-toggle').addEventListener('click',()=>{large=!large;save('atelier-large',large);setSize();});$('#print-button').addEventListener('click',()=>window.print());
const matches=(text       ,query       )=>text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
$                  ('#search').addEventListener('input',e=>{const query=(e.target                    ).value.trim();let count=0;all                   ('.chapter-link').forEach(a=>{a.hidden=!matches(a.dataset.search ,query);if(!a.hidden)count++;});all('.toc-group').forEach(g=>g.hidden=![...g.querySelectorAll             ('.chapter-link')].some(a=>!a.hidden));const host=$('#glossary-search');host.replaceChildren();if(query)for(const g of data.glossary.filter((g    )=>matches(g.word+' '+g.note,query))){const a=document.createElement('a');a.className='glossary-match';a.href='#'+g.id;a.textContent=g.word;const p=document.createElement('span');p.textContent=g.note;a.append(p);host.append(a);}$('#search-status').textContent=query?t(`${count}章 / ${host.children.length}用語`,`${count} chapters / ${host.children.length} terms`):'';});
all             ('[data-dialog]').forEach(b=>b.addEventListener('click',()=>{$                   ('#'+b.dataset.dialog).showModal();if(b.dataset.dialog==='source-index')renderSource();}));
all                   ('dialog').forEach(d=>{d.querySelector('.dialog-close') .addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
$                  ('.glossary-filter').addEventListener('input',e=>{const text=(e.target                    ).value;all('.glossary-item').forEach(x=>x.hidden=!matches(x.dataset.term ,text));});
function renderSource(){const f=$                   ('#source-file').value;const host=$('#source-code');host.replaceChildren();const container=document.createElement('div');container.className='code-block';const cap=document.createElement('div');cap.className='code-cap';const label=document.createElement('span');label.textContent=f;const copy=document.createElement('button');copy.type='button';copy.className='copy-code';copy.textContent=t('コピー','Copy');cap.append(label,copy);const pre=document.createElement('pre');pre.tabIndex=0;const code=document.createElement('code');for(const line of data.sources[f].split('\n')){const span=document.createElement('span');span.className='code-line';span.textContent=line||' ';code.append(span,document.createTextNode('\n'));}pre.append(code);container.append(cap,pre);host.append(container);$                   ('#source-github').href='https://github.com/dikmri/slipstream-lisp-textbook/blob/main/game/'+f;}
$('#source-file').addEventListener('change',renderSource);
document.addEventListener('click',async e=>{const b=(e.target               ).closest                   ('.copy-code');if(!b)return;const text=[...b.closest('.code-block') .querySelectorAll('.code-line')].map(l=>l.textContent).join('\n');try{await navigator.clipboard.writeText(text);b.textContent=t('コピー済み','Copied');setTimeout(()=>b.textContent=t('コピー','Copy'),1800);}catch{b.textContent=t('本文を選択してコピー','Select the text to copy');}});
all                 ('.quiz').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const value=Number(new FormData(form).get(form.querySelector('input') .name));const correct=value===Number(form.dataset.correct);const result=form.querySelector             ('.quiz-result') ;result.hidden=false;result.querySelector('strong') .textContent=correct?t('正解。理由まで説明できれば、次へ。','Correct. Explain why, then continue.'):t('もう一度、式と条件をたどってみましょう。','Trace the expression and conditions once more.');}));
