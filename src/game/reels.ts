/**
 * Clover Spin — the three-reel bonus window.
 *
 * One shared symbol pool feeds every reel; there is no separate "target" list,
 * so a match is always mathematically reachable. Symbols are drawn from a
 * weighted strip that is shuffled once at module load.
 */

import assets from '../assets';
import { NO_MATCH_REWARD, SHOWER_MAX, SHOWER_MIN, TWO_MATCH_REWARD } from '../constants/config';

export type ReelSymbol = {
  key: string;
  name: string;
  asset: number;
  weight: number;
};

export const SYMBOLS: ReelSymbol[] = [
  { key: 'coin', name: 'CLOVER COIN', asset: assets.sprite1, weight: 30 },
  { key: 'token', name: 'GOLD TOKEN', asset: assets.sprite2, weight: 14 },
  { key: 'ladybird', name: 'LADYBIRD', asset: assets.sprite3, weight: 20 },
  { key: 'honeybee', name: 'HONEYBEE', asset: assets.sprite4, weight: 18 },
  { key: 'lantern', name: 'LANTERN', asset: assets.sprite5, weight: 10 },
];

export const REELS = 3;
export const STRIP_LENGTH = 10;

function buildStrip(): ReelSymbol[] {
  const pool = SYMBOLS.flatMap(s => Array(Math.max(1, Math.round(s.weight / 2))).fill(s));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  const strip: ReelSymbol[] = [];
  for (let i = 0; i < STRIP_LENGTH; i++) {
    strip.push(pool[i % pool.length]);
  }
  return strip;
}

/** One strip per reel, stable for the whole session. */
export const STRIPS: ReelSymbol[][] = [buildStrip(), buildStrip(), buildStrip()];

export type SpinOutcome = 'three' | 'two' | 'none';

export type SpinResult = {
  stops: number[];
  symbols: ReelSymbol[];
  outcome: SpinOutcome;
  reward: number;
  headline: string;
};

function rewardForShower(): number {
  return SHOWER_MIN + Math.floor(Math.random() * (SHOWER_MAX - SHOWER_MIN + 1));
}

export function spin(): SpinResult {
  const stops = STRIPS.map(strip => Math.floor(Math.random() * strip.length));
  const symbols = stops.map((stop, i) => STRIPS[i][stop]);
  const [a, b, c] = symbols;

  if (a.key === b.key && b.key === c.key) {
    return {
      stops,
      symbols,
      outcome: 'three',
      reward: rewardForShower(),
      headline: 'THREE ' + a.name + 'S!',
    };
  }

  if (a.key === b.key || b.key === c.key || a.key === c.key) {
    return {
      stops,
      symbols,
      outcome: 'two',
      reward: TWO_MATCH_REWARD,
      headline: 'TWO OF A KIND',
    };
  }

  return {
    stops,
    symbols,
    outcome: 'none',
    reward: NO_MATCH_REWARD,
    headline: 'NO MATCH',
  };
}
