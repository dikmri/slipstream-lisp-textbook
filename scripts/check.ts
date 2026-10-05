import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chapters as first} from '../src/content.ts';
import {engineChapters} from '../src/engine.ts';
import {masteryChapters,glossary} from '../src/mastery.ts';
import {normalize,damage,evenRound,slab,ast,searchGrid} from '../src/labs.ts';
const chapters=[...first,...engineChapters,...masteryChapters];
assert.equal(chapters.length,24);assert.equal(new Set(chapters.map(c=>c.id)).size,24);
function checkBi(x:any){if(!x||typeof x!=='object')return;if('ja'in x||'en'in x){assert.ok(typeof x.ja==='string'&&x.ja.trim());assert.ok(typeof x.en==='string'&&x.en.trim());}for(const v of Object.values(x))checkBi(v);}
chapters.forEach(c=>{checkBi(c);assert.equal(c.goals.length,3);assert.ok(c.sections.length>=3);assert.ok(c.quiz.correct>=0&&c.quiz.correct<c.quiz.options.length);assert.ok(c.test.includes('assert')||c.id==='capstone');});
assert.equal(glossary.length,40);glossary.forEach(([,term,id])=>{checkBi(term);assert.ok(chapters.some(c=>c.id===id));});
assert.deepEqual(normalize(0,0),[0,0]);assert.ok(Math.abs(Math.hypot(...normalize(1,1))-1)<1e-12);
assert.equal(evenRound(22.5),22);assert.equal(evenRound(57.5),58);assert.deepEqual(damage(50,25),{absorbed:25,hp:75,armor:0});assert.equal(damage(150,0).hp,0);
assert.equal(slab(0,0,1,0,7,-2,8,2),7);assert.equal(slab(0,3,1,0,7,-2,8,2),null);assert.equal(slab(0,0,-1,0,7,-2,8,2),null);
assert.deepEqual(ast("'(+ 2 3)"),[['quote',['+','2','3']]]);assert.throws(()=>ast('(+ 2'));assert.throws(()=>ast(')'));
const a=searchGrid(new Set());while(!a.done)a.step();assert.equal(a.path[0],13);assert.equal(a.path.at(-1),130);assert.ok(Math.abs(a.g.get(130)!-9*Math.SQRT2)<1e-9);
const b=searchGrid(new Set([1,2,3,12,14,24,25,26]));while(!b.done)b.step();assert.equal(b.path.length,0);
for(const lang of ['','en/']){const html=await readFile(new URL('../public/'+lang+'index.html',import.meta.url),'utf8');assert.equal((html.match(/class="chapter"/g)??[]).length,24);assert.equal((html.match(/data-lab=/g)??[]).length,8);}
console.log('PASS: 24 bilingual chapters, 40 glossary entries, parser, vectors, damage, slab intersections, reachable and blocked A*.');
