; LISP ATELIER / 02 expressions
; Run from repository root: sbcl --script workshop/02-expressions.lisp
; Change one value, predict, run, compare.

(assert (= (* (+ 2 3) 4) 20))
(assert (= (+ 7 (* 18 (/ 1 120))) 143/20))
(assert (eq (if 0 :hit :miss) :hit))
(assert (eq (first '(+ 2 3)) '+))
(format t "PASS / 02 expressions~%")
