import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Responsible-play break reminder. `minutes` of 0 disables it.
 * Fires once per interval; dismissing re-arms the next one.
 */
export function useSessionReminder(minutes: number) {
  const [due, setDue] = useState(false);
  const dueAtRef = useRef(Date.now() + Math.max(1, minutes) * 60000);

  useEffect(() => {
    dueAtRef.current = Date.now() + Math.max(1, minutes) * 60000;
    setDue(false);
  }, [minutes]);

  useEffect(() => {
    if (minutes <= 0) {
      return;
    }
    const id = setInterval(() => {
      if (Date.now() >= dueAtRef.current) {
        setDue(true);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [minutes]);

  const dismiss = useCallback(() => {
    dueAtRef.current = Date.now() + Math.max(1, minutes) * 60000;
    setDue(false);
  }, [minutes]);

  return { due: minutes > 0 && due, dismiss };
}

export default useSessionReminder;
