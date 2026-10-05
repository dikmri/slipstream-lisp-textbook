; LISP ATELIER / 14 rockets
; Run from repository root: sbcl --script workshop/14-rockets.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(assert (= (round 57.5) 58))
(assert (= (round 22.5) 22))
(start-match)
(setf (actor-pos *player*) (v -18 0 -24) (actor-vel *player*) (v 0 0 0) (actor-invuln *player*) 0)
(explode (make-rocket :pos (v -18 0.1 -24) :vel (v 0 -34 0) :owner *player*))
(assert (> (v-y (actor-vel *player*)) 10))
(format t "PASS / 14 rockets~%")
