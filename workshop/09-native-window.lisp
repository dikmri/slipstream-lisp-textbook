; LISP ATELIER / 09 native-window
; Run from repository root: sbcl --script workshop/09-native-window.lisp
; Change one value, predict, run, compare.
(load (merge-pathnames "../game/platform.lisp" *load-truename*))
(in-package :slipstream)

(assert (fboundp 'ss-init))
(assert (fboundp 'ss-camera))
(format t "PASS / 09 native-window~%")

(unless (member "--check" sb-ext:*posix-argv* :test #'string=)
  (load (merge-pathnames "window-demo.lisp" *load-truename*)))
