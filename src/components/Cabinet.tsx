import React, { useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BOARD_BORDER,
  BOARD_PAD,
  LIP_HEIGHT,
  SHELF_HEIGHT,
  SHELF_LINE_RATIO,
} from '../constants/config';
import theme from '../constants/theme';

type Props = {
  cabinetWidth: number;
  playWidth: number;
  cellSize: number;
  fieldHeight: number;
  shelfY: Animated.Value;
  lipFlash: Animated.Value;
  slotGlow: Animated.Value;
  slotWidth: number;
  onFieldLayout: (e: LayoutChangeEvent) => void;
  children?: React.ReactNode;
};

/**
 * The glass cabinet: gold-rimmed frame, playfield floor, the sliding pusher
 * plate, the gold centre slot and the front lip that collects coins.
 *
 * Width comes from the BOARD_FRAME formula so the field never overflows the
 * frame: CABINET_W = CELL*COLS + 2*(PAD + BORDER).
 */
export function Cabinet({
  cabinetWidth,
  playWidth,
  cellSize,
  fieldHeight,
  shelfY,
  lipFlash,
  slotGlow,
  slotWidth,
  onFieldLayout,
  children,
}: Props) {
  const gridLines = useMemo(() => {
    if (fieldHeight <= 0) {
      return [];
    }
    const rows = Math.ceil(fieldHeight / cellSize);
    return Array.from({ length: rows }, (_, i) => (i + 1) * cellSize);
  }, [fieldHeight, cellSize]);

  const shelfTop = fieldHeight > 0 ? fieldHeight * SHELF_LINE_RATIO - SHELF_HEIGHT : 0;

  return (
    <View style={[styles.frame, { width: cabinetWidth }]}>
      <View style={styles.field} onLayout={onFieldLayout}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {gridLines.map(y => (
            <View key={y} style={[styles.gridLine, { top: y }]} />
          ))}
        </View>

        {fieldHeight > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shelfWrap,
              { top: shelfTop, width: playWidth, transform: [{ translateY: shelfY }] },
            ]}>
            <LinearGradient
              colors={theme.gradients.shelf as unknown as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.shelf}
            />
            <Animated.View
              style={[
                styles.slot,
                {
                  width: slotWidth,
                  left: playWidth / 2 - slotWidth / 2,
                  opacity: slotGlow,
                },
              ]}
            />
          </Animated.View>
        ) : null}

        {children}

        <Animated.View
          pointerEvents="none"
          style={[styles.lipFlash, { height: LIP_HEIGHT, opacity: lipFlash }]}
        />
        <View pointerEvents="none" style={[styles.lip, { height: LIP_HEIGHT }]}>
          <View style={styles.lipLine} />
          <LinearGradient
            colors={theme.gradients.lip as unknown as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <LinearGradient
          pointerEvents="none"
          colors={theme.gradients.sheen as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sheen}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.accent.gold,
    borderRadius: 28,
    backgroundColor: theme.colors.bg.cabinet,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 14,
  },
  field: {
    flex: 1,
    borderRadius: theme.radius.field,
    backgroundColor: theme.colors.bg.field,
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(123,201,80,0.07)',
  },
  shelfWrap: { position: 'absolute', left: 0 },
  shelf: {
    width: '100%',
    height: SHELF_HEIGHT,
    borderRadius: 8,
  },
  slot: {
    position: 'absolute',
    top: -4,
    height: 26,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.accent.gold,
    backgroundColor: 'rgba(247,209,84,0.14)',
  },
  lip: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  lipLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.accent.gold,
  },
  lipFlash: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(247,209,84,0.30)',
  },
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '40%' },
});

export default Cabinet;
