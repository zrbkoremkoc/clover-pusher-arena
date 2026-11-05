/** Tunable parameters for CloverPusherArena. Virtual coins only — no money. */

// Loader must stay at exactly 8000ms (codegen rule #13).
export const LOADER_DURATION_MS = 8000;

// Economy (all values are VIRTUAL coins)
export const START_BALANCE = 1250;
export const TRAY_SIZE = 40;
export const REFILL_INTERVAL_MS = 300000;
export const REFILL_AMOUNT = 10;
export const LIP_REWARD_MIN = 1;
export const LIP_REWARD_MAX = 3;
export const TWO_MATCH_REWARD = 15;
export const NO_MATCH_REWARD = 5;
export const SHOWER_MIN = 40;
export const SHOWER_MAX = 80;

// Field geometry
export const MAX_COINS = 48;
export const COLS = 9;
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_MAX_W = 380;
export const LIP_HEIGHT = 26;
export const SHELF_HEIGHT = 18;
export const SHELF_LINE_RATIO = 0.52;

// Physics
export const GRAVITY = 0.55;
export const RESTITUTION = 0.22;
export const FRICTION = 0.88;
export const BED_DRAG = 0.78;
export const PUSH_IMPULSE = 1.8;
export const REST_EPSILON = 0.22;

// Motion
export const SHELF_LOOP_MS = 1900;
export const SHELF_TRAVEL = 34;
export const BULB_LOOP_MS = 1500;
export const BONUS_SLIDE_MS = 250;
export const REEL_STAGGER_MS = 100;
export const REEL_BASE_SPIN_MS = 1200;
export const AUTO_DROP_MS = 900;
export const SHOWER_DURATION_MS = 2200;

// Token schedule
export const GOLDEN_EVERY = 12;
export const CHARM_EVERY = 30;

// Session
export const SESSION_REMINDER_MIN = 30;
export const UNLOCK_ROUNDS = [0, 15, 40];
export const ALBUM_SLOTS_PER_PAGE = 6;
export const ALBUM_PAGES = 2;

// Session settings
export type HapticStrength = 'off' | 'soft' | 'strong';

export type AppSettings = {
  sound: boolean;
  haptic: HapticStrength;
  reducedMotion: boolean;
  reminderMinutes: number;
};

export const DEFAULT_SETTINGS: AppSettings = {
  sound: true,
  haptic: 'soft',
  reducedMotion: false,
  reminderMinutes: SESSION_REMINDER_MIN,
};
