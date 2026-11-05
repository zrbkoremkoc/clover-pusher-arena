import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
  tone?: 'grass' | 'gold';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Pressable is the parent and the Animated.View its child — the reverse eats
 * onPress on Android release builds.
 */
export function PrimaryButton({
  label,
  onPress,
  Icon,
  height = 56,
  tone = 'grass',
  disabled = false,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const colors = tone === 'gold' ? theme.gradients.gold : theme.gradients.grass;
  const shadow = tone === 'gold' ? theme.shadows.gold : theme.shadows.grass;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, { height }, disabled ? styles.disabled : null, style]}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]} pointerEvents="box-none">
        <LinearGradient
          colors={colors as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.grad, shadow, { height, borderRadius: theme.radius.button }]}>
          <View pointerEvents="none" style={[styles.highlight, { borderRadius: theme.radius.button }]} />
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={theme.colors.text.onGrass} strokeWidth={2.6} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%' },
  disabled: { opacity: 0.45 },
  fill: { width: '100%' },
  grad: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: {
    fontSize: 16,
    lineHeight: ICON,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: theme.colors.text.onGrass,
  },
});

export default PrimaryButton;
