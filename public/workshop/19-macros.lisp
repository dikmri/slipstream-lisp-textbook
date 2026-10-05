; LISP ATELIER / 19 macros
; Run from repository root: sbcl --script workshop/19-macros.lisp
; Change one value, predict, run, compare.

(defmacro twice-value (form) (let ((value (gensym "VALUE"))) `(let ((,value ,form)) (+ ,value ,value))))
(let ((counter 0)) (assert (= (twice-value (incf counter)) 2)) (assert (= counter 1)))
(format t "PASS / 19 macros~%")
