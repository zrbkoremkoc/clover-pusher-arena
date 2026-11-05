import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Zap } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import Ticker from './Ticker';

const ICON = 24;
const ROUND = 56;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type RoundProps = {
  label: string;
  onPress: () => void;
  active?: boolean;
  children: React.ReactNode;
};

function RoundButton({ label, onPress, active = false, children }: RoundProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.roundPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.round,
          active ? styles.roundActive : null,
          { transform: [{ scale }] },
        ]}>
        <Image source={assets.buttonRound} style={styles.roundPlate} resizeMode="contain" />
        {children}
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  collected: number;
  autoOn: boolean;
  disabled: boolean;
  onDrop: () => void;
  onAuto: () => void;
  onHome: () => void;
};

/** The floating G2 control bar — it never covers the cabinet's front lip. */
export function ControlBar({ collected, autoOn, disabled, onDrop, onAuto, onHome }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();

  return (
    <View style={styles.bar}>
      <View pointerEvents="none" style={styles.highlight} />
      <Ticker value={collected} prefix="COLLECTED " suffix=" VIRTUAL COINS" style={styles.ticker} />

      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Drop coin"
          hitSlop={HIT}
          disabled={disabled}
          onPress={onDrop}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[styles.dropPress, disabled ? styles.disabled : null]}>
          <Animated.View style={[styles.dropFill, { transform: [{ scale }] }]} pointerEvents="box-none">
            <LinearGradient
              colors={theme.gradients.grass as unknown as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dropGrad}>
              <View pointerEvents="none" style={styles.dropHighlight} />
              <View style={styles.dropRow}>
                <Image source={assets.sprite1} style={styles.dropIcon} />
                <Text style={styles.dropLabel}>DROP COIN</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </Pressable>

        <RoundButton label="Toggle auto drop" onPress={onAuto} active={autoOn}>
          <Zap
            size={ICON}
            color={autoOn ? theme.colors.accent.gold : theme.colors.text.primary}
            strokeWidth={2.6}
          />
        </RoundButton>

        <RoundButton label="Back to lobby" onPress={onHome}>
          <Image source={assets.iconHome} style={styles.roundGlyph} />
        </RoundButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    height: 92,
    borderRadius: theme.radius.tile,
    backgroundColor: 'rgba(14,38,25,0.94)',
    borderWidth: 2,
    borderColor: 'rgba(123,201,80,0.26)',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    justifyContent: 'space-between',
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
  ticker: { alignSelf: 'center', marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  disabled: { opacity: 0.45 },

  dropPress: { flex: 1, height: 56 },
  dropFill: { width: '100%', height: 56 },
  dropGrad: {
    width: '100%',
    height: 56,
    borderRadius: theme.radius.button,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...theme.shadows.gold,
  },
  dropHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
  dropRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  dropIcon: { width: ICON, height: ICON, resizeMode: 'contain' },
  dropLabel: {
    fontSize: 16,
    lineHeight: ICON,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: theme.colors.text.onGrass,
  },

  roundPress: { width: ROUND, height: ROUND },
  round: {
    width: ROUND,
    height: ROUND,
    borderRadius: ROUND / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242,251,234,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(123,201,80,0.30)',
  },
  roundActive: { borderColor: theme.colors.accent.gold, backgroundColor: 'rgba(247,209,84,0.16)' },
  roundPlate: { position: 'absolute', width: ROUND, height: ROUND, opacity: 0.55 },
  roundGlyph: { width: ICON, height: ICON, resizeMode: 'contain' },
});

export default ControlBar;
