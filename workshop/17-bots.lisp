; LISP ATELIER / 17 bots
; Run from repository root: sbcl --script workshop/17-bots.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(make-arena)
(let ((lead (v* (v 6 0 0) (/ 20 34)))) (assert (= (v-x lead) 60/17)))
(let ((*bot-count* 2) (*frag-limit* 10000) (*random-state* (sb-ext:seed-random-state 42))) (start-match) (setf (actor-bot *player*) t) (dotimes (i 3600) (tick-game +tick+ (v 0 0 0) nil nil)) (assert (> (reduce #'+ *actors* :key #'actor-shots) 10)))
(format t "PASS / 17 bots~%")
