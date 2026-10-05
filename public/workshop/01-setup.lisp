; LISP ATELIER / 01 setup
; Run from repository root: sbcl --script workshop/01-setup.lisp
; Change one value, predict, run, compare.

(assert (= (+ 40 2) 42))
(format t "~D~%" (+ 40 2))
(format t "PASS / 01 setup~%")
