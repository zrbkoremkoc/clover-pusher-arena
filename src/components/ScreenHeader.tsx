import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  align?: 'left' | 'center';
  bare?: boolean;
};

/**
 * The one header every screen uses — same bar, same paddingTop, different
 * slots. Inline per-screen headers drift in padding and badge styling.
 */
export function ScreenHeader({
  title,
  subtitle,
  badge,
  leftSlot,
  rightSlot,
  align = 'center',
  bare = false,
}: Props) {
  return (
    <View style={[styles.bar, bare ? styles.bare : null]}>
      {leftSlot ? <View style={styles.side}>{leftSlot}</View> : null}
      <View style={[styles.center, align === 'left' ? styles.centerLeft : null]}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {badge}
      </View>
      {rightSlot ? <View style={[styles.side, styles.sideRight]}>{rightSlot}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: 44,
    height: 116,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: theme.colors.ui.headerBar,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.hairline,
  },
  bare: { backgroundColor: 'transparent', borderBottomWidth: 0 },
  side: { minWidth: 48, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  centerLeft: { alignItems: 'flex-start' },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
});

export default ScreenHeader;
