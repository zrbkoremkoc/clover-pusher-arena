import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { formatCoins } from '../game/economy';
import useTicker from '../hooks/useTicker';

type Props = {
  value: number;
  compact?: boolean;
};

/**
 * The ONLY place a balance is rendered. It always prints the word VIRTUAL so
 * no number in this app can be mistaken for money.
 */
export function CoinBalance({ value, compact = false }: Props) {
  const display = useTicker(value);
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(pop, { toValue: 1.08, useNativeDriver: true, ...theme.animation.pop }),
      Animated.spring(pop, { toValue: 1, useNativeDriver: true, ...theme.animation.pop }),
    ]).start();
  }, [value, pop]);

  const size = compact ? 18 : 22;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pill,
        compact ? styles.pillCompact : styles.pillFull,
        { transform: [{ scale: pop }] },
      ]}>
      <View pointerEvents="none" style={styles.highlight} />
      <Image source={assets.sprite1} style={{ width: size, height: size, resizeMode: 'contain' }} />
      <View style={styles.textBlock}>
        <Text style={[styles.value, compact ? styles.valueCompact : null]}>{formatCoins(display)}</Text>
        <Text style={[styles.unit, compact ? styles.unitCompact : null]}>VIRTUAL</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.goldLine,
    overflow: 'hidden',
  },
  pillFull: { height: 44, borderRadius: 22, paddingHorizontal: 12 },
  pillCompact: { height: 40, borderRadius: 20, paddingHorizontal: 10 },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  textBlock: { alignItems: 'flex-start' },
  value: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.accent.gold,
    fontVariant: ['tabular-nums'],
  },
  valueCompact: { fontSize: 15 },
  unit: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: 'rgba(242,251,234,0.60)',
  },
  unitCompact: { fontSize: 9 },
});

export default React.memo(CoinBalance);
