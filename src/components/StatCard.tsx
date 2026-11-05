import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';

type Props = {
  Icon: LucideIcon;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * One shared stat pill for Menu and GameOver. Vector icons only (never AI
 * sprites, whose internal aspect ratios never match) and `width:'100%'` rather
 * than `flex:1`, so the card keeps its intrinsic content height inside a
 * flex:1 slot.
 */
export function StatCard({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View pointerEvents="none" style={styles.highlight} />
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1F' }]}>
        <Icon size={22} color={valueColor} strokeWidth={2.4} />
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Fixed height so a StatCard and a RefillTimerCard sitting in the same row
  // line up exactly. width:'100%' (never flex:1) inside the flex:1 slot.
  card: {
    width: '100%',
    height: 112,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: theme.radius.card,
    borderWidth: 2,
    backgroundColor: 'rgba(30,77,51,0.92)',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
});

export default React.memo(StatCard);
