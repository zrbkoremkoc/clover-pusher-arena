/**
 * Visual preset: TROPICAL (design-system/preset.ts) with the CloverPusherArena
 * accent hexes applied. The `name` field is the preset value and must stay
 * exactly 'tropical'.
 *
 * Style layer: CLAYMORPHISM — puffy surfaces, double shadow (outer colour-matched
 * glow + 2px inner top highlight), radii 20-30.
 */

export const theme = {
  name: 'tropical',

  colors: {
    bg: {
      deep: '#0A2015',
      base: '#10301F',
      surface: '#1E4D33',
      raised: '#2A5F3E',
      field: '#0E2E1D',
      cabinet: '#143D27',
    },
    accent: {
      grass: '#7BC950',
      grassDark: '#4F9636',
      gold: '#F7D154',
      goldDark: '#D9A92E',
      danger: '#D97B4D',
    },
    text: {
      primary: '#F2FBEA',
      secondary: 'rgba(242,251,234,0.62)',
      muted: 'rgba(242,251,234,0.40)',
      onGrass: '#0B2416',
    },
    ui: {
      hairline: 'rgba(123,201,80,0.22)',
      goldLine: 'rgba(247,209,84,0.38)',
      ghost: 'rgba(242,251,234,0.06)',
      ghostBorder: 'rgba(242,251,234,0.10)',
      highlight: 'rgba(255,255,255,0.14)',
      scrim: 'rgba(0,0,0,0.70)',
      headerBar: 'rgba(0,0,0,0.30)',
    },
  },

  gradients: {
    grass: ['#7BC950', '#4F9636'] as const,
    gold: ['#F7D154', '#D9A92E'] as const,
    goldGrass: ['#7BC950', '#F7D154'] as const,
    loader: ['rgba(5,20,12,0.94)', 'rgba(8,26,16,0.90)', 'rgba(16,48,31,0.96)'] as const,
    menu: ['rgba(16,48,31,0.72)', 'rgba(16,48,31,0.50)', 'rgba(10,32,21,0.88)'] as const,
    game: ['rgba(10,32,21,0.86)', 'rgba(16,48,31,0.55)', 'rgba(8,26,16,0.92)'] as const,
    gameover: ['rgba(8,26,16,0.93)', 'rgba(30,77,51,0.80)'] as const,
    sub: ['rgba(10,32,21,0.90)', 'rgba(16,48,31,0.70)', 'rgba(8,26,16,0.94)'] as const,
    sheen: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0)'] as const,
    lip: ['rgba(0,0,0,0)', 'rgba(247,209,84,0.16)'] as const,
    shelf: ['#7BC950', '#4F9636'] as const,
    rail: ['#2A5F3E', '#1E4D33'] as const,
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '900' as const, letterSpacing: 3 },
    title: { fontSize: 26, fontWeight: '900' as const, letterSpacing: 1.5 },
    section: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 1 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.1 },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.2 },
    micro: { fontSize: 10, fontWeight: '800' as const, letterSpacing: 1 },
    score: { fontSize: 26, fontWeight: '900' as const, letterSpacing: 0 },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  radius: { sm: 10, chip: 20, pill: 22, button: 24, card: 26, tile: 30, field: 20 },

  shadows: {
    clay: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 12,
    },
    grass: {
      shadowColor: '#7BC950',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 22,
      elevation: 14,
    },
    gold: {
      shadowColor: '#F7D154',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 12,
    },
  },

  animation: {
    press: { tension: 300, friction: 12 },
    entry: { tension: 65, friction: 9 },
    reel: { tension: 120, friction: 9 },
    pop: { tension: 180, friction: 7 },
    fade: 300,
  },
} as const;

export type Theme = typeof theme;
export default theme;
