import { useCallback, useEffect, useRef, useState } from 'react';
import { REFILL_AMOUNT, REFILL_INTERVAL_MS, TRAY_SIZE } from '../constants/config';

/**
 * The free tray refill. Uses wall-clock deltas so the countdown survives the
 * app being backgrounded. There is no way to speed it up, skip it or buy it.
 *
 * The tray is mirrored in a ref so `consume()` can answer synchronously —
 * reading it out of a setState updater would race the drop that depends on it.
 */
export function useRefillTimer() {
  const trayRef = useRef(TRAY_SIZE);
  const [tray, setTrayState] = useState(TRAY_SIZE);
  const [msLeft, setMsLeft] = useState(REFILL_INTERVAL_MS);
  const dueAtRef = useRef(Date.now() + REFILL_INTERVAL_MS);

  const setTray = useCallback((next: number) => {
    trayRef.current = next;
    setTrayState(next);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = dueAtRef.current - Date.now();
      if (remaining <= 0) {
        dueAtRef.current = Date.now() + REFILL_INTERVAL_MS;
        setMsLeft(REFILL_INTERVAL_MS);
        trayRef.current = Math.min(TRAY_SIZE, trayRef.current + REFILL_AMOUNT);
        setTrayState(trayRef.current);
      } else {
        setMsLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const consume = useCallback((): boolean => {
    if (trayRef.current <= 0) {
      return false;
    }
    trayRef.current -= 1;
    setTrayState(trayRef.current);
    return true;
  }, []);

  const refillNow = useCallback(() => {
    setTray(TRAY_SIZE);
    dueAtRef.current = Date.now() + REFILL_INTERVAL_MS;
    setMsLeft(REFILL_INTERVAL_MS);
  }, [setTray]);

  return { tray, trayRef, msLeft, consume, refillNow };
}

export default useRefillTimer;
