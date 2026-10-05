; LISP ATELIER / 07 vectors
; Run from repository root: sbcl --script workshop/07-vectors.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(let* ((p (v 1 0 2)) (next (v+ p (v* (v 12 0 -6) 1/120)))) (assert (= (v-x next) 11/10)) (assert (= (v-z next) 39/20)) (assert (= (v-x p) 1)))
(assert (< (abs (- (len (unit (v 1 0 1))) 1)) 0.00001))
(assert (= (len (unit (v 0 0 0))) 0))
(format t "PASS / 07 vectors~%")
