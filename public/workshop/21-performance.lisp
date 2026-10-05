; LISP ATELIER / 21 performance
; Run from repository root: sbcl --script workshop/21-performance.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(assert (< (abs (- (/ 1000.0 144) 6.944444)) 0.001))
(make-arena)
(assert (> (length *nav*) 500))
(format t "PASS / 21 performance~%")
