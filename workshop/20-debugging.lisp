; LISP ATELIER / 20 debugging
; Run from repository root: sbcl --script workshop/20-debugging.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(assert (= (len (unit (v 0 0 0))) 0))
(assert (= (angle-to (v 2 0 2) (v 2 0 2)) 0))
(assert (eq (handler-case (/ 1 0) (division-by-zero () :caught)) :caught))
(format t "PASS / 20 debugging~%")
