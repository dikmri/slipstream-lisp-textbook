; LISP ATELIER / 22 modding
; Run from repository root: sbcl --script workshop/22-modding.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(let ((ammo (vector 180 24 16 16))) (assert (= (length ammo) (length *weapon-names*))) (assert (= (length ammo) (length *weapon-colors*))))
(format t "PASS / 22 modding~%")
