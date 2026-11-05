import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BookOpen, Info, LayoutGrid, Settings, Sparkles, Trophy } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import AppShell from '../components/AppShell';
import BulbStrip from '../components/BulbStrip';
import CoinBalance from '../components/CoinBalance';
import RefillTimerCard from '../components/RefillTimerCard';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import usePressScale from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type NavKey = 'cabinets' | 'album' | 'guide';

const NAV: { key: NavKey; label: string; Icon: LucideIcon }[] = [
  { key: 'cabinets', label: 'CABINETS', Icon: LayoutGrid },
  { key: 'album', label: 'ALBUM', Icon: Sparkles },
  { key: 'guide', label: 'GUIDE', Icon: BookOpen },
];

type Props = {
  balance: number;
  tray: number;
  msLeft: number;
  charms: number;
  reducedMotion: boolean;
  onPlay: () => void;
  onNavigate: (key: NavKey | 'settings' | 'about') => void;
};

function useEntry(index: number, enabled: boolean) {
  const y = useRef(new Animated.Value(enabled ? 24 : 0)).current;
  const opacity = useRef(new Animated.Value(enabled ? 0 : 1)).current;

  useEffect(() => {
    if (!enabled) {
      return;
    }
    Animated.sequence([
      Animated.delay(index * 70),
      Animated.parallel([
        Animated.timing(y, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, [enabled, index, opacity, y]);

  return { opacity, transform: [{ translateY: y }] };
}

function NavTile({ label, Icon, onPress }: { label: string; Icon: LucideIcon; onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.navPress}>
      <Animated.View pointerEvents="box-none" style={[styles.navTile, { transform: [{ scale }] }]}>
        <Icon size={24} color={theme.colors.text.primary} strokeWidth={2.2} />
        <Text style={styles.navLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function FooterButton({ label, Icon, onPress }: { label: string; Icon: LucideIcon; onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.footPress}>
      <Animated.View pointerEvents="box-none" style={[styles.footBtn, { transform: [{ scale }] }]}>
        <Icon size={24} color={theme.colors.text.secondary} strokeWidth={2.2} />
        <Text style={styles.footLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** Meadow Lobby — a bento hub dominated by the PLAY NOW tile. */
export function MenuScreen({
  balance,
  tray,
  msLeft,
  charms,
  reducedMotion,
  onPlay,
  onNavigate,
}: Props) {
  const play = usePressScale();
  const tile0 = useEntry(0, !reducedMotion);
  const tile1 = useEntry(1, !reducedMotion);
  const tile2 = useEntry(2, !reducedMotion);
  const tile3 = useEntry(3, !reducedMotion);

  const decor = (
    <View style={styles.bulbs}>
      <BulbStrip count={12} animate={!reducedMotion} />
    </View>
  );

  return (
    <AppShell gradient={theme.gradients.menu} decor={decor}>
      <ScreenHeader
        title="CLOVER PUSHER ARENA"
        align="left"
        badge={
          <View style={styles.agePill}>
            <Text style={styles.agePillText}>18+ ENTERTAINMENT ONLY</Text>
          </View>
        }
        rightSlot={<CoinBalance value={balance} />}
      />

      <View style={styles.grid}>
        <Animated.View style={tile0} pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Play now"
            hitSlop={HIT}
            onPress={onPlay}
            onPressIn={play.onPressIn}
            onPressOut={play.onPressOut}
            style={styles.playPress}>
            <Animated.View
              pointerEvents="box-none"
              style={[styles.playFill, { transform: [{ scale: play.scale }] }]}>
              <LinearGradient
                colors={theme.gradients.grass as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playTile}>
                <View pointerEvents="none" style={styles.playHighlight} />
                <Image source={assets.sprite2} style={styles.playSprite} />
                <View style={styles.playText}>
                  <Text style={styles.playCaption}>FREE VIRTUAL COINS · NO PURCHASES</Text>
                  <Text style={styles.playCta}>PLAY NOW</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.row, tile1]} pointerEvents="box-none">
          <View style={styles.slot}>
            <RefillTimerCard msLeft={msLeft} tray={tray} />
          </View>
          {charms > 0 ? (
            <View style={styles.slot}>
              <StatCard
                Icon={Trophy}
                value={String(charms)}
                label="CHARMS FOUND"
                valueColor={theme.colors.accent.gold}
              />
            </View>
          ) : null}
        </Animated.View>

        <Animated.View style={[styles.row, tile2]} pointerEvents="box-none">
          {NAV.map(item => (
            <View key={item.key} style={styles.slot}>
              <NavTile label={item.label} Icon={item.Icon} onPress={() => onNavigate(item.key)} />
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.row, tile3]} pointerEvents="box-none">
          <View style={styles.slot}>
            <FooterButton label="SETTINGS" Icon={Settings} onPress={() => onNavigate('settings')} />
          </View>
          <View style={styles.slot}>
            <FooterButton label="ABOUT" Icon={Info} onPress={() => onNavigate('about')} />
          </View>
        </Animated.View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  bulbs: { position: 'absolute', top: 6, left: 16, right: 16 },

  agePill: {
    marginTop: 4,
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247,209,84,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(247,209,84,0.40)',
  },
  agePillText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, color: theme.colors.accent.gold },

  grid: { flex: 1, padding: 16, gap: 12, justifyContent: 'center' },
  row: { flexDirection: 'row', gap: 10 },
  slot: { flex: 1 },

  playPress: { width: '100%', height: 164 },
  playFill: { width: '100%', height: 164 },
  playTile: {
    width: '100%',
    height: 164,
    borderRadius: theme.radius.tile,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 18,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    ...theme.shadows.grass,
  },
  playHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  playSprite: { position: 'absolute', left: 18, top: 18, width: 56, height: 56, resizeMode: 'contain' },
  playText: { gap: 8 },
  playCaption: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: 'rgba(11,36,22,0.70)' },
  playCta: { fontSize: 30, fontWeight: '900', letterSpacing: 2, color: theme.colors.text.onGrass },

  navPress: { width: '100%', height: 92 },
  navTile: {
    width: '100%',
    height: 92,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.ui.ghost,
    borderWidth: 1,
    borderColor: theme.colors.ui.ghostBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: theme.colors.text.primary },

  footPress: { width: '100%', height: 48 },
  footBtn: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.button,
    backgroundColor: 'rgba(242,251,234,0.05)',
    borderWidth: 1,
    borderColor: theme.colors.ui.ghostBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  footLabel: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
});

export default MenuScreen;
