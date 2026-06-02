import { useCallback, useEffect, useRef, useState } from "react";

/** Count-up timer; runs when `active`; freezes display when `freeze`; resets when `resetKey` changes. */
export function useTimer(active: boolean, resetKey: string, freeze: boolean) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef(Date.now());
  const frozenMsRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    startRef.current = Date.now();
    frozenMsRef.current = null;
    setElapsedMs(0);
  }, []);

  useEffect(() => {
    reset();
  }, [resetKey, reset]);

  useEffect(() => {
    if (!active) {
      if (freeze && frozenMsRef.current === null) {
        frozenMsRef.current = Date.now() - startRef.current;
      }
      if (freeze && frozenMsRef.current !== null) {
        setElapsedMs(frozenMsRef.current);
      }
      return;
    }

    frozenMsRef.current = null;
    const tick = () => setElapsedMs(Date.now() - startRef.current);
    tick();
    const id = window.setInterval(tick, 100);
    return () => clearInterval(id);
  }, [active, freeze, resetKey]);

  return { elapsedMs, reset };
}
