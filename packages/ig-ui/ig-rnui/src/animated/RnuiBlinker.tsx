
import React, { type FC } from 'react';
import { Animated, Easing, StyleSheet, type ColorValue } from 'react-native';

export type RnuiBlinkerPropsT = {
  color: ColorValue,
  durationMs: number,
  testID?: string,
};

export const RnuiBlinker: FC<RnuiBlinkerPropsT> = ({ color, durationMs }) => {
  // Blinking animation
  const blinkAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: durationMs,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: durationMs,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blinkAnim]);

  return (
    <Animated.View
      testID="blinker-circle"
      style={[
        styles.statusCircle,
        { backgroundColor: color, opacity: blinkAnim },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
});
