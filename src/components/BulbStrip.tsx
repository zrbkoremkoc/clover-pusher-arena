import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BULB_LOOP_MS } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  count?: number;
  color?: string;
  size?: number;
  animate?: boolean;
};

/** The fairground bulb chase — a looping opacity stagger, never layout. */
export function BulbStrip({
  count = 12,
  color = theme.colors.accent.gold,
  size = 7,
  animate = true,
}: Props) {
  const values = useRef(
    Array.from({ length: count }, () => new Animated.Value(0.25)),
  ).current;

  const indices = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  useEffect(() => {
    if (!animate) {
      values.forEach(v => v.setValue(0.6));
      return;
    }
    const loops = values.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 125),
          Animated.timing(v, {
            toValue: 1,
            duration: BULB_LOOP_MS / 2,
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0.25,
            duration: BULB_LOOP_MS / 2,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [animate, values]);

  return (
    <View pointerEvents="none" style={styles.row}>
      {indices.map(i => (
        <Animated.View
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: values[i],
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});

export default BulbStrip;
