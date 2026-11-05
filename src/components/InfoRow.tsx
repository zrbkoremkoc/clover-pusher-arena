import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';

type Props = {
  Icon: LucideIcon;
  title: string;
  body: string;
  tint: string;
};

export function InfoRow({ Icon, title, body, tint }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: tint + '1F' }]}>
        <Icon size={22} color={tint} strokeWidth={2.4} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.ui.ghost,
    borderWidth: 1,
    borderColor: theme.colors.ui.ghostBorder,
  },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 3 },
  title: { fontSize: 12, fontWeight: '900', letterSpacing: 1, color: theme.colors.text.primary },
  body: { fontSize: 11, fontWeight: '600', lineHeight: 15, color: theme.colors.text.secondary },
});

export default React.memo(InfoRow);
