; LISP ATELIER / 18 presentation
; Run from repository root: sbcl --script workshop/18-presentation.lisp
; Change one value, predict, run, compare.

(assert (= (/ 1 (+ 1 (* 0.07 0))) 1))
(assert (< 0 (/ 1 (+ 1 (* 0.07 20))) 1))
(format t "PASS / 18 presentation~%")
