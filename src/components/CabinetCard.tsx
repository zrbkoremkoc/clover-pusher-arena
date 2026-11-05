import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  name: string;
  tagline: string;
  unlocked: boolean;
  active: boolean;
  requirement: string;
  emblem: number;
  onPress: () => void;
};

export function CabinetCard({ name, tagline, unlocked, active, requirement, emblem, onPress }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityState={{ disabled: !unlocked, selected: active }}
      hitSlop={HIT}
      disabled={!unlocked}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          active ? styles.active : null,
          unlocked ? null : styles.locked,
          { transform: [{ scale }] },
        ]}>
        <View pointerEvents="none" style={styles.highlight} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.tagline} numberOfLines={1}>
          {unlocked ? tagline : requirement}
        </Text>

        {active ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>IN USE</Text>
          </View>
        ) : null}

        {unlocked ? null : (
          <View style={styles.lockBadge}>
            <Lock size={16} color={theme.colors.text.secondary} strokeWidth={2.4} />
          </View>
        )}

        <Image source={emblem} style={styles.emblem} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 120 },
  card: {
    width: '100%',
    height: 120,
    borderRadius: theme.radius.card,
    backgroundColor: 'rgba(30,77,51,0.92)',
    borderWidth: 2,
    borderColor: 'rgba(123,201,80,0.28)',
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
    ...theme.shadows.clay,
  },
  active: { borderColor: theme.colors.accent.gold },
  locked: { opacity: 0.45 },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.ui.highlight,
  },
  name: { fontSize: 20, fontWeight: '900', letterSpacing: 1.5, color: theme.colors.text.primary },
  tagline: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
    maxWidth: '70%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247,209,84,0.16)',
    borderWidth: 1,
    borderColor: theme.colors.accent.gold,
  },
  badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 1, color: theme.colors.accent.gold },
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242,251,234,0.08)',
  },
  // Positive offsets only — a negative inset would make the sprite poke out
  // past the rounded corner.
  emblem: { position: 'absolute', right: 12, bottom: 12, width: 56, height: 56, resizeMode: 'contain' },
});

export default React.memo(CabinetCard);
