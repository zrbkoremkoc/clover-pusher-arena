import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowLeft, Eye, Timer, Vibrate, Volume2 } from 'lucide-react-native';
import type { AppSettings, HapticStrength } from '../constants/config';
import theme from '../constants/theme';
import AppShell from '../components/AppShell';
import ChipRow from '../components/ChipRow';
import ConfirmModal from '../components/ConfirmModal';
import GhostButton from '../components/GhostButton';
import IconButton from '../components/IconButton';
import ScreenHeader from '../components/ScreenHeader';
import ToggleRow from '../components/ToggleRow';

const HAPTIC_OPTIONS = [
  { label: 'OFF', value: 'off' },
  { label: 'SOFT', value: 'soft' },
  { label: 'STRONG', value: 'strong' },
];

const REMINDER_OPTIONS = [
  { label: '15 MIN', value: '15' },
  { label: '30 MIN', value: '30' },
  { label: '60 MIN', value: '60' },
  { label: 'OFF', value: '0' },
];

type Props = {
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
  onResetBalance: () => void;
  onBack: () => void;
};

export function SettingsScreen({ settings, onChange, onResetBalance, onBack }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <AppShell gradient={theme.gradients.sub}>
      <ScreenHeader
        title="LOBBY SETTINGS"
        subtitle="ENTERTAINMENT ONLY · 18+"
        leftSlot={<IconButton label="Back" Icon={ArrowLeft} onPress={onBack} />}
      />

      <View style={styles.body}>
        <ToggleRow
          Icon={Volume2}
          label="SOUND"
          value={settings.sound}
          onChange={v => onChange({ ...settings, sound: v })}
        />

        <ChipRow
          Icon={Vibrate}
          label="HAPTIC STRENGTH"
          options={HAPTIC_OPTIONS}
          value={settings.haptic}
          onChange={v => onChange({ ...settings, haptic: v as HapticStrength })}
        />

        <ToggleRow
          Icon={Eye}
          label="REDUCED MOTION"
          value={settings.reducedMotion}
          onChange={v => onChange({ ...settings, reducedMotion: v })}
        />

        <ChipRow
          Icon={Timer}
          label="SESSION REMINDER"
          options={REMINDER_OPTIONS}
          value={String(settings.reminderMinutes)}
          onChange={v => onChange({ ...settings, reminderMinutes: Number(v) })}
        />

        <GhostButton
          label="RESET VIRTUAL BALANCE"
          tone="danger"
          height={56}
          onPress={() => setConfirming(true)}
        />
      </View>

      <ConfirmModal
        visible={confirming}
        title="RESET BALANCE"
        body="This restores the starting 1,250 virtual coins and empties the charm album. Nothing real is affected."
        confirmLabel="RESET"
        onConfirm={() => {
          setConfirming(false);
          onResetBalance();
        }}
        onCancel={() => setConfirming(false)}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 16, gap: 10, justifyContent: 'center' },
});

export default SettingsScreen;
