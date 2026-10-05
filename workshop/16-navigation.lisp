; LISP ATELIER / 16 navigation
; Run from repository root: sbcl --script workshop/16-navigation.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(make-arena)
(let* ((goal (v 22 3.2 7)) (path (route (v -20 0 -24) goal))) (assert path) (assert (< (distance3 (car (last path)) goal) 2.0)))
(format t "PASS / 16 navigation~%")
