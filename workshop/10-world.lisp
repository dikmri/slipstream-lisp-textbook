; LISP ATELIER / 10 world
; Run from repository root: sbcl --script workshop/10-world.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(let ((*blocks* nil)) (add-block 5 1 0 2 2 4) (assert (= (floor-at 5 0) 2)) (assert (= (floor-at 10 0) 0)))
(format t "PASS / 10 world~%")
