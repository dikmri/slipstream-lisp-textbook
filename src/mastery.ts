import {b,s,ex,q,source,type Chapter} from './content.ts';
export const masteryChapters: Chapter[] = [
{
id:'macros',part:4,minutes:80,title:b('マクロで、書き方そのものを作る','Use macros to shape the notation'),
subtitle:b('コードがデータであることを、保守しやすさへつなげる。','Turn code-as-data into a practical maintenance tool.'),
goals:[b('関数とマクロの評価時点を区別する','Distinguish function calls from macro expansion'),b('バッククォート・カンマ・スプライスを使う','Use backquote, comma, and splicing'),b('macroexpand-1とgensymで展開を検証する','Inspect expansion with macroexpand-1 and gensym')],
sections:[
s(b('値を計算するか、式を作るか','Compute values or construct expressions'),[
b('関数は通常、評価済みの引数を受け取ります。マクロは未評価のコードを受け取り、代わりに評価されるコードを返します。nativeはFFIの型宣言と、引数を単精度へ変換するラッパーを同時に生成します。50個近い定義を手書きするより、宣言の形を一つに固定して型対応の誤りを減らせます。','A function normally receives evaluated arguments. A macro receives unevaluated forms and returns code to evaluate in their place. native generates both an FFI declaration and a wrapper converting arguments to single precision. A single declaration pattern reduces mismatched types across dozens of bindings.'),
b('マクロは実行時間の魔法ではありません。単純な計算なら関数を使います。未評価の本体を包みたい、呼び出し側の場所へsetfしたい、定義を一括生成したい場合に価値があります。展開を読む人が理解できるかどうかが、使う基準です。','Macros are not a runtime speed trick. Use a function for ordinary calculations. A macro is useful when wrapping unevaluated bodies, operating on a caller’s place, or generating related definitions. The important criterion is whether its expansion remains understandable.')]),
s(b('式を組み立てる三つの記号','Three marks for constructing code'),[
b('バッククォートはリストのひな形を作ります。カンマはその中で式の値を埋め込み、,@はリストの要素をその位置へ展開します。nativeの,@は複数の引数宣言を、ひとまとまりのネストしたリストではなく、宣言の列として差し込むためにあります。quoteと異なり、ひな形の一部だけを計算できます。','Backquote constructs a list template. Comma inserts an expression’s value, and ,@ inserts each element of a list at that position. native uses ,@ to insert a sequence of argument declarations rather than one nested list. Unlike quote, backquote lets selected parts of the template be computed.'),
b('macroexpand-1で一段の展開を見ます。展開後に同じ引数式が二度あるなら、副作用も二度起きる可能性があります。gensymは衝突しない一時シンボルを作ります。マクロ内部のtempが呼び出し側のtempを捕まえる「変数捕獲」を防ぐためです。','Inspect one expansion level with macroexpand-1. If the same argument form appears twice in expanded code, its effects may happen twice. gensym creates an uninterned temporary symbol to avoid capturing a variable with the same name in the caller.')],
'(defmacro twice-value (form)\n  (let ((value (gensym "VALUE")))\n    `(let ((,value ,form))\n       (+ ,value ,value))))\n\n(macroexpand-1 \'(twice-value (incf counter)))'),
s(b('読みやすい境界で止める','Stop at a readable boundary'),[
b('nativeは関数名のハイフンをCのアンダースコアへ変え、float/int/uint/string/voidをsb-alienの型へ対応させます。ここはSBCL固有です。Common Lispの標準だけで同じFFIが使えるわけではありません。移植するなら、この宣言の意味を保ちながら処理系のFFIへ置き換えます。','native replaces hyphens in Lisp names with C underscores and maps float/int/uint/string/void to sb-alien types. This boundary is SBCL-specific; the Common Lisp standard does not provide this same FFI. A port should preserve the declaration’s meaning while replacing its runtime-specific implementation.'),
b('ゲーム全体を独自のDSLへ変える必要はありません。現在のdefunとdefstructは初学者にも追える形です。マクロを追加する前に重複が本当に誤りを生んでいるか、関数だけでは解決できないかを確認します。マクロは理解して使い、理解して使わない選択もできる道具です。','The entire game does not need a custom DSL. defun and defstruct keep its behavior traceable. Before adding a macro, identify a real source of errors in repetition and check whether a function can solve it. Understanding macros also gives you the judgment not to use them.')])],
sources:[source('platform.lisp','native')],
exercise:ex(b('twice-valueへ(incf counter)を渡し、counterは一度だけ増え、戻り値はその倍になることをassertします。','Pass (incf counter) to twice-value. Assert that counter increases only once while the result is twice the new value.'),b('展開でformは一箇所だけに置きます。','Insert form only once into the expansion.'),'(defmacro twice-value (form)\n  (let ((value (gensym "VALUE")))\n    `(let ((,value ,form)) (+ ,value ,value))))\n(let ((counter 0))\n  (assert (= (twice-value (incf counter)) 2))\n  (assert (= counter 1)))',b('出力だけでなく副作用の回数も確かめると、マクロの二重評価を検出できます。','Checking the effect count as well as the result detects double evaluation.')),
quiz:q(b('gensymを使う主な目的は？','What is a main reason to use gensym?'),[b('一時変数と呼び出し側の名前の衝突を避ける','Avoid colliding temporary names with caller variables'),b('すべての処理をGPUへ送る','Send every computation to the GPU'),b('括弧を削除する','Remove parentheses')],0,b('展開コードに導入する束縛の名前を、呼び出し側から独立させます。','It keeps names introduced by expanded code independent of caller bindings.')),
test:'(defmacro twice-value (form) (let ((value (gensym "VALUE"))) `(let ((,value ,form)) (+ ,value ,value))))\n(let ((counter 0)) (assert (= (twice-value (incf counter)) 2)) (assert (= counter 1)))'
},
{
id:'debugging',part:4,minutes:85,title:b('壊れ方を、知識に変える','Turn a failure into knowledge'),
subtitle:b('再現、原因、修正、検証。一度に一つの問いを解く。','Reproduce, locate, fix, verify. Answer one question at a time.'),
goals:[b('エラー名とバックトレースを読む','Read conditions and backtraces'),b('assertと乱数seedで再現テストを作る','Build reproducible tests with assert and a random seed'),b('見た目・操作・性能の検証を区別する','Distinguish visual, input, and performance verification')],
sections:[
s(b('大きな現象を、小さな式へ戻す','Reduce a large symptom to a small expression'),[
b('実装中、発射音でDIVISION-BY-ZEROが起きました。sound-atの距離減衰に分母の1が抜け、自分の位置の音で距離0を割っていました。再現は(/ 1 (* 0.07 0))だけ。修正は(/ 1 (+ 1 (* 0.07 distance)))です。ゲーム全体を何度も起動するより、ゼロ距離の最小計算を残す方が原因に直接届きます。','During development, a firing sound caused DIVISION-BY-ZERO. sound-at’s attenuation omitted the 1 in its denominator, so a sound at the listener divided by zero. The reproduction is just (/ 1 (* 0.07 0)); the fix is (/ 1 (+ 1 (* 0.07 distance))). A minimal zero-distance check reaches the cause more directly than repeatedly launching the whole game.'),
b('別の境界は同じ位置同士へのangle-toです。(atan 0 0)の不適切なケースを避けるため、水平差がほぼ0なら0を返します。正常に遠くの敵を狙えるテストだけでは、この重なりを通りません。テストは実装をなぞるのでなく、ゼロ、上限、同じ位置、壁の向こうという仕様の境界を選びます。','Another boundary is angle-to between coincident positions. It returns 0 when horizontal differences are nearly zero rather than relying on atan at (0,0). A normal distant-target test never covers that case. Choose specification boundaries—zero, limits, coincidence, occlusion—instead of merely echoing implementation steps.')],
'(assert (= (/ 1 (+ 1 (* 0.07 0))) 1))\n(assert (= (angle-to (v 1 0 1) (v 1 0 1)) 0))'),
s(b('失敗地点のスタックを残す','Capture the stack where the error is signaled'),[
b('handler-caseはエラー時の分岐に便利ですが、そのハンドラへ来るまでにスタックが巻き戻されます。mainは内側のhandler-bindで通知時点のバックトレースを書き、外側のhandler-caseで後片付けと終了を行います。ログには条件と呼び出し経路を残し、個人情報やトークンは書きません。','handler-case is useful for error branches, but the stack has unwound by the time its handler runs. main uses an inner handler-bind to log the backtrace at signaling time, then an outer handler-case for cleanup and exit. Log the condition and call path without credentials or personal data.'),
b('SBCL固有のprint-backtraceとseed-random-stateは標準言語機能と分けて覚えます。assertはCommon Lisp標準です。副作用を含むテストは新しいactorと一時的な特別変数を使い、前テストの得点やHPへ依存させません。乱数を固定すると失敗を追い直しやすくなります。','Distinguish SBCL-specific print-backtrace and seed-random-state from standard language features. assert is standard Common Lisp. Tests with effects should construct fresh actors or temporarily bind state rather than depend on prior scores or HP. Fixing randomness makes a failure easier to reproduce.')],
'(handler-case\n    (/ 1 0)\n  (division-by-zero ()\n    :caught)) ; => :CAUGHT\n\n(let ((*random-state* (sb-ext:seed-random-state 42)))\n  (random 1.0))'),
s(b('何を確かめたかを、正確に言う','Say exactly what was verified'),[
b('self-testは壁キック、階段、射撃、復活、ロケットジャンプ、アイテム、120秒のbot戦を検証します。一方、--smoke-testはウィンドウと描画を走らせ、画面を保存します。コンパイル、数値テスト、画像確認、キー操作、音の確認は別々です。一つが通ったことを、全部が通ったこととして報告しない習慣が独力の改造を支えます。','self-test checks wall kicks, stairs, hits, respawning, rocket jumps, pickups, and a 120-second bot simulation. --smoke-test opens the renderer and saves screenshots. Compilation, numerical checks, image inspection, key interaction, and listening are separate forms of evidence. Independent modification depends on not reporting one as proof of all the others.'),
b('全チェックを通した後は、関係ない検証を延々と増やすより次の作業へ進みます。変更したなら、その変更に関係するチェックを再実行します。初学者がまず残すべきものは、バグが戻ったら失敗する小さな一つのassertです。','After relevant checks pass, proceed rather than endlessly adding unrelated verification. Rerun checks when a relevant change warrants it. The beginner’s first lasting test should be one small assertion that fails if the bug returns.')],
'# From game/ in PowerShell\n.\\build.ps1\n.\\dist\\Slipstream\\Slipstream.exe --self-test\n.\\dist\\Slipstream\\Slipstream.exe --smoke-test')],
sources:[source('checks.lisp','self-test'),source('main.lisp','main')],
exercise:ex(b('ゼロベクトルの正規化と同じ位置のangle-toを、ゲームを描画せずに検証します。','Verify zero-vector normalization and coincident-position angle-to without drawing the game.'),b('platformとarenaをロードするだけならDLLを初期化しません。','Loading platform and arena does not initialize the DLL.'),'(assert (= (len (unit (v 0 0 0))) 0))\n(assert (= (angle-to (v 2 0 2) (v 2 0 2)) 0))',b('低レベルの境界値を単独で検証するため、失敗時にUIやAIを疑う必要がありません。','These isolated boundary checks remove UI and AI from the diagnosis.')),
quiz:q(b('HUDの配置を変えた後、コンパイルだけで分かることは？','What does compilation alone verify after a HUD layout change?'),[b('画面の読みやすさ全体','The full visual legibility'),b('音量の聞きやすさ','Comfortable audio loudness'),b('コードがコンパイルできること','That the code compiles')],2,b('表示の検証には実画面が必要です。コンパイルは大切ですが別の問いを検証しています。','Visual verification needs actual display inspection. Compilation is valuable evidence for a different question.')),
test:'(assert (= (len (unit (v 0 0 0))) 0))\n(assert (= (angle-to (v 2 0 2) (v 2 0 2)) 0))\n(assert (eq (handler-case (/ 1 0) (division-by-zero () :caught)) :caught))',model:true
},
{
id:'performance',part:4,minutes:80,title:b('速さを、測ってから磨く','Measure speed before polishing it'),
subtitle:b('正しいプログラムを、根拠を持って速くする。','Make a correct program faster with evidence rather than guesses.'),
goals:[b('FPSとフレーム時間を区別する','Distinguish FPS from frame time'),b('割り当てと探索費用を測る','Measure allocation and search costs'),b('実行ファイルの作成と配布を理解する','Understand executable creation and distribution')],
sections:[
s(b('一秒の回数と、一回の時間','Counts per second and time per frame'),[
b('60 FPSは約16.67 ms、144 FPSは約6.94 msです。平均FPSが高くても、時々50 ms掛かるフレームがあれば引っかかります。CPUの更新、GPU描画、同期待ちを区別します。120秒のheadless戦闘を5秒で回せることは、実際の描画が144 FPSで動く証明ではありません。','60 FPS is about 16.67 ms per frame; 144 FPS is about 6.94 ms. A high average can still feel uneven if occasional frames take 50 ms. Distinguish CPU simulation, GPU rendering, and waiting. Simulating 120 seconds of headless combat in five seconds does not prove that rendering runs at 144 FPS.'),
b('同じ地図、bot数、乱数seed、測定時間で比較します。初回のDLL・フォント・シェーダー読み込みを含むかも明示します。読み込みを含む平均と、安定後のフレーム時間は別の測定です。変更前後の数字を一組保存し、改善したものと変わらなかったものを分けます。','Compare with the same map, bot count, random seed, and duration. State whether DLL, font, and shader startup is included. Startup-inclusive average and warmed-up frame time are different measurements. Keep a before/after pair and distinguish improvements from unchanged metrics.')]),
s(b('SBCLの測定を、小さく使う','Use SBCL’s measurements on a focused workload'),[
b('timeは経過時間や割り当て量を表示します。まずrouteやtick-gameを同じ回数実行して費用を見ると、どこを調べるべきか分かります。type宣言とoptimizeはコンパイラへの情報ですが、型の誤りを安全性0で隠さないでください。この教材はspeed 2、safety 2を使っています。','time reports elapsed time and allocation. Run route or tick-game a controlled number of times to identify work worth investigating. Type declarations and optimize inform the compiler; do not hide type mistakes by dropping safety to 0. This project uses speed 2 and safety 2.'),
b('v演算は新しい構造体を作り、ray-boxは成分リストを作り、routeは毎探索で配列を作ります。ここは性能候補ですが、測定なしに全部を書き換える必要はありません。優先度キューや再利用配列は、その費用がボトルネックと確認されてから導入します。','Vector arithmetic allocates structures, ray-box allocates component lists, and route allocates arrays per search. These are candidates to measure, not reasons to rewrite everything. Introduce a priority queue or reusable buffers after confirming that their cost is a bottleneck.')],
'(make-arena)\n(time\n  (dotimes (i 100)\n    (route (v -20 0 -24) (v 22 3.2 7))))\n\n; Keep the same workload for a before/after comparison.'),
s(b('ソースから、配布できる実行物へ','From source to an executable someone can run'),[
b('build.lispはcompile-fileでFASLを作り、loadし、自己テストを実行した後でsave-lisp-and-dieを呼びます。:executable tはSBCLランタイムとイメージを合わせ、:application-type :guiはWindowsの余分なコンソールを抑えます。公式Windowsビルドは圧縮coreを保存できない場合があるので、ここでは圧縮を要求しません。','build.lisp compiles FASLs, loads them, runs self-tests, then calls save-lisp-and-die. :executable t combines the SBCL runtime and image; :application-type :gui avoids an extra console on Windows. The supplied Windows runtime may lack compressed-core support, so this build does not request compression.'),
b('配布はSlipstream.exeだけでなくarena.dllとライセンス通知を含むフォルダ単位です。終了処理、設定保存先、別の作業ディレクトリからの起動も確認します。public/の静的教科書はブラウザで読めますが、ネイティブFPSは別のWindowsアプリです。GitHub Pagesへゲームを載せても自動でWebゲームにはなりません。','Distribute the folder containing Slipstream.exe, arena.dll, and license notices rather than the EXE alone. Check cleanup, settings location, and launching from another working directory. The static textbook runs in a browser; the FPS is a separate Windows application. Publishing it on GitHub Pages does not turn it into a web game.')],
'(sb-ext:save-lisp-and-die\n  "dist/Slipstream/Slipstream.exe"\n  :toplevel #\'slipstream:main\n  :executable t\n  :application-type :gui\n  :save-runtime-options t)')],
sources:[source('build.lisp'),source('build.ps1'),source('arena.lisp','route')],
exercise:ex(b('100回のroute探索をtimeで測定し、ノード数、探索回数、経過時間を記録してください。結果を速度の保証として扱わないでください。','Measure 100 route searches with time and record node count, repetitions, and elapsed time. Do not treat the number as a universal speed guarantee.'),b('length *nav*を一緒に表示すると比較条件が残ります。','Print length *nav* to record the workload context.'),'(make-arena)\n(format t "Nodes: ~D~%" (length *nav*))\n(time (dotimes (i 100)\n        (route (v -20 0 -24) (v 22 3.2 7))))',b('異なるPCの数字より、同じ条件での変更前後が改善の証拠になります。','A controlled before/after on the same machine is stronger evidence of improvement than unrelated numbers from different PCs.')),
quiz:q(b('144 FPSの一フレームの予算は、およそ？','What is the approximate frame-time budget at 144 FPS?'),[b('144 ms','144 ms'),b('6.94 ms','6.94 ms'),b('120秒','120 seconds')],1,b('1000 ms / 144で求めます。','Compute 1000 ms / 144.')),
test:'(assert (< (abs (- (/ 1000.0 144) 6.944444)) 0.001))\n(make-arena)\n(assert (> (length *nav*) 500))',model:true
},
{
id:'modding',part:4,minutes:100,title:b('改造を、設計として進める','Treat a modification as a design'),
subtitle:b('数値を変える力から、影響を見通す力へ。','Go beyond changing a number to anticipating what a change affects.'),
goals:[b('機能の依存関係を列挙する','List a feature’s dependencies'),b('段階的に新機能を追加する','Add behavior in reviewable steps'),b('改造の成功条件を定義する','Define observable success criteria')],
sections:[
s(b('第一の改造 — 調整できる壁キック','Modification one — a tunable wall kick'),[
b('反発16と上昇11.5をdefparameterへ切り出します。*wall-push*、*wall-rise*という名前にし、jump-bodyの数値を置き換えます。使われる場所をrgで探してから変更してください。変更後は空中発動、ground優先、クールダウン、外周逸脱を確認し、実操作で足場への到達と視点の揺れを確認します。','Extract push 16 and rise 11.5 into defparameters named *wall-push* and *wall-rise*, then replace those values in jump-body. Search callers with rg before editing. Verify airborne triggering, grounded precedence, cooldown, and perimeter bounds; then play-test platform reach and camera feedback.'),
b('設定画面へ値を公開するなら保存と読み込みも変更します。main.lispのload-settingsは*read-eval*をNILにしてデータを読み、型と範囲を制限します。設定はコードとしてevalしません。変更前の値を既定値に残し、古い設定ファイルにも対応させます。','Exposing the values in settings also needs persistence changes. load-settings reads with *read-eval* bound to NIL and clamps types and ranges. Never eval a settings file as code. Preserve previous values as defaults and support files that do not yet contain the new fields.')],
'(defparameter *wall-push* 16.0f0)\n(defparameter *wall-rise* 11.5f0)\n\n; In jump-body:\n(v+ (v* normal *wall-push*) (v* wish 4))\n; ... set vertical velocity to *wall-rise* ...'),
s(b('第二の改造 — 五番目の武器','Modification two — a fifth weapon'),[
b('武器を足すと、名前、色、actorのammo初期値、shootのcase、botの選択、HUDの枠数、入力キー、ホイールのmod、弾薬アイテム、spawn時の初期化が関係します。見える武器名だけ増やしても完成しません。まず弾薬と射撃をheadlessで確認し、次にbot、最後に見た目と操作へつなげます。','A weapon affects names, colors, actor ammo defaults, shoot’s case, bot choice, HUD slot count, keys, wheel modulo, ammo pickups, and respawn initialization. Adding a visible name is not a finished feature. First test ammo and firing headlessly, then bot use, then visuals and controls.'),
b('「5番目の武器はジャンプパッドを置く」と仕様を決めるなら、射撃の命中点、配置可能な床、再使用時間、残留物の寿命、botの利用まで考えます。元の4武器という前提を一箇所の*weapon-count*へ集める改修は、第五武器という実際の要求が生まれた今なら意味があります。','For a weapon that places a launch pad, specify hit placement, valid floor locations, reuse delay, object lifetime, and bot usage. Consolidating the current four-weapon assumption into *weapon-count* is now justified by a real fifth-weapon requirement rather than hypothetical flexibility.')],
'# Search the real dependency points, from repository root:\nrg "weapon|ammo|below 4|mod .*4" game\n\n# Work on a branch before modifying the shared baseline:\ngit switch -c codex/fifth-weapon'),
s(b('第三の改造 — botの反応時間','Modification three — bot reaction delay'),[
b('actorへreactionを追加し、ターゲットが変わった時に難易度別の秒数を設定します。タイマーをupdate-timersで減らし、update-botのshoot前で0以下か確認します。respawn時にreactionもリセットします。難易度と発射確率を混同せず、反応するまでの時間を直接指定する設計です。','Add reaction to actor and assign a difficulty-dependent delay when its target changes. Decrease it in update-timers and require it to reach 0 before shoot in update-bot. Reset it on respawn. This specifies response time directly rather than confusing it with firing probability.'),
b('変更は「0.5秒の間は弾数が減らない」「0.5秒を超えると狙える条件で射撃する」という観測可能なテストにします。ターゲット更新のたび毎回0.5へ戻すと永遠に撃てないので、「同じターゲットならリセットしない」という条件もテストします。新機能のバグは既存関数同士の境目に現れやすいです。','Test observable behavior: ammo does not decrease during 0.5 second, then firing becomes possible when aiming conditions are met. Resetting the delay on every target refresh would prevent firing forever, so test that the same target does not reset it. New-feature bugs often appear between existing functions.')]),
s(b('改造ノートを、結果で書く','Record a modification through its result'),[
b('変更を保存する単位は「新しい値」ではなく「新しい動作」です。問題、変更、検証、残る制約を短く記録し、差分を確認してからcommitします。追跡対象へログ、設定、キャッシュ、個人情報を入れないようgit statusで確認します。改造の自由は、戻せる基準と確認できる差分から生まれます。','Save a modification as a behavior change, not just a new number. Briefly record the problem, change, verification, and remaining limits, inspect the diff, then commit. Use git status to avoid tracking logs, settings, caches, or personal data. Freedom to modify depends on a recoverable baseline and an understandable diff.')],
'git diff -- game/arena.lisp game/main.lisp game/view.lisp\ncd game\n.\\build.ps1\ncd ..\ngit status --short')],
sources:[source('arena.lisp','shoot','spawn-actor','update-timers','update-bot'),source('main.lisp','load-settings','player-input')],
exercise:ex(b('第五武器を足す前に、変更が必要な箇所を最低8つ挙げてください。一つを選び、失敗するテストを先に作ります。','Before adding a fifth weapon, list at least eight affected locations. Choose one and first write a test that fails without the change.'),b('初回生成と復活時生成のammoは別の箇所です。','Initial ammo creation and respawn ammo creation are separate locations.'),'; Dependency checklist:\n; 1 weapon names, 2 weapon colors\n; 3 actor ammo default, 4 respawn ammo\n; 5 shoot dispatch, 6 bot selection\n; 7 HUD slots, 8 input keys, 9 wheel modulo\n; 10 pickup kind, 11 renderer, 12 reset / tests',b('これは未実装の仕様チェックリストです。完成した武器として扱わず、各動作を順番に実装・検証します。','This is a design checklist, not an implemented weapon. Build and verify each behavior in turn.')),
quiz:q(b('botのターゲットを再確認するたびreactionを初期値へ戻すと？','What if reaction is reset whenever the bot refreshes the same target?'),[b('狙えていても射撃が延期され続ける可能性がある','Firing may keep being postponed despite valid aim'),b('必ず武器が増える','A weapon is always added'),b('ソースが自動翻訳される','The source translates itself')],0,b('再設定はターゲットが変わった時だけにするなど、条件を明示します。','Specify when reset occurs—for example, only when the target actually changes.')),
test:'(let ((ammo (vector 180 24 16 16))) (assert (= (length ammo) (length *weapon-names*))) (assert (= (length ammo) (length *weapon-colors*))))',model:true
},
{
id:'capstone',part:4,minutes:120,title:b('自分のアリーナを、完成させる','Complete an arena of your own'),
subtitle:b('ここからは、解答を見る人ではなく、動作を決める人になる。','Become the person who decides the behavior, rather than only reading the answer.'),
goals:[b('機能を段階的に統合して実行する','Integrate and run the features in stages'),b('自分で仕様を書き、実装と検証を完了する','Write a specification, implement it, and finish verification'),b('独力で次の改造へ進むための判断基準を持つ','Acquire criteria for choosing the next independent change')],
sections:[
s(b('組み立て順は、依存順','Assembly follows dependencies'),[
b('workshopのrun-stage.lispは同じゲームモデルを使い、map、movement、combat、fullという四つの統合段階を用意します。mapでは箱を見るだけ、movementではWASDとジャンプ・壁キック、combatでは一体の静止ターゲットと全武器、fullでは通常のメニューとbot戦です。完成ソースを隠しているわけではありません。後半の演習は実モデルを読み、どの機能を有効にするかで段階を分けます。','workshop/run-stage.lisp uses the same game model in four integration stages: map, movement, combat, and full. Map shows boxes; movement adds WASD, jumping, and wall kicks; combat enables all weapons and one stationary target; full launches the usual menu and bots. The finished source is not hidden. Later workshops load the real model and isolate stages by which behavior they activate.'),
b('自力で再構築する時は、空のarena.lispへベクトルと構造体から書き始めます。各章の「実装の現場」の関数を、ただコピーする前に入出力と呼び先を書き出します。地図→移動→壁キック→命中→ロケット→試合→経路→botの順に進め、各段階で画面かassertのどちらか一つの確かな結果を得てから足します。','To rebuild independently, start a blank arena.lisp with vectors and structures. Before copying any source panel, state each function’s inputs, output, effects, and callees. Work through map → movement → wall kick → hit → rocket → match → route → bot. Obtain one concrete visual or assertion result at each stage before adding more.')],
'# Build the native boundary first:\ncd game\n.\\build.ps1\ncd ..\n\nsbcl --script workshop/run-stage.lisp map\nsbcl --script workshop/run-stage.lisp movement\nsbcl --script workshop/run-stage.lisp combat\nsbcl --script workshop/run-stage.lisp full'),
s(b('全ファイルの役割を説明する','Explain every file’s role'),[
b('platform.lispはFFI、arena.lispはモデルとルール、view.lispは見せ方、main.lispは入力とループと設定、checks.lispはゲームモデルの確認、build.lispとbuild.ps1はコンパイルと配布、bridge.cはOS・GPU・音声との境界です。モジュールが分かれていても、初期化と終了の順序は一つのmainが所有します。','platform.lisp declares the FFI; arena.lisp contains the model and rules; view.lisp presents them; main.lisp owns input, loop, and settings; checks.lisp verifies the model; build.lisp and build.ps1 compile and package; bridge.c is the OS/GPU/audio boundary. A single main owns initialization and shutdown even though implementation is split across modules.'),
b('Windowsのsettings.sexpはLocalAppData/Slipstreamに保存されます。DLLは実行ファイルの隣から探します。作業フォルダを変えても起動できるか確かめます。教材の--smoke-testはgame/を作業ディレクトリにして使います。スクリーンショットのartifacts/へ出力できるよう、ビルドが作るフォルダを残してください。','Windows settings.sexp is stored under LocalAppData/Slipstream. The DLL is located beside the executable. Verify launch from a different working directory. Run the teaching --smoke-test with game/ as the working directory and retain the build-created artifacts/ directory for screenshots.')]),
s(b('卒業制作 — あなたが決める一つの変化','Capstone — one change that you choose'),[
b('次の三案から一つを選びます。A:初心者向けの壁キック練習マップを新しくする。B:反応遅延付きのrookie botを作る。C:二段ジャンプを作り、接地で回数を戻す。完成条件を先に決め、操作、データ、初期化、描画、bot、テストへの影響を列挙してから実装します。提案は教材上の設計課題で、既に完成ゲームへ追加された機能ではありません。','Choose one: A, a new beginner wall-kick training arena; B, a rookie bot with reaction delay; C, a double jump with a count reset on landing. Define completion first, then list effects on controls, data, initialization, drawing, bots, and tests. These are design assignments, not features already added to the supplied game.'),
b('Cならactorへair-jumpsを追加し、通常ジャンプで1、二段目で0、接地で1にします。jump-bodyのcondで壁キックとの優先を明示し、壁キックが回数を回復するか決めます。respawnで状態を戻し、HUDへ回数を表示し、botが利用するかも決めます。単にvyをもう一度設定するだけでは、地上復帰や復活でのバグが残ります。','For C, add air-jumps to actor: set it to 1 on a normal jump, 0 on the extra jump, and 1 on landing. Specify double-jump versus wall-kick priority in jump-body and whether a kick restores the count. Reset on respawn, show it in the HUD, and decide bot usage. Setting vy again alone leaves landing and respawn bugs.')]),
s(b('「自分で作れる」の確認','A concrete test of independence'),[
b('ソースを閉じ、なぜ斜め入力を正規化するか、なぜロケットは区間を調べるか、なぜ保護と反動を分けるかを説明します。次に一つの変更を実装し、ビルドを通し、関連assertを通し、画面と操作を確認し、配布フォルダを別の場所から起動します。この一連を自分で完了できれば、次の機能を設計する土台があります。','Close the source and explain why diagonal input is normalized, why rockets test a traveled segment, and why protection is separate from impulse. Implement one change, build it, pass relevant assertions, inspect visuals and controls, then launch the distribution from another location. Completing that chain independently gives you a foundation for designing the next feature.'),
b('覚えるべきなのは全関数の綴りではありません。小さく動かし、境界を調べ、公式リファレンスで意味を確かめ、必要な場所だけを変える方法です。用語集とソース索引をいつでも開けるようにしてあります。卒業後も辞書として使い、試す前に結果を予測する習慣を続けてください。','You do not need to memorize every function spelling. Retain the method: run a small part, investigate boundaries, confirm semantics in the official reference, and change only the relevant locations. The glossary and source index remain available as references. Keep predicting results before running them.')])],
sources:[source('main.lisp','main'),source('checks.lisp','self-test'),source('build.lisp')],
exercise:ex(b('A・B・Cから一つを選び、成功条件を3つ書いてください。最低1つは数値テスト、1つは実操作、1つは初期化や復活の条件にします。','Choose A, B, or C and write three success criteria: one numerical test, one real-input check, and one initialization or respawn condition.'),b('二段ジャンプなら「三回目は発動しない」が重要な境界です。','For double jump, a crucial boundary is that a third jump is rejected.'),'; Example specification for double jump:\n; 1 First jump sets one airborne charge.\n; 2 Second press consumes it; a third does nothing.\n; 3 Landing and respawn reset the charge.\n; 4 Wall-kick priority is explicit.\n; 5 Keyboard play and the charge indicator agree.',b('解答は設計例です。自分の実装に合うテストを書き、変更前に失敗し、変更後に通ることまで確認してください。','The answer is a design example. Write tests for your implementation and confirm that they fail before the change and pass afterward.')),
quiz:q(b('独力の改造が完成したと判断する根拠として最も強いものは？','What is the strongest basis for calling an independent modification complete?'),[b('新しい関数名を付けた','A new function name exists'),b('仕様に対応する検証と実動作を確認した','Relevant verification and actual behavior match the specification'),b('コードの行数が増えた','The source has more lines')],1,b('完成は行数や名称ではなく、意図した動作とそれを確かめる証拠で判断します。','Completion is judged through intended behavior and evidence, not names or line counts.')),
test:'(self-test)',model:true
}
];

export const glossary = [
['S-expression',b('シンボルやリストなどの、Lispのデータとコードの表記。','The representation used for Lisp data and code, including symbols and lists.'),'expressions'],
['REPL',b('式を読み、評価し、結果を表示し、次の入力を待つ対話環境。','An interactive loop that reads, evaluates, and prints expressions.'),'setup'],
['Common Lisp',b('この教材が使う言語。処理系の名称ではない。','The language used here, rather than a particular runtime.'),'orientation'],
['SBCL',b('Common Lispのコンパイラと処理系。FFIや実行ファイル保存も提供する。','The compiler and runtime used here, also providing FFI and image saving.'),'setup'],
['Form',b('評価の対象となる式。常に関数呼び出しとは限らない。','An expression to evaluate; not necessarily a function call.'),'expressions'],
['Symbol',b('名前を表すオブジェクト。変数名や関数名として使える。','An object representing a name, usable for variables or functions.'),'expressions'],
['Keyword',b(':healthのように自身を評価するシンボル。','A self-evaluating symbol such as :health.'),'expressions'],
['NIL',b('偽であり、空リストでもある。0はNILではない。','False and the empty list; 0 is not NIL.'),'control-flow'],
['Quote',b('式を評価せずデータとして返す。','Returns a form as data without evaluating it.'),'expressions'],
['Lexical scope',b('ソース上の囲み方で参照範囲が決まる局所束縛。','Local binding whose visibility follows the source’s lexical structure.'),'bindings'],
['Special variable',b('defvarなどで宣言される動的スコープの変数。','A dynamically scoped variable declared with forms such as defvar.'),'bindings'],
['Place',b('setfが書き込める場所。変数、スロット、配列要素など。','A location writable by setf, such as a variable, slot, or array element.'),'bindings'],
['Lambda',b('名前を付けずに作る関数。','A function created without a global name.'),'functions'],
['Multiple values',b('valuesで返す複数の結果。リストとは異なる。','Several results returned by values; not the same as a list.'),'functions'],
['Cons',b('二つの値を持つセル。リストやドット対の構成単位。','A two-field cell used for lists and dotted pairs.'),'collections'],
['Vector',b('Lispでは一次元配列。ゲームのv構造体は数学の3Dベクトル。','In Lisp, a one-dimensional array; the game’s v structure represents a mathematical 3D vector.'),'vectors'],
['Hash table',b('キーから値を探すデータ構造。キー比較の選択も仕様になる。','A key-to-value data structure whose comparison test matters.'),'collections'],
['Structure',b('名前付きのスロットを持つデータ型。defstructで作る。','A data type with named slots, defined with defstruct.'),'vectors'],
['Dot product',b('対応成分の積を足した数。投影と長さに使う。','The sum of corresponding component products; used for projection and length.'),'vectors'],
['Normalization',b('ゼロでないベクトルを長さ1へする計算。','Scaling a nonzero vector to length 1.'),'vectors'],
['Delta time',b('前回から経過した時間。ここでは秒。','Elapsed time since the previous step, measured here in seconds.'),'time'],
['Accumulator',b('まだ処理していない時間を保持する値。','A value retaining time not yet consumed by simulation steps.'),'time'],
['FFI',b('別言語で作った関数を呼ぶためのインターフェース。','An interface for calling functions implemented in another language.'),'native-window'],
['ABI',b('引数、戻り値、配置を機械レベルで渡す約束。','Machine-level conventions for arguments, results, and layout.'),'native-window'],
['AABB',b('座標軸に沿った箱。衝突を区間として扱える。','An axis-aligned box, whose collision can be expressed through intervals.'),'collision'],
['Normal',b('面に垂直な方向。壁キックの反発向きに使う。','A direction perpendicular to a surface, used for wall-kick push.'),'wall-kick'],
['Cooldown',b('再発動できるまでの残り時間。','Remaining time until an action can trigger again.'),'wall-kick'],
['Hitscan',b('発射時に射線の交差を調べる方式。飛ぶ弾体とは別。','A shot resolved by ray intersections at firing time rather than a moving projectile.'),'hitscan'],
['Slab test',b('各軸の交差区間の共通部分を求める箱の射線判定。','A box-ray test using the overlap of axis intersection intervals.'),'hitscan'],
['Impulse',b('瞬間的に加える速度変化。ダメージとは別の効果。','An immediate velocity change, separate from damage.'),'rockets'],
['Occlusion',b('壁などによって視線や爆風が遮られること。','Blocking sight or splash by intervening geometry.'),'hitscan'],
['A*',b('既知の費用gと推定費用hを使う経路探索。','A path search using known cost g and estimated cost h.'),'navigation'],
['Heuristic',b('探索を導く推定値。このゲームでは目的地までの距離。','An estimate guiding search; here, distance to the destination.'),'navigation'],
['Macro',b('未評価のコードを受け取り、展開コードを返す仕組み。','A construct receiving unevaluated forms and returning an expansion.'),'macros'],
['Gensym',b('マクロの一時束縛で衝突を防ぐ未internシンボル。','An uninterned symbol used to avoid temporary-binding name collisions.'),'macros'],
['Condition',b('エラーなどの状況を通知するLispの仕組み。','Lisp’s mechanism for signaling situations such as errors.'),'debugging'],
['Backtrace',b('エラー地点へ至った関数呼び出しの列。','The sequence of function calls leading to a failure.'),'debugging'],
['FASL',b('compile-fileが出力する、loadできるコンパイル済みファイル。','A compiled file produced by compile-file and loaded with load.'),'performance'],
['GC',b('使われなくなったメモリを回収するガベージコレクション。','Garbage collection reclaiming memory no longer in use.'),'performance'],
['Regression',b('以前正しく動いた動作が、変更で再び壊れること。','A previously working behavior broken by a later change.'),'modding']
] as const;

export const references = [
{name:'Common Lisp HyperSpec',url:'https://www.lispworks.com/documentation/HyperSpec/Front/',note:b('言語標準の参照。関数名から正確な意味を調べる。','The standard-language reference for exact operator semantics.')},
{name:'SBCL User Manual',url:'https://www.sbcl.org/manual/',note:b('起動、FFI、条件、プロファイリング、実行ファイル保存。','Runtime startup, FFI, conditions, profiling, and saving executables.')},
{name:'raylib 5.5 reference',url:'https://www.raylib.com/cheatsheet/cheatsheet.html',note:b('描画、入力、音声のAPI。教材は5.5のヘッダを同梱。','Drawing, input, and audio APIs; the project includes the pinned 5.5 headers.')},
{name:'GitHub Pages',url:'https://docs.github.com/en/pages',note:b('この教科書の静的公開と更新手順。','Static publishing and updates for this textbook.')}
];
