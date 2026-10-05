; LISP ATELIER / 06 control-flow
; Run from repository root: sbcl --script workshop/06-control-flow.lisp
; Change one value, predict, run, compare.

(assert (null (and nil (/ 1 0))))
(defun can-fire (ammo cooldown hp) (and (> ammo 0) (<= cooldown 0) (> hp 0) :fire))
(assert (eq (can-fire 12 0 100) :fire))
(assert (null (can-fire 0 0 100)))
(assert (equal (loop for i below 4 collect i) '(0 1 2 3)))
(format t "PASS / 06 control-flow~%")
