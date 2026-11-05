import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Coffee } from 'lucide-react-native';
import { SESSION_REMINDER_MIN } from '../constants/config';
import theme from '../constants/theme';
import GhostButton from './GhostButton';
import PrimaryButton from './PrimaryButton';

const SCREEN_W = Dimensions.get('window').width;

type Props = {
  visible: boolean;
  minutes: number;
  onContinue: () => void;
  onLobby: () => void;
};

/** Responsible-play break prompt. Not dismissible by tapping the scrim. */
export function BreakReminderModal({ visible, minutes, onContinue, onLobby }: Props) {
  if (!visible) {
    return null;
  }
  const mins = minutes > 0 ? minutes : SESSION_REMINDER_MIN;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.scrim} pointerEvents="none" />
      <View style={styles.center} pointerEvents="box-none">
        <View style={[styles.card, { width: SCREEN_W - 64 }]}>
          <View pointerEvents="none" style={styles.highlight} />
          <View style={styles.iconWrap}>
            <Coffee size={36} color={theme.colors.accent.gold} strokeWidth={2.2} />
          </View>
          <Text style={styles.title}>TAKE A BREAK</Text>
          <Text style={styles.body}>
            {'You have been playing for ' + mins + ' minutes. A short break is a good idea.'}
          </Text>
          <PrimaryButton label="KEEP PLAYING" onPress={onContinue} />
          <GhostButton label="BACK TO LOBBY" onPress={onLobby} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.ui.scrim },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    borderRadius: 28,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 2,
    borderColor: theme.colors.accent.gold,
    padding: 22,
    alignItems: 'center',
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
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247,209,84,0.12)',
  },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 1.5, color: theme.colors.text.primary },
  body: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
});

export default BreakReminderModal;
