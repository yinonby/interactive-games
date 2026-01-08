
import '@testing-library/jest-native/extend-expect';
import type { Animated } from 'react-native';

// mock libraries that contain ES modules (with export)

jest.mock('react-native/Libraries/Components/ScrollView/ScrollView', () => {
  const ActualView = jest.requireActual('react-native/Libraries/Components/View/View');

  return ActualView;
});

// avoid actual animations in tests

jest.mock('react-native/Libraries/Animated/Animated', () => {
  const ActualAnimated = jest.requireActual('react-native/Libraries/Animated/Animated');
  return {
    ...ActualAnimated,

    timing: (
      value: Animated.Value,
      config: Animated.TimingAnimationConfig
    ): Animated.CompositeAnimation => ({
      start: (callback?: Animated.EndCallback) => {
        value.setValue(config.toValue as number);
        callback?.({ finished: true });
      },
      stop: (): void => { },
      reset: (): void => { },
    }),

    loop: (
      animation: Animated.CompositeAnimation
    ): Animated.CompositeAnimation => ({
      start: (callback?: Animated.EndCallback) => {
        animation.start(() => callback?.({ finished: true }));
      },
      stop: (): void => { },
      reset: (): void => { },
    }),
  };
});
