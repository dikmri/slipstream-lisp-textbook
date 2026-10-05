; LISP ATELIER / 23 capstone
; Run from repository root: sbcl --script workshop/23-capstone.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(load (merge-pathnames "../game/checks.lisp" *load-truename*))
(in-package :slipstream)

(self-test)
(format t "PASS / 23 capstone~%")
