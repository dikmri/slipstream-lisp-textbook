
export const normalize=(x       ,z       )=>{const n=Math.hypot(x,z);return n<.00001?[0,0]:[x/n,z/n];};
export const evenRound=(x       )=>{const lo=Math.floor(x);return x-lo===.5?(lo%2===0?lo:lo+1):Math.round(x);};
export const damage=(amount       ,armor       )=>{const absorbed=Math.min(armor,evenRound(amount*.6));return {absorbed,hp:Math.max(0,100-(amount-absorbed)),armor:armor-absorbed};};
export function slab(ox       ,oz       ,dx       ,dz       ,x1       ,z1       ,x2       ,z2       ){
  let lo=0,hi=100;for(const [o,d,a,b] of [[ox,dx,x1,x2],[oz,dz,z1,z2]]){if(Math.abs(d)<.00001){if(o<a||o>b)return null;}else{const u=(a-o)/d,v=(b-o)/d;lo=Math.max(lo,Math.min(u,v));hi=Math.min(hi,Math.max(u,v));if(lo>hi)return null;}}return lo;
}
export function ast(text       )          {
  if(text.length>3000)throw Error('Input limit: 3000');
  const tokens=text.match(/;[^\n]*|"(?:\\.|[^"\\])*"|[()']|[^\s()';]+/g)?.filter(t=>!t.startsWith(';'))??[];
  let i=0;function read(depth=0)        {if(depth>50)throw Error('Depth limit: 50');const t=tokens[i++];if(t===undefined)throw Error('Missing expression');if(t===')')throw Error('Unexpected )');if(t==="'")return ['quote',read(depth+1)];if(t==='('){const a=[];while(tokens[i]!==')'){if(i>=tokens.length)throw Error('Missing )');a.push(read(depth+1));}i++;return a;}if(t.startsWith('"')&&!t.endsWith('"'))throw Error('Missing "');return t;}
  const result=[];while(i<tokens.length)result.push(read());return result;
}
export function searchGrid(walls            ,start=13,goal=130){
  const n=12,open=new Set([start]),closed=new Set        (),g=new Map([[start,0]]),parent=new Map               ();
  const h=(k       )=>Math.hypot(k%n-goal%n,Math.floor(k/n)-Math.floor(goal/n));let path         =[],done=false;
  const step=()=>{
    if(done)return;
    if(!open.size){done=true;return;}
    const cur=[...open].reduce((a,b)=>g.get(a) +h(a)<=g.get(b) +h(b)?a:b);open.delete(cur);closed.add(cur);
    if(cur===goal){done=true;path=[cur];let k=cur;while(parent.has(k)){k=parent.get(k) ;path.unshift(k);}return;}
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      if(!dx&&!dy)continue;const x=cur%n+dx,y=Math.floor(cur/n)+dy,to=y*n+x;
      if(x<0||x>=n||y<0||y>=n||walls.has(to)||closed.has(to))continue;
      if(dx&&dy&&(walls.has(Math.floor(cur/n)*n+x)||walls.has(y*n+cur%n)))continue;
      const cost=g.get(cur) +Math.hypot(dx,dy);if(cost<(g.get(to)??Infinity)){g.set(to,cost);parent.set(to,cur);open.add(to);}
    }
  };
  return {open,closed,g,step,get path(){return path;},get done(){return done;}};
}
export function mountLab(root            ,lang  ){
  const t=(ja       ,en       )=>lang==='ja'?ja:en;
  const name=root.dataset.lab ,content=root.querySelector             ('.lab-content') ;
  const controls=(items                                               )=>`<div class="lab-controls">${items.map(([key,label,min,max,value,step=1])=>`<label>${label}<output data-value="${key}">${value}</output><input data-key="${key}" aria-label="${label}" type="range" min="${min}" max="${max}" value="${value}" step="${step}"></label>`).join('')}</div>`;
  const description=(text       )=>`<p class="lab-description">${text}</p>`;
  const output='<div class="lab-output" role="status" aria-live="polite"></div>';
  const canvas='<canvas width="900" height="360" role="img"></canvas>';
  const number=(key       )=>Number(content.querySelector                  (`[data-key="${key}"]`) .value);
  const out=(text       )=>{content.querySelector('.lab-output') .textContent=text;};
  const setup=(update         )=>{content.addEventListener('input',()=>{content.querySelectorAll                  ('input[data-key]').forEach(e=>{const o=content.querySelector(`[data-value="${e.dataset.key}"]`);if(o)o.textContent=e.value;});update();});update();};
  const draw=()=>{
    const c=content.querySelector('canvas') ,ctx=c.getContext('2d') ;const style=getComputedStyle(document.documentElement);
    const ink=style.getPropertyValue('--ink').trim(),gold=style.getPropertyValue('--gold').trim(),accent=style.getPropertyValue('--accent').trim(),line=style.getPropertyValue('--line').trim();
    ctx.clearRect(0,0,900,360);ctx.lineWidth=1;ctx.font='15px Segoe UI, sans-serif';ctx.fillStyle=ink;
    c.setAttribute('aria-label',t('入力に応じて変わる計算の図解。数値は下に表示されます。','A diagram responding to the controls; numerical results appear below.'));
    const path=(points           ,color=accent,width=3)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
    const text=(s       ,x       ,y       ,color=ink)=>{ctx.fillStyle=color;ctx.fillText(s,x,y);};
    const arrow=(x       ,y       ,bx       ,by       ,color=accent)=>{path([[x,y],[bx,by]],color,4);const a=Math.atan2(by-y,bx-x);path([[bx-13*Math.cos(a-.45),by-13*Math.sin(a-.45)],[bx,by],[bx-13*Math.cos(a+.45),by-13*Math.sin(a+.45)]],color,3);};
    return {ctx,ink,gold,accent,line,path,text,arrow};
  };
  let update=()=>{};
  if(name==='reader'){
    content.innerHTML=description(t('括弧の構造を読み取る図です。評価はしません。数値結果はSBCLで確認してください。','This visualizes nesting without evaluating the expression. Check numerical results in SBCL.'))+'<label class="small-note">S-expression<textarea spellcheck="false" aria-label="S-expression">(+ 10 (* 12 (/ 1 120)))</textarea></label><div class="ast-result"></div>'+output;
    update=()=>{const host=content.querySelector('.ast-result') ;host.replaceChildren();try{const trees=ast(content.querySelector('textarea') .value);let count=0;const render=(xs          )=>{const ul=document.createElement('ul');ul.className='ast-tree';for(const x of xs){const li=document.createElement('li');if(Array.isArray(x)){li.textContent='( )';li.append(render(x));}else{li.textContent=String(x);count++;}ul.append(li);}return ul;};host.append(render(trees));out(t(`構造: ${trees.length} 式 / ${count} 個の要素`,`Structure: ${trees.length} forms / ${count} atoms`));}catch(e){out(t('構造を確認してください: ','Check the structure: ')+(e         ).message);}};
  }else if(name==='vectors'){
    content.innerHTML=description(t('入力のx・zを変えると、正規化前後の長さを比較できます。表示倍率は二つの矢印で異なります。','Change the input x and z to compare length before and after normalization. The arrows use different scales.'))+controls([['x','Input x',-12,12,1,.1],['z','Input z',-12,12,1,.1]])+canvas+output;
    update=()=>{const x=number('x'),z=number('z'),[a,b]=normalize(x,z),d=draw();d.path([[35,180],[865,180]],d.line,1);d.path([[240,40],[240,320]],d.line,1);d.path([[670,40],[670,320]],d.line,1);d.arrow(240,180,240+x*10,180+z*10,d.gold);d.arrow(670,180,670+a*125,180+b*125);d.text('INPUT / scale ×10',40,30);d.text('WISH / scale ×125',470,30);out(`length = ${Math.hypot(x,z).toFixed(4)}\n(unit (v ${x} 0 ${z})) → (${a.toFixed(4)} 0 ${b.toFixed(4)})`);};
  }else if(name==='timestep'){
    content.innerHTML=description(t('1秒の移動を比較します。「毎フレーム0.1m」は描画回数で結果が変わります。固定更新は120回です。実ゲームの加速・衝突はここでは省略します。','Compare one second of travel. A fixed 0.1 m per rendered frame depends on frame count; fixed simulation uses 120 ticks. Acceleration and collision are omitted.'))+controls([['fps','Rendering FPS',30,144,60]])+canvas+output;
    update=()=>{const fps=number('fps'),d=draw();d.path([[55,300],[850,300]],d.line,1);d.path([[55,40],[55,300]],d.line,1);d.path([[55,300],[850,300-fps*.1*15]],d.gold);d.path([[55,300],[850,120]],d.accent);d.text('0 s',55,335);d.text('1 s',820,335);d.text(t('毎フレーム0.1m','0.1 m / frame'),70,35,d.gold);d.text('12 m/s · 120 Hz',590,35,d.accent);out(t(`毎フレーム方式: ${(fps*.1).toFixed(1)} m\n固定更新: 12.0 m / 120 ticks / dt=1/120 s`,`Per frame: ${(fps*.1).toFixed(1)} m\nFixed simulation: 12.0 m / 120 ticks / dt=1/120 s`));};
  }else if(name==='wall'){
    content.innerHTML=description(t('左壁の法線は(1,0,0)。水平速度は normal×push + wish×4 に置き換わります。図は重力だけの理想軌道で、実ゲームの空中加速・速度上限は含みません。','The left wall has normal (1,0,0). Horizontal velocity is replaced with normal×push + wish×4. The diagram uses an ideal gravity-only trajectory, omitting in-game air acceleration and the speed cap.'))+controls([['push',t('壁の反発','Wall push'),8,24,16],['angle','Wish angle (degrees)',-180,180,90]])+canvas+output;
    update=()=>{const angle=number('angle')*Math.PI/180,vx=number('push')+4*Math.cos(angle),vz=4*Math.sin(angle),d=draw();d.path([[55,25],[55,310]],d.gold,7);d.path([[55,310],[860,310]],d.line,1);const points=[];for(let time=0;time<=11.5/14;time+=.01)points.push([65+vx*time*35,310-(11.5*time-14*time*time)*60]);d.path(points);d.text('normal (1, 0, 0)',85,40,d.gold);d.text('gravity 28 m/s² · vy 11.5 m/s',480,40);out(`vx=${vx.toFixed(2)} · vz=${vz.toFixed(2)} m/s\n${t('上昇量','Rise')} ≈ ${(11.5**2/56).toFixed(3)} m / ${t('再発動待ち','Cooldown')} 0.24 s`);};
  }else if(name==='ray'){
    content.innerHTML=description(t('真上から見たx-z断面です。壁とターゲットの交差距離を比べ、最も近いものを選びます。実ゲームはy軸も含む3次元判定です。','A top-down x-z slice. Compare wall and target intersection distances and choose the nearest. The game additionally tests the y axis.'))+controls([['angle','Ray angle (degrees)',-80,80,0]])+canvas+output;
    update=()=>{const a=number('angle')*Math.PI/180,dx=Math.cos(a),dz=Math.sin(a),w=slab(0,0,dx,dz,7,-2,8,2),hit=slab(0,0,dx,dz,12,-3,14,3),nearest=w===null?hit:hit===null?w:Math.min(w,hit),d=draw();const sx=50,sz=180,scale=50;d.ctx.fillStyle=d.gold;d.ctx.fillRect(sx+7*scale,sz-2*scale,scale,4*scale);d.ctx.fillStyle=d.accent;d.ctx.fillRect(sx+12*scale,sz-3*scale,2*scale,6*scale);d.arrow(sx,sz,sx+dx*(nearest??16)*scale,sz+dz*(nearest??16)*scale,d.ink);d.text('ORIGIN',25,350);d.text('WALL',400,30,d.gold);d.text('TARGET',655,30,d.accent);out(`wall=${w===null?'NIL':w.toFixed(3)} · target=${hit===null?'NIL':hit.toFixed(3)}\n${t('最初の交差','First intersection')}: ${nearest===null?'NIL':nearest===w?'WALL':'TARGET'}`);};
  }else if(name==='damage'){
    content.innerHTML=description(t('HPは100から開始。armorが最大60%を吸収します。roundはCommon Lispの偶数丸めを再現しています。保護時間と死亡処理は省略します。','Start with HP 100. Armor absorbs up to 60% of damage. Round reproduces Common Lisp’s ties-to-even rule. Protection and death handling are omitted.'))+controls([['amount','Damage',0,150,50],['armor','Armor',0,150,25]])+'<div class="damage-bars"><div class="damage-bar"><div></div><span>HP</span></div><div class="damage-bar"><div></div><span>ARMOR</span></div></div>'+output;
    update=()=>{const amount=number('amount'),armor=number('armor'),r=damage(amount,armor);const bars=content.querySelectorAll             ('.damage-bar>div');bars[0].style.width=r.hp+'%';bars[1].style.width=r.armor/150*100+'%';out(`absorbed = min(${armor}, round(${amount} × 0.6)) = ${r.absorbed}\nHP: 100 → ${r.hp} · ARMOR: ${armor} → ${r.armor}`);};
  }else if(name==='nav'){
    content.innerHTML=description(t('平面のA*モデル。セルを押して壁を切り替えます。斜め移動の角抜けを禁止し、g+hが最小の候補を展開します。ゲームの段差条件は別途ソースで確認します。Sは開始、Gは目的地。','A planar A* model. Toggle walls by pressing cells. Diagonal corner cutting is forbidden; each step expands the smallest g+h. Check the source for the game’s height rules. S is start; G is goal.'))+'<div class="nav-grid" aria-label="A* grid"></div><div class="lab-buttons"><button data-action="step">'+t('1ステップ','One step')+'</button><button data-action="run">'+t('探索する','Find path')+'</button><button data-action="reset">'+t('リセット','Reset')+'</button></div>'+output;
    const walls=new Set([29,41,53,65,77,89,101,113,114,115,116,117]),initial=[...walls];let search=searchGrid(walls);const grid=content.querySelector('.nav-grid') ;
    for(let i=0;i<144;i++){const cell=document.createElement('button');cell.type='button';cell.className='nav-cell';cell.textContent=i===13?'S':i===130?'G':'';cell.dataset.cell=String(i);grid.append(cell);}
    update=()=>{for(const e of grid.children       ){const i=Number(e.dataset.cell);e.className='nav-cell'+(walls.has(i)?' wall':search.path.includes(i)?' path':search.closed.has(i)?' closed':search.open.has(i)?' open':'')+(i===13?' start':i===130?' goal':'');e.setAttribute('aria-label',`${i%12}, ${Math.floor(i/12)}: ${i===13?'Start':i===130?'Goal':walls.has(i)?t('壁','Wall'):t('通路','Passable')}`);e.setAttribute('aria-pressed',String(walls.has(i)));if(i===13||i===130)e.disabled=true;}out(`OPEN ${search.open.size} / CLOSED ${search.closed.size}\n${search.done?search.path.length?t(`経路: ${search.path.length} セル / 費用 ${search.g.get(130) .toFixed(3)}`,`Path: ${search.path.length} cells / cost ${search.g.get(130) .toFixed(3)}`):t('到達できません。壁を変えて再探索してください。','Unreachable. Change the walls and search again.'):t('金色:候補 / 緑:探索済み / 完了時は金色で経路を表示','Gold: frontier / green: explored / completed path: gold')}`);};
    content.addEventListener('click',e=>{const b=(e.target               ).closest                   ('button');if(!b)return;if(b.dataset.cell){const i=Number(b.dataset.cell);walls.has(i)?walls.delete(i):walls.add(i);search=searchGrid(walls);}else if(b.dataset.action==='step')search.step();else if(b.dataset.action==='run'){while(!search.done)search.step();}else{walls.clear();initial.forEach(i=>walls.add(i));search=searchGrid(walls);}update();});
  }else if(name==='sound'){
    content.innerHTML=description(t('距離減衰と左右の定位を可視化します。実際の音声は鳴りません。55m以上は再生しないルールも表示します。','Visualize distance attenuation and stereo placement. No audio is played. The game’s no-play rule at 55 m or farther is included.'))+controls([['distance',t('距離 (m)','Distance (m)'),0,60,20],['angle',t('右方向との角度','Angle from camera right'),0,180,90]])+canvas+output;
    update=()=>{const r=number('distance'),theta=number('angle')*Math.PI/180,gain=r<55?1/(1+.07*r):0,pan=r===0?.5:Math.max(.05,Math.min(.95,.5+.45*Math.cos(theta))),d=draw();d.path([[50,310],[850,310]],d.line,1);const points=[];for(let x=0;x<=60;x+=.1)points.push([50+x*12,310-(x<55?1/(1+.07*x):0)*245]);d.path(points,d.accent);d.ctx.fillStyle=d.gold;d.ctx.beginPath();d.ctx.arc(50+r*12,310-gain*245,7,0,Math.PI*2);d.ctx.fill();d.text('gain / volume = 1',50,32);d.text('55 m: no playback',570,32,d.gold);d.text('0 m',50,345);d.text('60 m',755,345);out(`gain=${gain.toFixed(4)} · pan=${pan.toFixed(3)} (0=left / 1=right)\n${t('最終音量 = 設定音量 × 音のgain × 距離減衰','Final volume = setting × sound gain × attenuation')}`);};
  }
  setup(update);root.addEventListener('themechange',update);
}
