import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import theme from '../constants/theme';
import { formatCoins } from '../game/economy';
import useTicker from '../hooks/useTicker';

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  style?: StyleProp<TextStyle>;
};

/** Count-up readout with tabular numerals so the row never jitters. */
export function Ticker({ value, prefix = '', suffix = '', style }: Props) {
  const display = useTicker(value);
  return (
    <Text style={[styles.text, style]} numberOfLines={1}>
      {prefix + formatCoins(display) + suffix}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.accent.gold,
    fontVariant: ['tabular-nums'],
  },
});

export default React.memo(Ticker);
