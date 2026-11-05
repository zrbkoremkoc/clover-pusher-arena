import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import theme from '../constants/theme';
import { formatClock } from '../game/economy';

type Props = { msLeft: number; tray: number };

/** The free refill countdown. It cannot be skipped, bought or sped up. */
export function RefillTimerCard({ msLeft, tray }: Props) {
  return (
    <View style={styles.card}>
      <View pointerEvents="none" style={styles.highlight} />
      <View style={styles.iconWrap}>
        <Clock size={22} color={theme.colors.accent.grass} strokeWidth={2.4} />
      </View>
      <Text style={styles.value}>{formatClock(msLeft)}</Text>
      <Text style={styles.label} numberOfLines={1}>
        NEXT FREE REFILL
      </Text>
      <Text style={styles.sub} numberOfLines={1}>
        {'TRAY ' + tray}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 112,
    borderRadius: theme.radius.card,
    backgroundColor: 'rgba(30,77,51,0.92)',
    borderWidth: 2,
    borderColor: 'rgba(123,201,80,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    overflow: 'hidden',
    ...theme.shadows.clay,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.ui.highlight,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(123,201,80,0.12)',
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.accent.grass,
    fontVariant: ['tabular-nums'],
  },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: theme.colors.text.secondary },
  sub: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: theme.colors.text.muted },
});

export default React.memo(RefillTimerCard);
