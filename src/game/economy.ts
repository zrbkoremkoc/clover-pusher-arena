/**
 * Virtual-coin economy. Nothing here can be bought, exchanged or cashed out —
 * the tray only ever refills itself on a free timer.
 */

import {
  CHARM_EVERY,
  GOLDEN_EVERY,
  LIP_REWARD_MAX,
  LIP_REWARD_MIN,
  REFILL_AMOUNT,
  REFILL_INTERVAL_MS,
  TRAY_SIZE,
} from '../constants/config';
import type { CoinKind } from './physics';

export function collectValue(kind: CoinKind): number {
  if (kind === 'charm') {
    return 0;
  }
  if (kind === 'golden') {
    return LIP_REWARD_MAX + 2;
  }
  const span = LIP_REWARD_MAX - LIP_REWARD_MIN + 1;
  return LIP_REWARD_MIN + Math.floor(Math.random() * span);
}

/** Token schedule — every 12th coin is golden, every 30th is a charm. */
export function kindForDrop(dropIndex: number): CoinKind {
  if (dropIndex > 0 && dropIndex % CHARM_EVERY === 0) {
    return 'charm';
  }
  if (dropIndex > 0 && dropIndex % GOLDEN_EVERY === 0) {
    return 'golden';
  }
  return 'clover';
}

export function refillTray(tray: number): number {
  return Math.min(TRAY_SIZE, tray + REFILL_AMOUNT);
}

export const REFILL_PERIOD_MS = REFILL_INTERVAL_MS;

/** 1250 -> "1,250". Always rendered next to the word VIRTUAL. */
export function formatCoins(value: number): string {
  const safe = Math.max(0, Math.floor(value));
  return safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 252000 -> "04:12" */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}
