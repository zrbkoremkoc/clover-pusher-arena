import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import theme from '../constants/theme';
import { CABINETS, isUnlocked, unlockLabel } from '../game/unlocks';
import AppShell from '../components/AppShell';
import CabinetCard from '../components/CabinetCard';
import IconButton from '../components/IconButton';
import ScreenHeader from '../components/ScreenHeader';

type Props = {
  rounds: number;
  activeId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
};

/** Cabinet Row — skins unlock by playing. Nothing here is for sale. */
export function CabinetsScreen({ rounds, activeId, onSelect, onBack }: Props) {
  return (
    <AppShell gradient={theme.gradients.sub}>
      <ScreenHeader
        title="CABINET ROW"
        subtitle={'ROUNDS PLAYED ' + rounds}
        leftSlot={<IconButton label="Back" Icon={ArrowLeft} onPress={onBack} />}
      />

      <View style={styles.body}>
        {CABINETS.map(cab => {
          const unlocked = isUnlocked(cab, rounds);
          return (
            <CabinetCard
              key={cab.id}
              name={cab.name}
              tagline={cab.tagline}
              unlocked={unlocked}
              active={unlocked && cab.id === activeId}
              requirement={unlockLabel(cab)}
              emblem={cab.emblem}
              onPress={() => onSelect(cab.id)}
            />
          );
        })}

        <Text style={styles.note}>CABINETS ARE COSMETIC · THEY ARE NEVER PURCHASED</Text>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 16, gap: 12, justifyContent: 'center' },
  note: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
});

export default CabinetsScreen;
