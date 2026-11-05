import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  MAX_COINS,
  SHELF_HEIGHT,
  SHELF_LOOP_MS,
  SHELF_TRAVEL,
} from '../constants/config';
import {
  createCoin,
  isFieldSettled,
  plateTopAt,
  resetNudgeSeed,
  stepField,
} from '../game/physics';
import type { CoinBody, CoinKind, FieldSpec } from '../game/physics';

export type CoinView = { id: number; kind: CoinKind };

export type CoinMotion = {
  tx: Animated.Value;
  ty: Animated.Value;
  rot: Animated.Value;
};

type Options = {
  field: FieldSpec;
  active: boolean;
  onCollect: (coin: CoinBody) => void;
  onLand: () => void;
  onSettled: () => void;
};

/**
 * Owns the coin simulation. Positions live in refs and are pushed straight
 * into per-coin Animated values once per frame, so React only re-renders when
 * a coin is spawned or collected — never per frame.
 */
export function usePusherPhysics({ field, active, onCollect, onLand, onSettled }: Options) {
  const bodiesRef = useRef<CoinBody[]>([]);
  const motionRef = useRef<Map<number, CoinMotion>>(new Map());
  const nextIdRef = useRef(1);
  const startedAtRef = useRef(Date.now());
  const plateTopRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const settledRef = useRef(true);

  const [coins, setCoins] = useState<CoinView[]>([]);

  const shelfY = useRef(new Animated.Value(0)).current;

  // Keep the callbacks addressable from inside the frame loop without
  // restarting it on every render.
  const cbRef = useRef({ onCollect, onLand, onSettled, field, active });
  cbRef.current = { onCollect, onLand, onSettled, field, active };

  const getMotion = useCallback((id: number): CoinMotion | undefined => {
    return motionRef.current.get(id);
  }, []);

  const drop = useCallback(
    (x: number, kind: CoinKind) => {
      const spec = cbRef.current.field;
      if (spec.width <= 0 || bodiesRef.current.length >= MAX_COINS) {
        return false;
      }
      const r = spec.coin / 2;
      const clamped = Math.max(r, Math.min(spec.width - r, x));
      const id = nextIdRef.current++;
      const body = createCoin(id, kind, clamped);
      bodiesRef.current.push(body);
      motionRef.current.set(id, {
        tx: new Animated.Value(clamped - r),
        ty: new Animated.Value(body.y),
        rot: new Animated.Value(0),
      });
      settledRef.current = false;
      setCoins(prev => prev.concat({ id, kind }));
      return true;
    },
    [],
  );

  /** Takes a coin off the field without paying it out (the centre slot eats it). */
  const remove = useCallback((id: number) => {
    const idx = bodiesRef.current.findIndex(b => b.id === id);
    if (idx < 0) {
      return;
    }
    bodiesRef.current.splice(idx, 1);
    motionRef.current.delete(id);
    setCoins(prev => prev.filter(c => c.id !== id));
  }, []);

  const reset = useCallback(() => {
    bodiesRef.current = [];
    motionRef.current.clear();
    resetNudgeSeed();
    settledRef.current = true;
    setCoins([]);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const tick = () => {
      if (cancelled) {
        return;
      }
      frameRef.current = requestAnimationFrame(tick);

      const { field: spec, active: isActive } = cbRef.current;
      if (spec.width <= 0 || spec.height <= 0) {
        return;
      }

      const elapsed = Date.now() - startedAtRef.current;
      const baseTop = spec.shelfLine - SHELF_HEIGHT;
      const nextTop = plateTopAt(elapsed, baseTop, SHELF_TRAVEL, SHELF_LOOP_MS);
      const delta = nextTop - plateTopRef.current;
      plateTopRef.current = nextTop;
      shelfY.setValue(nextTop - baseTop);

      if (!isActive) {
        return;
      }

      const bodies = bodiesRef.current;
      const { collected, landed } = stepField(
        bodies,
        spec,
        nextTop,
        nextTop + SHELF_HEIGHT,
        delta,
      );

      const r = spec.coin / 2;
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const m = motionRef.current.get(b.id);
        if (m) {
          m.tx.setValue(b.x - r);
          m.ty.setValue(b.y);
          m.rot.setValue(b.rot);
        }
      }

      if (landed) {
        cbRef.current.onLand();
      }

      if (collected.length > 0) {
        for (let i = 0; i < collected.length; i++) {
          motionRef.current.delete(collected[i].id);
          cbRef.current.onCollect(collected[i]);
        }
        const gone = new Set(collected.map(c => c.id));
        setCoins(prev => prev.filter(c => !gone.has(c.id)));
      }

      const settled = isFieldSettled(bodies);
      if (settled && !settledRef.current) {
        settledRef.current = true;
        cbRef.current.onSettled();
      } else if (!settled) {
        settledRef.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [shelfY]);

  return useMemo(
    () => ({ coins, drop, remove, reset, shelfY, getMotion, bodiesRef }),
    [coins, drop, remove, reset, shelfY, getMotion],
  );
}

export default usePusherPhysics;
