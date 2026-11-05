import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import { SHOWER_DURATION_MS } from '../constants/config';
import theme from '../constants/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const PARTICLES = 26;
const GOLDEN_FROM = 19;

type Props = {
  visible: boolean;
  amount: number;
  reducedMotion: boolean;
  onFinish: () => void;
};

type Particle = { id: number; x: number; size: number; delay: number; duration: number; golden: boolean };

function buildParticles(): Particle[] {
  return Array.from({ length: PARTICLES }, (_, i) => ({
    id: i,
    x: Math.random() * (SCREEN_W - 48) + 8,
    size: 26 + Math.round(Math.random() * 14),
    delay: Math.round(Math.random() * 600),
    duration: 900 + Math.round(Math.random() * 600),
    golden: i >= GOLDEN_FROM,
  }));
}

/** 26 falling coins, a double gold vignette pulse, then the amount is banked. */
export function CoinShowerOverlay({ visible, amount, reducedMotion, onFinish }: Props) {
  const particles = useMemo(buildParticles, []);
  const progress = useRef(particles.map(() => new Animated.Value(0))).current;
  const vignette = useRef(new Animated.Value(0)).current;
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (reducedMotion) {
      const id = setTimeout(() => finishRef.current(), 700);
      return () => clearTimeout(id);
    }

    const falls = progress.map((p, i) => {
      p.setValue(0);
      return Animated.sequence([
        Animated.delay(particles[i].delay),
        Animated.timing(p, {
          toValue: 1,
          duration: particles[i].duration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]);
    });

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(vignette, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(vignette, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
      { iterations: 2 },
    );

    Animated.parallel(falls).start();
    pulse.start();

    const id = setTimeout(() => finishRef.current(), SHOWER_DURATION_MS);
    return () => {
      clearTimeout(id);
      pulse.stop();
    };
  }, [visible, reducedMotion, particles, progress, vignette]);

  if (!visible) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.vignette, { opacity: vignette }]} />
      {particles.map((p, i) => {
        const translateY = progress[i].interpolate({
          inputRange: [0, 1],
          outputRange: [-p.size, SCREEN_H + p.size],
        });
        const rotate = progress[i].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '540deg'],
        });
        return (
          <Animated.View
            key={p.id}
            style={[styles.particle, { left: p.x, transform: [{ translateY }, { rotate }] }]}>
            <Image
              source={p.golden ? assets.sprite2 : assets.sprite1}
              style={{ width: p.size, height: p.size, resizeMode: 'contain' }}
            />
          </Animated.View>
        );
      })}
      <View style={styles.textBlock}>
        <Text style={styles.headline}>COIN SHOWER</Text>
        <Text style={styles.sub}>{'+' + amount + ' VIRTUAL COINS'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vignette: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(247,209,84,0.12)' },
  particle: { position: 'absolute', top: 0 },
  textBlock: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  headline: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.accent.gold,
    textShadowColor: 'rgba(0,0,0,0.60)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  sub: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.text.primary,
  },
});

export default CoinShowerOverlay;
