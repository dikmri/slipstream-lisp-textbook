; LISP ATELIER / 13 hitscan
; Run from repository root: sbcl --script workshop/13-hitscan.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(let ((box (make-block :pos (v 0 1 5) :size (v 2 2 2)))) (assert (= (ray-box (v 0 1 0) (v 0 0 1) box) 4)) (assert (null (ray-box (v 5 1 0) (v 0 0 1) box))))
(format t "PASS / 13 hitscan~%")
