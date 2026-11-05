/** Cabinet skins unlock purely by playing — nothing is ever purchased. */

import assets from '../assets';
import { UNLOCK_ROUNDS } from '../constants/config';

export type CabinetDef = {
  id: string;
  name: string;
  tagline: string;
  requiredRounds: number;
  emblem: number;
};

export const CABINETS: CabinetDef[] = [
  {
    id: 'meadow',
    name: 'MEADOW',
    tagline: 'THE HOUSE CABINET',
    requiredRounds: UNLOCK_ROUNDS[0],
    emblem: assets.sprite5,
  },
  {
    id: 'orchard',
    name: 'ORCHARD',
    tagline: 'WIDER SHELF, SLOWER SWEEP',
    requiredRounds: UNLOCK_ROUNDS[1],
    emblem: assets.sprite5,
  },
  {
    id: 'twilight',
    name: 'TWILIGHT FAIR',
    tagline: 'BULB LIGHTS AND LANTERNS',
    requiredRounds: UNLOCK_ROUNDS[2],
    emblem: assets.sprite5,
  },
];

export function isUnlocked(cabinet: CabinetDef, roundsPlayed: number): boolean {
  return roundsPlayed >= cabinet.requiredRounds;
}

export function unlockLabel(cabinet: CabinetDef): string {
  return 'PLAY ' + cabinet.requiredRounds + ' ROUNDS TO UNLOCK';
}
