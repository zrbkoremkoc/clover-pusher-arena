import React from 'react';
import { Animated, Image, Pressable, StyleSheet } from 'react-native';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  onPress: () => void;
  label: string;
  Icon?: LucideIcon;
  source?: ImageSourcePropType;
  size?: number;
  tint?: string;
  style?: StyleProp<ViewStyle>;
};

/** Square tap target with an explicit width AND height — never intrinsic. */
export function IconButton({ onPress, label, Icon, source, size = 48, tint, style }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);
  const color = tint || theme.colors.text.primary;
  const glyph = Math.round(size * 0.42);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[{ width: size, height: size }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.body,
          { width: size, height: size, borderRadius: size / 2, transform: [{ scale }] },
        ]}>
        {Icon ? <Icon size={glyph} color={color} strokeWidth={2.4} /> : null}
        {!Icon && source ? (
          <Image source={source} style={{ width: glyph, height: glyph, resizeMode: 'contain' }} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242,251,234,0.08)',
    borderWidth: 1,
    borderColor: theme.colors.ui.ghostBorder,
  },
});

export default IconButton;
