; LISP ATELIER / 12 wall-kick
; Run from repository root: sbcl --script workshop/12-wall-kick.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(make-arena)
(let ((a (make-actor :pos (v -27.5 2 15) :vel (v -5 -2 0)))) (jump-body a (v 0 0 -1)) (assert (> (v-x (actor-vel a)) 10)) (assert (> (v-y (actor-vel a)) 10)) (let ((n (actor-wall-kicks a))) (jump-body a (v 0 0 -1)) (assert (= n (actor-wall-kicks a)))))
(format t "PASS / 12 wall-kick~%")
