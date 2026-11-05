/**
 * Deterministic 2D coin-pusher simulation (top-down view of the glass).
 *
 * A dropped coin accelerates down the chute, crosses the shelf line onto the
 * "bed", is slowed by surface drag until it comes to rest, and then only moves
 * when the pusher plate shoves it or another coin bumps into it. Coins that
 * pass the front lip are collected.
 *
 * No React state is touched here — the hook owns the arrays and copies the
 * result into Animated values once per frame.
 */

import {
  BED_DRAG,
  FRICTION,
  GRAVITY,
  PUSH_IMPULSE,
  REST_EPSILON,
  RESTITUTION,
} from '../constants/config';

export type CoinKind = 'clover' | 'golden' | 'charm';

export type CoinBody = {
  id: number;
  kind: CoinKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  resting: boolean;
};

export type FieldSpec = {
  width: number;
  height: number;
  coin: number;
  lip: number;
  shelfLine: number;
};

export type StepResult = {
  collected: CoinBody[];
  landed: boolean;
};

/** Small seeded nudge so stacks spread naturally instead of forming a tower. */
let nudgeSeed = 0x2f6e2b1;
function seededNudge(): number {
  nudgeSeed = (nudgeSeed * 1664525 + 1013904223) >>> 0;
  return ((nudgeSeed >>> 8) / 0x1000000) * 4 - 2;
}

export function resetNudgeSeed(): void {
  nudgeSeed = 0x2f6e2b1;
}

export function createCoin(id: number, kind: CoinKind, x: number): CoinBody {
  return {
    id,
    kind,
    x,
    y: -8,
    vx: seededNudge() * 0.25,
    vy: 0,
    rot: 0,
    spin: seededNudge() * 1.2,
    resting: false,
  };
}

/**
 * Advances the simulation by one frame.
 * `plateTop` / `plateBottom` are the current edges of the pusher plate and
 * `plateDelta` is how far it moved this frame (positive = toward the lip).
 */
export function stepField(
  coins: CoinBody[],
  field: FieldSpec,
  plateTop: number,
  plateBottom: number,
  plateDelta: number,
): StepResult {
  const r = field.coin / 2;
  const minX = r;
  const maxX = field.width - r;
  const lipY = field.height - field.lip;
  let landed = false;

  for (let i = 0; i < coins.length; i++) {
    const c = coins[i];
    if (c.resting) {
      continue;
    }

    const onBed = c.y + field.coin > field.shelfLine;
    if (onBed) {
      c.vy *= BED_DRAG;
      c.vx *= BED_DRAG;
    } else {
      c.vy += GRAVITY;
      c.vx *= FRICTION;
    }

    c.x += c.vx;
    c.y += c.vy;
    c.rot += c.spin;
    c.spin *= 0.94;

    if (c.x < minX) {
      c.x = minX;
      c.vx = -c.vx * RESTITUTION;
    } else if (c.x > maxX) {
      c.x = maxX;
      c.vx = -c.vx * RESTITUTION;
    }

    if (onBed && Math.abs(c.vy) < REST_EPSILON && Math.abs(c.vx) < REST_EPSILON) {
      c.vx = 0;
      c.vy = 0;
      c.spin = 0;
      c.resting = true;
      landed = true;
    }
  }

  // Separate overlapping coins. Two passes is plenty for a pile this size and
  // keeps the chain reaction that pushes the front row over the lip.
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < coins.length; i++) {
      for (let j = i + 1; j < coins.length; j++) {
        const a = coins[i];
        const b = coins[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= field.coin || dist === 0) {
          if (dist === 0) {
            b.x += 0.5;
          }
          continue;
        }
        const overlap = (field.coin - dist) / 2;
        dx /= dist;
        dy /= dist;
        a.x -= dx * overlap;
        a.y -= dy * overlap;
        b.x += dx * overlap;
        b.y += dy * overlap;
        if (overlap > 0.4) {
          a.resting = false;
          b.resting = false;
          a.vy -= dy * overlap * 0.18;
          b.vy += dy * overlap * 0.18;
        }
        if (a.x < minX) {
          a.x = minX;
        }
        if (a.x > maxX) {
          a.x = maxX;
        }
        if (b.x < minX) {
          b.x = minX;
        }
        if (b.x > maxX) {
          b.x = maxX;
        }
      }
    }
  }

  // The pusher plate cannot overlap a coin: anything inside it is shoved out
  // of the front face and keeps a little momentum.
  if (plateDelta > 0) {
    for (let i = 0; i < coins.length; i++) {
      const c = coins[i];
      if (c.y < plateBottom && c.y + field.coin > plateTop) {
        c.y = plateBottom;
        c.vy = PUSH_IMPULSE;
        c.vx += seededNudge() * 0.35;
        c.spin = seededNudge() * 0.8;
        c.resting = false;
      }
    }
  }

  const collected: CoinBody[] = [];
  for (let i = coins.length - 1; i >= 0; i--) {
    const c = coins[i];
    if (c.y + field.coin * 0.5 > lipY) {
      collected.push(c);
      coins.splice(i, 1);
    }
  }

  return { collected, landed };
}

/** The plate's top edge for a given elapsed time (smooth sine travel). */
export function plateTopAt(
  elapsedMs: number,
  baseY: number,
  travel: number,
  loopMs: number,
): number {
  const phase = (elapsedMs % loopMs) / loopMs;
  return baseY + (travel / 2) * (1 - Math.cos(phase * Math.PI * 2));
}

export function isFieldSettled(coins: CoinBody[]): boolean {
  for (let i = 0; i < coins.length; i++) {
    if (!coins[i].resting) {
      return false;
    }
  }
  return true;
}
