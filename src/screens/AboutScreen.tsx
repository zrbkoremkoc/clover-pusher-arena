import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import AppShell from '../components/AppShell';
import ClayCard from '../components/ClayCard';
import GhostButton from '../components/GhostButton';
import IconButton from '../components/IconButton';
import ScreenHeader from '../components/ScreenHeader';

const STATEMENT =
  'CloverPusherArena is an entertainment-only arcade for adults aged 18 and over. ' +
  'All coins, tokens and charms are virtual. There is no real money, no betting, ' +
  'no purchasing, no exchange and no cash-out of any kind. Practice or success in ' +
  'this game does not imply future success at real-money gambling.';

type Props = { onBack: () => void };

export function AboutScreen({ onBack }: Props) {
  return (
    <AppShell gradient={theme.gradients.sub}>
      <ScreenHeader
        title="ABOUT ARENA"
        subtitle="VERSION 1.0.0"
        leftSlot={<IconButton label="Back" Icon={ArrowLeft} onPress={onBack} />}
      />

      <View style={styles.body}>
        <View style={styles.badge}>
          <View pointerEvents="none" style={styles.highlight} />
          <Image source={assets.logo} style={styles.logo} />
        </View>

        <Text style={styles.name}>CLOVER PUSHER ARENA</Text>
        <Text style={styles.meta}>com.cloverpusher.arena · 1.0.0</Text>

        <ClayCard style={styles.card}>
          <Text style={styles.statement}>{STATEMENT}</Text>
        </ClayCard>

        <Text style={styles.credits}>DESIGN AND CODE · CLOVER ARENA STUDIO</Text>

        <GhostButton label="BACK TO LOBBY" onPress={onBack} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 12 },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 2,
    borderColor: 'rgba(247,209,84,0.35)',
    alignItems: 'center',
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
  logo: { width: 68, height: 68, resizeMode: 'contain' },
  name: { fontSize: 20, fontWeight: '900', letterSpacing: 1.5, color: theme.colors.text.primary },
  meta: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: theme.colors.text.muted },
  card: { width: '100%', padding: 18 },
  statement: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  credits: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
});

export default AboutScreen;
