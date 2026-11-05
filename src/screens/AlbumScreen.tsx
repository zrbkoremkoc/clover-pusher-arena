import React, { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import assets from '../assets';
import { ALBUM_SLOTS_PER_PAGE, BOARD_MAX_W } from '../constants/config';
import theme from '../constants/theme';
import AppShell from '../components/AppShell';
import CharmSlot from '../components/CharmSlot';
import Chip from '../components/Chip';
import IconButton from '../components/IconButton';
import ScreenHeader from '../components/ScreenHeader';

const SCREEN_W = Dimensions.get('window').width;
const GRID_W = Math.min(SCREEN_W - 32, BOARD_MAX_W);
const FRAME = 8;
const GAP = 10;
const TILE = Math.floor((GRID_W - 2 * FRAME - 2 * GAP) / 3);

const PAGES = [
  {
    key: 'meadow',
    label: 'MEADOW PAGE',
    names: ['LADYBIRD', 'HONEYBEE', 'LADYBIRD', 'HONEYBEE', 'LADYBIRD', 'HONEYBEE'],
  },
  {
    key: 'fair',
    label: 'FAIR PAGE',
    names: ['HONEYBEE', 'LADYBIRD', 'HONEYBEE', 'LADYBIRD', 'HONEYBEE', 'LADYBIRD'],
  },
];

type Props = { charms: number; onBack: () => void };

/** Charm Album — purely cosmetic keepsakes, no coin value. */
export function AlbumScreen({ charms, onBack }: Props) {
  const [page, setPage] = useState(0);

  const slots = useMemo(() => {
    const def = PAGES[page];
    return def.names.map((name, i) => {
      const globalIndex = page * ALBUM_SLOTS_PER_PAGE + i;
      return {
        key: def.key + i,
        name,
        found: globalIndex < charms,
        sprite: name === 'LADYBIRD' ? assets.sprite3 : assets.sprite4,
      };
    });
  }, [charms, page]);

  return (
    <AppShell gradient={theme.gradients.sub}>
      <ScreenHeader
        title="CHARM ALBUM"
        subtitle={charms + ' FOUND'}
        leftSlot={<IconButton label="Back" Icon={ArrowLeft} onPress={onBack} />}
      />

      <View style={styles.body}>
        <View style={styles.chips}>
          {PAGES.map((p, i) => (
            <Chip key={p.key} label={p.label} active={i === page} onPress={() => setPage(i)} />
          ))}
        </View>

        <View style={[styles.grid, { width: GRID_W - 2 * FRAME }]}>
          {slots.map(s => (
            <CharmSlot key={s.key} found={s.found} sprite={s.sprite} size={TILE} name={s.name} />
          ))}
        </View>

        <Text style={styles.note}>CHARMS ARE COSMETIC ONLY</Text>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 18 },
  chips: { flexDirection: 'row', gap: 10, width: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, justifyContent: 'center' },
  note: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: theme.colors.text.secondary },
});

export default AlbumScreen;
