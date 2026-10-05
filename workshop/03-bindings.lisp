; LISP ATELIER / 03 bindings
; Run from repository root: sbcl --script workshop/03-bindings.lisp
; Change one value, predict, run, compare.

(assert (= (let* ((speed 12) (dt 1/120) (step (* speed dt))) (+ 10 step)) 101/10))
(assert (= (let ((hp 100) (damage 200)) (setf hp (max 0 (- hp damage))) hp) 0))
(format t "PASS / 03 bindings~%")
