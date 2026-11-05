import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BONUS_SLIDE_MS, REEL_BASE_SPIN_MS, REEL_STAGGER_MS } from '../constants/config';
import theme from '../constants/theme';
import { REELS, STRIPS, STRIP_LENGTH, spin } from '../game/reels';
import type { SpinResult } from '../game/reels';
import BulbStrip from './BulbStrip';
import PrimaryButton from './PrimaryButton';

const SCREEN_H = Dimensions.get('window').height;
const PANEL_PAD = 16;
const REEL_GAP = 10;
const CELL = 150;
const LOOPS = 2;

type Props = {
  visible: boolean;
  panelWidth: number;
  reducedMotion: boolean;
  onFinish: (result: SpinResult) => void;
};

function Leaf({ flip }: { flip?: boolean }) {
  return (
    <View style={flip ? styles.leafFlip : undefined}>
      <Svg width={20} height={20} viewBox="0 0 20 20">
        <Path
          d="M18 2C10 2 2 6 2 13c0 3 2 5 5 5 7 0 11-8 11-16z"
          fill={theme.colors.accent.grass}
        />
      </Svg>
    </View>
  );
}

/**
 * Three real reels fed by one shared symbol pool, stopping left to right with
 * a 100ms stagger. Nothing is wagered — the spin is a free bonus window.
 */
export function CloverSpinOverlay({ visible, panelWidth, reducedMotion, onFinish }: Props) {
  const slide = useRef(new Animated.Value(-SCREEN_H)).current;
  const offsets = useRef(STRIPS.map(() => new Animated.Value(0))).current;
  const [result, setResult] = useState<SpinResult | null>(null);
  const [spinning, setSpinning] = useState(false);

  const reelWidth = Math.max(
    60,
    Math.floor((panelWidth - PANEL_PAD * 2 - REEL_GAP * (REELS - 1)) / REELS),
  );

  const cells = useMemo(
    () =>
      STRIPS.map(strip =>
        Array.from({ length: STRIP_LENGTH * (LOOPS + 1) }, (_, i) => strip[i % STRIP_LENGTH]),
      ),
    [],
  );

  const runSpin = useCallback(() => {
    const outcome = spin();
    setResult(null);
    setSpinning(true);

    const animations = outcome.stops.map((stop, i) => {
      const target = -stop * CELL;
      offsets[i].setValue(-(stop + STRIP_LENGTH * LOOPS) * CELL);
      if (reducedMotion) {
        offsets[i].setValue(target);
        return Animated.delay(0);
      }
      return Animated.sequence([
        Animated.timing(offsets[i], {
          toValue: target + 16,
          duration: REEL_BASE_SPIN_MS + i * REEL_STAGGER_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(offsets[i], {
          toValue: target,
          useNativeDriver: true,
          ...theme.animation.reel,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      setSpinning(false);
      setResult(outcome);
    });
  }, [offsets, reducedMotion]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slide, {
        toValue: 0,
        duration: reducedMotion ? 1 : BONUS_SLIDE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      runSpin();
    } else {
      slide.setValue(-SCREEN_H);
      setResult(null);
      setSpinning(false);
    }
  }, [visible, slide, reducedMotion, runSpin]);

  const handleCollect = useCallback(() => {
    if (!result) {
      return;
    }
    const payload = result;
    Animated.timing(slide, {
      toValue: -SCREEN_H,
      duration: reducedMotion ? 1 : 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => onFinish(payload));
  }, [result, slide, reducedMotion, onFinish]);

  if (!visible) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.scrim} pointerEvents="none" />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.center, { transform: [{ translateY: slide }] }]}>
        <View style={[styles.panel, { width: panelWidth }]}>
          <View pointerEvents="none" style={styles.highlight} />
          <BulbStrip count={10} size={6} animate={!reducedMotion} />

          <View style={styles.reelRow}>
            {cells.map((strip, i) => (
              <View key={i} style={[styles.reel, { width: reelWidth }]}>
                <Animated.View style={{ transform: [{ translateY: offsets[i] }] }}>
                  {strip.map((sym, j) => (
                    <View key={j} style={styles.cell}>
                      <Image source={sym.asset} style={styles.symbol} />
                    </View>
                  ))}
                </Animated.View>
              </View>
            ))}
          </View>

          <View style={styles.bannerRow}>
            <Leaf />
            <Text style={styles.banner} numberOfLines={1}>
              {spinning || !result ? 'CLOVER SPIN' : result.headline}
            </Text>
            <Leaf flip />
          </View>

          <Text style={styles.rewardLine}>
            {result ? '+' + result.reward + ' VIRTUAL COINS' : 'FREE BONUS WINDOW'}
          </Text>

          <PrimaryButton
            label="COLLECT"
            onPress={handleCollect}
            disabled={spinning || !result}
            style={styles.cta}
          />

          <BulbStrip count={10} size={6} animate={!reducedMotion} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.62)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  panel: {
    borderRadius: theme.radius.tile,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 2,
    borderColor: theme.colors.accent.gold,
    padding: PANEL_PAD,
    gap: 12,
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
  reelRow: { flexDirection: 'row', gap: REEL_GAP, justifyContent: 'center' },
  reel: {
    height: CELL,
    borderRadius: 18,
    backgroundColor: theme.colors.bg.field,
    borderWidth: 2,
    borderColor: 'rgba(247,209,84,0.35)',
    overflow: 'hidden',
  },
  cell: { height: CELL, alignItems: 'center', justifyContent: 'center' },
  symbol: { width: 64, height: 64, resizeMode: 'contain' },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  leafFlip: { transform: [{ scaleX: -1 }] },
  banner: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    color: theme.colors.accent.gold,
    marginHorizontal: 12,
  },
  rewardLine: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  cta: { marginTop: 2 },
});

export default CloverSpinOverlay;
