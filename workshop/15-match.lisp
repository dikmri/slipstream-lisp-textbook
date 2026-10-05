; LISP ATELIER / 15 match
; Run from repository root: sbcl --script workshop/15-match.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(load (merge-pathnames "../game/arena.lisp" *load-truename*))
(in-package :slipstream)

(let ((a (make-actor :pos (v 0 0 0))) (item (make-pickup :pos (v 0 0 0) :kind :health))) (collect-pickup a item) (assert (= (pickup-timer item) 0)) (setf (actor-hp a) 40) (collect-pickup a item) (assert (= (actor-hp a) 75)) (assert (> (pickup-timer item) 0)))
(format t "PASS / 15 match~%")
