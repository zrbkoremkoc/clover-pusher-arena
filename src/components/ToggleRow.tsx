import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  Icon: LucideIcon;
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

export function ToggleRow({ Icon, label, value, onChange }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.98);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={HIT}
      onPress={() => onChange(!value)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}>
      <Animated.View pointerEvents="box-none" style={[styles.row, { transform: [{ scale }] }]}>
        <View style={styles.iconWrap}>
          <Icon size={20} color={theme.colors.accent.grass} strokeWidth={2.4} />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <View style={[styles.track, value ? styles.trackOn : styles.trackOff]}>
          <View style={[styles.knob, value ? styles.knobOn : styles.knobOff]} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 64 },
  row: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.ui.ghost,
    borderWidth: 1,
    borderColor: theme.colors.ui.ghostBorder,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(123,201,80,0.12)',
  },
  label: { flex: 1, fontSize: 12, fontWeight: '800', letterSpacing: 1, color: theme.colors.text.primary },
  track: { width: 52, height: 30, borderRadius: 15, padding: 3, justifyContent: 'center' },
  trackOn: { backgroundColor: 'rgba(123,201,80,0.35)' },
  trackOff: { backgroundColor: 'rgba(242,251,234,0.10)' },
  knob: { width: 24, height: 24, borderRadius: 12 },
  knobOn: { alignSelf: 'flex-end', backgroundColor: theme.colors.accent.grass },
  knobOff: { alignSelf: 'flex-start', backgroundColor: 'rgba(242,251,234,0.40)' },
});

export default ToggleRow;
