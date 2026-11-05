export const TROPICAL = {
  name: 'tropical',

  colors: {
    bg: {
      primary: '#0D2818',       // dark tropical green
      secondary: '#132D1E',
      tertiary: '#1A3A28',
      accent: '#0F3024',
    },
    tropic: {
      green: '#00E676',
      orange: '#FF6D00',
      yellow: '#FFEA00',
      pink: '#FF4081',
      blue: '#00B0FF',
      teal: '#1DE9B6',
    },
    text: {
      primary: '#F0FFF0',
      secondary: '#7BAF8E',
      accent: '#00E676',
      muted: '#4A7A5A',
    },
    ui: {
      border: '#1A4A2E',
      divider: '#153A24',
      overlay: 'rgba(13, 40, 24, 0.8)',
      glass: 'rgba(19, 45, 30, 0.85)',
    },
  },

  gradients: {
    primary: ['#00E676', '#00B0FF'],
    surface: ['#0D2818', '#1A3A28'],
    button: ['#FF6D00', '#FFEA00'],
    reward: ['#FFEA00', '#FF6D00'],
    header: ['#0D2818', '#0F3024'],
    sunset: ['#FF4081', '#FF6D00', '#FFEA00'],
  },

  typography: {
    hero: { fontSize: 44, fontWeight: '900' as const, letterSpacing: -1 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 0 },
    subtitle: { fontSize: 17, fontWeight: '600' as const, letterSpacing: 0.3 },
    body: { fontSize: 15, fontWeight: '400' as const, letterSpacing: 0.1 },
    caption: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.5 },
    button: { fontSize: 16, fontWeight: '700' as const, letterSpacing: 1.5 },
    score: { fontSize: 38, fontWeight: '900' as const, letterSpacing: -1 },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },

  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
    pill: 100,
  },

  shadows: {
    card: {
      shadowColor: '#00E676',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    button: {
      shadowColor: '#FF6D00',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
  },

  animation: {
    spring: { tension: 130, friction: 7 },
    bounce: { tension: 200, friction: 8 },
    smooth: { duration: 250 },
    slow: { duration: 450 },
  },
};

// ============================================================
// SPACE COSMOS — deep space, stars, mystery
// ============================================================
