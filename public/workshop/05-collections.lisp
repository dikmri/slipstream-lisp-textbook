; LISP ATELIER / 05 collections
; Run from repository root: sbcl --script workshop/05-collections.lisp
; Change one value, predict, run, compare.

(let ((ammo (vector 0 12 0 8))) (assert (= (reduce #'max ammo) 12)) (assert (equal (loop for i below (length ammo) when (plusp (aref ammo i)) collect i) '(1 3))))
(let ((grid (make-hash-table :test #'equal))) (setf (gethash (cons 1 2) grid) 0) (assert (= (gethash (cons 1 2) grid) 0)))
(format t "PASS / 05 collections~%")
