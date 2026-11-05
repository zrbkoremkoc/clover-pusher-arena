import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ArrowLeft,
  Clock,
  Coins,
  Dices,
  Gift,
  Scale,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import AppShell from '../components/AppShell';
import Chip from '../components/Chip';
import IconButton from '../components/IconButton';
import InfoRow from '../components/InfoRow';
import ScreenHeader from '../components/ScreenHeader';

type Row = { key: string; Icon: LucideIcon; title: string; body: string; tint: string };

const GOLD = theme.colors.accent.gold;
const GRASS = theme.colors.accent.grass;
const TEXT = theme.colors.text.primary;

const REWARDS: Row[] = [
  {
    key: 'lip',
    Icon: Coins,
    title: 'COIN OVER THE LIP',
    body: '1 to 3 virtual coins, every single time.',
    tint: GOLD,
  },
  {
    key: 'slot',
    Icon: Sparkles,
    title: 'GOLDEN CLOVER IN SLOT',
    body: 'Opens the free Clover Spin bonus window.',
    tint: GRASS,
  },
  {
    key: 'three',
    Icon: Gift,
    title: 'THREE MATCHING REELS',
    body: 'Coin shower of 40 to 80 virtual coins.',
    tint: GOLD,
  },
  {
    key: 'charm',
    Icon: Trophy,
    title: 'CHARM TOKEN',
    body: 'Fills an album page. Cosmetic, worth no coins.',
    tint: TEXT,
  },
  {
    key: 'refill',
    Icon: Clock,
    title: 'FREE REFILL',
    body: 'Plus 10 tray coins every 5 minutes, always free.',
    tint: GRASS,
  },
];

const FAIRPLAY: Row[] = [
  {
    key: 'shelf',
    Icon: Timer,
    title: 'THE SHELF IS FIXED',
    body: 'A sine loop of the same speed and travel every round.',
    tint: GRASS,
  },
  {
    key: 'sim',
    Icon: Scale,
    title: 'LANDING IS SIMULATED',
    body: 'A 2D physics step with a seeded nudge of plus or minus 2px.',
    tint: GOLD,
  },
  {
    key: 'reels',
    Icon: Dices,
    title: 'REELS ARE UNIFORM',
    body: 'Every reel draws from the same shared symbol strip.',
    tint: TEXT,
  },
  {
    key: 'nolink',
    Icon: ShieldCheck,
    title: 'NOTHING IS LINKED',
    body: 'No outcome depends on balance, charms or time played.',
    tint: GRASS,
  },
  {
    key: 'noexchange',
    Icon: Coins,
    title: 'NOTHING IS EXCHANGED',
    body: 'No purchase, no cash-out, no transfer of any kind.',
    tint: GOLD,
  },
];

type Props = { onBack: () => void };

/** Payout Guide and Fair Play Notes, two chips over one fixed list. */
export function GuideScreen({ onBack }: Props) {
  const [tab, setTab] = useState<'rewards' | 'fair'>('rewards');
  const rows = tab === 'rewards' ? REWARDS : FAIRPLAY;

  return (
    <AppShell gradient={theme.gradients.sub}>
      <ScreenHeader
        title="PAYOUT GUIDE"
        subtitle="VIRTUAL COINS ONLY"
        leftSlot={<IconButton label="Back" Icon={ArrowLeft} onPress={onBack} />}
      />

      <View style={styles.body}>
        <View style={styles.chips}>
          <Chip label="REWARDS" active={tab === 'rewards'} onPress={() => setTab('rewards')} />
          <Chip label="FAIR PLAY" active={tab === 'fair'} onPress={() => setTab('fair')} />
        </View>

        <View style={styles.list}>
          {rows.map(r => (
            <InfoRow key={r.key} Icon={r.Icon} title={r.title} body={r.body} tint={r.tint} />
          ))}
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 16, gap: 12 },
  chips: { flexDirection: 'row', gap: 10 },
  list: { flex: 1, gap: 8, justifyContent: 'center' },
});

export default GuideScreen;
