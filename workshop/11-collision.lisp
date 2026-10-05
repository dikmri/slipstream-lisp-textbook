; LISP ATELIER / 11 collision
; Run from repository root: sbcl --script workshop/11-collision.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(make-arena)
(let ((a (make-actor :pos (v -27.5 0 15)))) (dotimes (i 120) (accelerate a (v -1 0 0) +tick+)) (assert (>= (v-x (actor-pos a)) -27.59)))
(format t "PASS / 11 collision~%")
