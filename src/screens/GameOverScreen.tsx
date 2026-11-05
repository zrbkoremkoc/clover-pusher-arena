import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Coins, Sparkles, Trophy } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { formatCoins } from '../game/economy';
import AppShell from '../components/AppShell';
import CoinBalance from '../components/CoinBalance';
import GhostButton from '../components/GhostButton';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';

type Props = {
  collected: number;
  bonuses: number;
  charms: number;
  balance: number;
  rounds: number;
  reducedMotion: boolean;
  onPlayAgain: () => void;
  onMenu: () => void;
};

type Stat = { key: string; Icon: LucideIcon; value: string; label: string; color: string };

/** Round Summary. The CTA says PUSH AGAIN so the UI test can find it. */
export function GameOverScreen({
  collected,
  bonuses,
  charms,
  balance,
  rounds,
  reducedMotion,
  onPlayAgain,
  onMenu,
}: Props) {
  const scale = useRef(new Animated.Value(reducedMotion ? 1 : 0.88)).current;
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 70, friction: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [opacity, reducedMotion, scale]);

  // A zero value is never rendered as an empty pill, and a lone pill is not a row.
  const stats = useMemo<Stat[]>(() => {
    const all: Stat[] = [];
    if (collected > 0) {
      all.push({
        key: 'collected',
        Icon: Coins,
        value: formatCoins(collected),
        label: 'COLLECTED',
        color: theme.colors.accent.gold,
      });
    }
    if (bonuses > 0) {
      all.push({
        key: 'bonuses',
        Icon: Sparkles,
        value: String(bonuses),
        label: 'BONUSES',
        color: theme.colors.accent.grass,
      });
    }
    if (charms > 0) {
      all.push({
        key: 'charms',
        Icon: Trophy,
        value: String(charms),
        label: 'CHARMS',
        color: theme.colors.text.primary,
      });
    }
    return all.length >= 2 ? all : [];
  }, [bonuses, charms, collected]);

  const decor = (
    <>
      <View style={[styles.blob, styles.blobA]} />
      <View style={[styles.blob, styles.blobB]} />
      <View style={styles.bloom} />
    </>
  );

  return (
    <AppShell gradient={theme.gradients.gameover} decor={decor}>
      <ScreenHeader
        title="ROUND SUMMARY"
        subtitle={'ROUND ' + rounds}
        rightSlot={<CoinBalance value={balance} compact />}
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.body, { opacity, transform: [{ scale }] }]}>
        <Image source={assets.logo} style={styles.logo} />
        <Text style={styles.headline}>ROUND COMPLETE</Text>
        <Text style={styles.sub}>THE TRAY IS EMPTY · THE SHELF KEEPS SLIDING</Text>

        {stats.length > 0 ? (
          <View style={styles.statsRow}>
            {stats.map(s => (
              <View key={s.key} style={styles.statSlot}>
                <StatCard Icon={s.Icon} value={s.value} label={s.label} valueColor={s.color} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyNote}>
            <Text style={styles.emptyText}>NO COINS CROSSED THE LIP THIS ROUND</Text>
          </View>
        )}

        <Text style={styles.disclaimer}>ALL AMOUNTS ARE VIRTUAL COINS · NO REAL MONEY</Text>

        <View style={styles.ctas}>
          <PrimaryButton label="PUSH AGAIN" onPress={onPlayAgain} height={60} />
          <GhostButton label="BACK TO LOBBY" onPress={onMenu} />
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute', backgroundColor: 'rgba(123,201,80,0.10)' },
  blobA: { width: 200, height: 200, borderRadius: 100, top: -50, left: -60 },
  blobB: { width: 150, height: 150, borderRadius: 75, bottom: -40, right: -50 },
  bloom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(247,209,84,0.10)',
    top: '22%',
    left: '50%',
    marginLeft: -120,
  },

  body: { flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', gap: 12 },
  logo: { width: 72, height: 72, resizeMode: 'contain' },
  headline: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  sub: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },

  statsRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 6 },
  statSlot: { flex: 1 },

  emptyNote: {
    marginTop: 6,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.ui.ghost,
    borderWidth: 1,
    borderColor: theme.colors.ui.ghostBorder,
  },
  emptyText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },

  disclaimer: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textAlign: 'center',
    color: 'rgba(242,251,234,0.55)',
  },
  ctas: { width: '100%', marginTop: 10, gap: 10 },
});

export default GameOverScreen;
