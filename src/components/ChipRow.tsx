import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import Chip from './Chip';

type Option = { label: string; value: string };

type Props = {
  Icon: LucideIcon;
  label: string;
  options: Option[];
  value: string;
  onChange: (next: string) => void;
};

export function ChipRow({ Icon, label, options, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <View style={styles.iconWrap}>
          <Icon size={20} color={theme.colors.accent.gold} strokeWidth={2.4} />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={styles.chips}>
        {options.map(opt => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={opt.value === value}
            onPress={() => onChange(opt.value)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.ui.ghost,
    borderWidth: 1,
    borderColor: theme.colors.ui.ghostBorder,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247,209,84,0.12)',
  },
  label: { flex: 1, fontSize: 12, fontWeight: '800', letterSpacing: 1, color: theme.colors.text.primary },
  chips: { flexDirection: 'row', gap: 8 },
});

export default ChipRow;
