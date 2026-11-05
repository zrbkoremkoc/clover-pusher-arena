import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import theme from '../constants/theme';

/**
 * Press feedback for claymorphic buttons.
 *
 * The Pressable is always the PARENT and the Animated.View the child — an
 * Animated.View wrapping a Pressable swallows onPress on Android release.
 */
export function usePressScale(target = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: target,
      useNativeDriver: true,
      ...theme.animation.press,
    }).start();
  }, [scale, target]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...theme.animation.press,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
