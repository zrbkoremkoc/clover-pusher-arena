import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import { LOADER_DURATION_MS } from '../constants/config';
import theme from '../constants/theme';
import AppShell from '../components/AppShell';

const BAR_W = 190;
const DOTS = [
  { top: '18%', left: '12%' },
  { top: '24%', left: '74%' },
  { top: '31%', left: '38%' },
  { top: '58%', left: '18%' },
  { top: '62%', left: '82%' },
  { top: '69%', left: '48%' },
  { top: '78%', left: '28%' },
  { top: '83%', left: '66%' },
  { top: '88%', left: '44%' },
] as const;

type Props = { onDone: () => void };

/**
 * The darkest screen in the app — a near-opaque overlay, the brand badge, a
 * progress bar and nothing else. Deliberately nothing in common with Menu.
 */
export function LoaderScreen({ onDone }: Props) {
  const badgeScale = useRef(new Animated.Value(0.72)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(16)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  const dotValues = useRef(DOTS.map(() => new Animated.Value(0.2))).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const blobs = useMemo(
    () => [
      { size: 220, style: { top: -60, left: -50 } },
      { size: 160, style: { top: '38%' as const, right: -70 } },
      { size: 120, style: { bottom: -40, left: '22%' as const } },
    ],
    [],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.spring(badgeScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(badgeOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(220),
        Animated.parallel([
          Animated.timing(textY, { toValue: 0, duration: 380, useNativeDriver: true }),
          Animated.timing(textOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        ]),
      ]),
    ]).start();

    const idle = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: -8,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    idle.start();

    // The bar animates its width, so it must stay off the native driver.
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const sparkles = dotValues.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(v, { toValue: 0.8, duration: 900, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.2, duration: 900, useNativeDriver: true }),
        ]),
      ),
    );
    sparkles.forEach(s => s.start());

    const timer = setTimeout(() => {
      Animated.timing(fade, { toValue: 0, duration: 320, useNativeDriver: true }).start(() =>
        doneRef.current(),
      );
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      idle.stop();
      sparkles.forEach(s => s.stop());
    };
  }, [badgeOpacity, badgeScale, dotValues, fade, float, progress, textOpacity, textY]);

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  const decor = (
    <>
      {blobs.map((b, i) => (
        <View
          key={i}
          style={[styles.blob, b.style as object, { width: b.size, height: b.size, borderRadius: b.size / 2 }]}
        />
      ))}
      {DOTS.map((d, i) => (
        <Animated.View key={i} style={[styles.dot, d as object, { opacity: dotValues[i] }]} />
      ))}
    </>
  );

  return (
    <AppShell gradient={theme.gradients.loader} decor={decor}>
      <Animated.View style={[styles.root, { opacity: fade }]}>
        <Animated.View
          style={[
            styles.badge,
            {
              opacity: badgeOpacity,
              transform: [{ scale: badgeScale }, { translateY: float }],
            },
          ]}>
          <Image source={assets.logo} style={styles.logo} />
        </Animated.View>

        <Animated.View
          style={[styles.titleBlock, { opacity: textOpacity, transform: [{ translateY: textY }] }]}>
          <Text style={styles.title}>CLOVER PUSHER</Text>
          <Text style={styles.sub}>ARENA</Text>
          <Text style={styles.tagline}>VIRTUAL COIN ARCADE · 18+</Text>
        </Animated.View>

        <View style={styles.barBlock}>
          <View style={styles.track}>
            <Animated.View style={[styles.fillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.goldGrass as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  blob: { position: 'absolute', backgroundColor: 'rgba(123,201,80,0.10)' },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(247,209,84,0.35)',
  },
  badge: {
    width: 168,
    height: 168,
    borderRadius: 42,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 2,
    borderColor: 'rgba(247,209,84,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.accent.grass,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 26,
    elevation: 14,
  },
  logo: { width: 118, height: 118, resizeMode: 'contain' },
  titleBlock: { alignItems: 'center', marginTop: 28, gap: 6 },
  title: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(123,201,80,0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  sub: { fontSize: 22, fontWeight: '800', letterSpacing: 10, color: theme.colors.accent.gold },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(242,251,234,0.55)',
  },
  barBlock: { alignItems: 'center', marginTop: 44, gap: 12 },
  track: {
    width: BAR_W,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(242,251,234,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(123,201,80,0.18)',
    overflow: 'hidden',
  },
  fillWrap: { height: '100%' },
  fill: { flex: 1 },
  loading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    color: 'rgba(242,251,234,0.45)',
  },
});

export default LoaderScreen;
