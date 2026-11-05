import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Tone = 'surface' | 'raised' | 'ghost' | 'gold';

type Props = {
  children?: React.ReactNode;
  tone?: Tone;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  highlight?: boolean;
};

const TONES: Record<Tone, { backgroundColor: string; borderColor: string }> = {
  surface: { backgroundColor: 'rgba(30,77,51,0.92)', borderColor: 'rgba(123,201,80,0.28)' },
  raised: { backgroundColor: theme.colors.bg.raised, borderColor: 'rgba(247,209,84,0.30)' },
  ghost: { backgroundColor: theme.colors.ui.ghost, borderColor: theme.colors.ui.ghostBorder },
  gold: { backgroundColor: 'rgba(247,209,84,0.12)', borderColor: theme.colors.accent.gold },
};

/**
 * The claymorphic surface: puffy fill, 2px border, soft outer shadow and a
 * 2px inner top highlight that sells the inflated look.
 */
export function ClayCard({ children, tone = 'surface', radius = theme.radius.card, style, highlight = true }: Props) {
  const palette = TONES[tone];
  return (
    <View
      style={[
        styles.base,
        theme.shadows.clay,
        { borderRadius: radius, backgroundColor: palette.backgroundColor, borderColor: palette.borderColor },
        style,
      ]}>
      {highlight ? (
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            { borderTopLeftRadius: radius, borderTopRightRadius: radius },
          ]}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 2, overflow: 'hidden' },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.ui.highlight,
  },
});

export default ClayCard;
