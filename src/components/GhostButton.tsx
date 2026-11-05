import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

const ICON = 24;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  height?: number;
  tone?: 'ghost' | 'danger';
  style?: StyleProp<ViewStyle>;
};

export function GhostButton({ label, onPress, Icon, height = 48, tone = 'ghost', style }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const isDanger = tone === 'danger';
  const color = isDanger ? theme.colors.accent.danger : theme.colors.text.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.body,
          {
            height,
            transform: [{ scale }],
            backgroundColor: isDanger ? 'rgba(217,123,77,0.14)' : 'rgba(242,251,234,0.07)',
            borderColor: isDanger ? theme.colors.accent.danger : theme.colors.ui.ghostBorder,
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={color} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%' },
  body: {
    width: '100%',
    borderRadius: theme.radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: { fontSize: 13, lineHeight: ICON, fontWeight: '800', letterSpacing: 1.4 },
});

export default GhostButton;
