import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

type Props = {
  gradient: readonly string[];
  children: React.ReactNode;
  decor?: React.ReactNode;
};

/**
 * Every screen sits on the same background photograph and is told apart by its
 * gradient overlay — Loader is near-opaque dark, Menu is light and green.
 */
export function AppShell({ gradient, children, decor }: Props) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={gradient as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {decor ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {decor}
          </View>
        ) : null}
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.deep },
  bg: { flex: 1 },
  content: { flex: 1 },
});

export default AppShell;
