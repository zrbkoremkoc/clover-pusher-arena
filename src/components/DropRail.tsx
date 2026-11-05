import React, { useCallback, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Polygon } from 'react-native-svg';
import theme from '../constants/theme';

const RAIL_H = 64;
const NOTCHES = [0, 1, 2, 3, 4];
const CARET = 18;

type Props = {
  width: number;
  disabled?: boolean;
  onDrop: (x: number) => void;
};

/**
 * The drop rail. Tapping anywhere along it releases a coin at that column.
 * The marker is an inline SVG triangle — arrow glyphs in <Text> render as
 * tofu on Android.
 */
export function DropRail({ width, disabled = false, onDrop }: Props) {
  const [markerX, setMarkerX] = useState(width / 2);
  const flash = useRef(new Animated.Value(0.45)).current;

  const handlePressIn = useCallback(
    (evt: { nativeEvent: { locationX: number } }) => {
      if (disabled) {
        return;
      }
      const x = evt.nativeEvent.locationX;
      setMarkerX(Math.max(CARET / 2, Math.min(width - CARET / 2, x)));
      flash.setValue(1);
      Animated.timing(flash, {
        toValue: 0.45,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      onDrop(x);
    },
    [disabled, flash, onDrop, width],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Drop a virtual coin"
      disabled={disabled}
      onPressIn={handlePressIn}
      hitSlop={{ top: 8, bottom: 8, left: 0, right: 0 }}
      style={[styles.press, { width, height: RAIL_H }, disabled ? styles.disabled : null]}>
      <LinearGradient
        colors={theme.gradients.rail as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.rail, { width, height: RAIL_H }]}>
        <View pointerEvents="none" style={styles.highlight} />
        <View pointerEvents="none" style={styles.notchRow}>
          {NOTCHES.map(i => (
            <View key={i} style={styles.notch} />
          ))}
        </View>
        <Animated.View
          pointerEvents="none"
          style={[styles.caret, { left: markerX - CARET / 2, opacity: flash }]}>
          <Svg width={CARET} height={CARET} viewBox="0 0 18 18">
            <Polygon points="9,16 1,3 17,3" fill={theme.colors.accent.gold} />
          </Svg>
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { alignSelf: 'center' },
  disabled: { opacity: 0.5 },
  rail: {
    borderRadius: theme.radius.card,
    borderWidth: 2,
    borderColor: 'rgba(247,209,84,0.30)',
    justifyContent: 'center',
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
  notchRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  notch: {
    width: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  caret: { position: 'absolute', bottom: 6, width: CARET, height: CARET },
});

export default DropRail;
