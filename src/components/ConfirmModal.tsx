import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import GhostButton from './GhostButton';

const SCREEN_W = Dimensions.get('window').width;

type Props = {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({ visible, title, body, confirmLabel, onConfirm, onCancel }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.scrim} pointerEvents="none" />
      <View style={styles.center} pointerEvents="box-none">
        <View style={[styles.card, { width: SCREEN_W - 64 }]}>
          <View pointerEvents="none" style={styles.highlight} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <GhostButton label={confirmLabel} onPress={onConfirm} tone="danger" height={56} />
          <GhostButton label="CANCEL" onPress={onCancel} />
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
    borderColor: 'rgba(123,201,80,0.32)',
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
  title: { fontSize: 20, fontWeight: '900', letterSpacing: 1.4, color: theme.colors.text.primary },
  body: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
});

export default ConfirmModal;
