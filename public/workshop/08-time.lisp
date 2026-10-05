; LISP ATELIER / 08 time
; Run from repository root: sbcl --script workshop/08-time.lisp
; Change one value, predict, run, compare.

(let ((accumulator 0) (ticks 0)) (dotimes (frame 30) (incf accumulator 1/30) (loop while (>= accumulator 1/120) do (incf ticks) (decf accumulator 1/120))) (assert (= ticks 120)))
(format t "PASS / 08 time~%")
