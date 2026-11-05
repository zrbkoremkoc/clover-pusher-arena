import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  width?: number;
};

export function Chip({ label, active, onPress, width }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      style={[
        styles.chip,
        width ? { width } : styles.flexible,
        active ? styles.active : styles.idle,
      ]}>
      <Text style={[styles.label, { color: active ? theme.colors.accent.gold : theme.colors.text.secondary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    borderRadius: theme.radius.chip,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  flexible: { flex: 1 },
  active: { backgroundColor: 'rgba(247,209,84,0.12)', borderColor: theme.colors.accent.gold },
  idle: { backgroundColor: theme.colors.ui.ghost, borderColor: theme.colors.ui.ghostBorder },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
});

export default Chip;
