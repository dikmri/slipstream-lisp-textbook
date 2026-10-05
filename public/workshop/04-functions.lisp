; LISP ATELIER / 04 functions
; Run from repository root: sbcl --script workshop/04-functions.lisp
; Change one value, predict, run, compare.

(defun heal (hp amount &optional (limit 100)) (min limit (+ hp amount)))
(assert (= (heal 90 35) 100))
(assert (equal (mapcar #'abs '(-3 2 -1)) '(3 2 1)))
(assert (equal (multiple-value-bind (x z j) (values 1 0 t) (list x z j)) '(1 0 t)))
(format t "PASS / 04 functions~%")
