import { useEffect, useRef, useState } from 'react';

/**
 * Rolls a displayed number toward the target instead of snapping to it.
 * Stays on an interval rather than rAF so the balance pill is cheap.
 */
export function useTicker(target: number, stepMs = 80, steps = 14): number {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);

  useEffect(() => {
    if (displayRef.current === target) {
      return;
    }
    const from = displayRef.current;
    const delta = target - from;
    const perStep = delta / steps;
    let i = 0;

    const id = setInterval(() => {
      i += 1;
      const next = i >= steps ? target : Math.round(from + perStep * i);
      displayRef.current = next;
      setDisplay(next);
      if (i >= steps) {
        clearInterval(id);
      }
    }, stepMs);

    return () => clearInterval(id);
  }, [target, stepMs, steps]);

  return display;
}

export default useTicker;
