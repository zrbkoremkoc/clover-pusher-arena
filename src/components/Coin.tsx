import React from 'react';
import { Animated, Image, StyleSheet } from 'react-native';
import assets from '../assets';
import type { CoinKind } from '../game/physics';
import type { CoinMotion } from '../hooks/usePusherPhysics';

const SOURCES: Record<CoinKind, number> = {
  clover: assets.sprite1,
  golden: assets.sprite2,
  charm: assets.sprite3,
};

type Props = {
  kind: CoinKind;
  size: number;
  motion: CoinMotion;
};

/**
 * A flat transparent PNG — no overflow:'hidden' wrapper, which would draw a
 * visible bubble around the sprite.
 */
export function Coin({ kind, size, motion }: Props) {
  const rotate = motion.rot.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.coin,
        {
          width: size,
          height: size,
          transform: [
            { translateX: motion.tx },
            { translateY: motion.ty },
            { rotate },
          ],
        },
      ]}>
      <Image source={SOURCES[kind]} style={{ width: size, height: size, resizeMode: 'contain' }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  coin: { position: 'absolute', left: 0, top: 0 },
});

export default React.memo(Coin);
