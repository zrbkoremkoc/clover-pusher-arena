import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  found: boolean;
  sprite: number;
  size: number;
  name: string;
};

export function CharmSlot({ found, sprite, size, name }: Props) {
  return (
    <View style={[styles.tile, { width: size, height: size }, found ? styles.found : styles.empty]}>
      {found ? (
        <>
          <View pointerEvents="none" style={styles.highlight} />
          <Image source={sprite} style={styles.sprite} />
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
        </>
      ) : (
        <Text style={styles.unknown}>?</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  found: {
    backgroundColor: 'rgba(30,77,51,0.92)',
    borderWidth: 2,
    borderColor: theme.colors.ui.goldLine,
    ...theme.shadows.clay,
  },
  empty: {
    backgroundColor: 'rgba(242,251,234,0.04)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(242,251,234,0.18)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.ui.highlight,
  },
  sprite: { width: 56, height: 56, resizeMode: 'contain' },
  name: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8, color: theme.colors.text.secondary },
  unknown: { fontSize: 24, fontWeight: '900', color: 'rgba(242,251,234,0.24)' },
});

export default React.memo(CharmSlot);
