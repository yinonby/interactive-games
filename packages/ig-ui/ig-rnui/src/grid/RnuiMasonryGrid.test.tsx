
import { act, render } from '@testing-library/react-native';
import type { ReactElement } from "react";
import * as ReactNative from 'react-native';
import { Animated, StyleSheet, View, type LayoutChangeEvent, type ScaledSize, type ViewProps } from "react-native";
import { RnuiGridItem } from "./RnuiGridItem";
import { mdWidth } from "./RnuiGridUtils";
import { RnuiMasonryGrid } from "./RnuiMasonryGrid";

jest.spyOn(ReactNative, 'useWindowDimensions').mockReturnValue({
  width: mdWidth,
} as ScaledSize);

jest.spyOn(Animated, "timing").mockImplementation(
  ((value: Animated.Value | Animated.ValueXY, config: Animated.TimingAnimationConfig) => {
    return {
      start: (callback?: Animated.EndCallback) => {
        (value as Animated.Value).setValue(config.toValue as number);
        callback?.({ finished: true });
      },
    } as Animated.CompositeAnimation;
  })
);

describe("RnuiMasonryGrid", () => {
  const triggerMeasurements = (measurmenetViews: ReactElement<ViewProps>[], heights: [number, ...number[]]) => {
    measurmenetViews.forEach((measurmenetView, index) => {
      const height = index >= heights.length ? heights.at(-1) : heights[index];
      measurmenetView.props.onLayout?.({ nativeEvent: { layout: { height } } } as LayoutChangeEvent)
    });
  };

  test("uses default spacing (8) resulting in padding = 4", async () => {
    const children = [<View key="a" />, <View key="b" />];

    const { getAllByTestId, findAllByTestId } = render(<RnuiMasonryGrid>{children}</RnuiMasonryGrid>);

    // simulate measuring children
    const measurmenetViews = getAllByTestId("measurement-view-tid");
    act(() => {
      triggerMeasurements(measurmenetViews, [40]);
    });

    // padding should be spacing / 2 => 8 / 2 = 4
    const animatedViews = await findAllByTestId("animated-view-tid");
    expect(animatedViews.length).toBe(children.length);
    animatedViews.forEach((animatedView) => {
      const animatedViewFinalStyle = StyleSheet.flatten(animatedView.props.style);
      expect(animatedViewFinalStyle.padding).toBe(4);
    });
  });

  test("respects provided spacing prop (12) resulting in padding = 6", async () => {
    const children = [<View key="x" />, <View key="y" />, <View key="z" />];

    const { getAllByTestId, findAllByTestId } = render(
      <RnuiMasonryGrid spacing={12}>{children}</RnuiMasonryGrid>
    );

    // simulate measuring children
    const measurmenetViews = getAllByTestId("measurement-view-tid");
    act(() => {
      triggerMeasurements(measurmenetViews, [60, 60, 60]);
    });

    // padding should be spacing / 2 => 12 / 2 = 6
    const animatedViews = await findAllByTestId("animated-view-tid");
    expect(animatedViews.length).toBe(children.length);
    animatedViews.forEach((animatedView) => {
      const animatedViewFinalStyle = StyleSheet.flatten(animatedView.props.style);
      expect(animatedViewFinalStyle.padding).toBe(6);
    });
  });

  test("repositions when height changes", async () => {
    const children = [
      <RnuiGridItem key="x" md={6} testID="x-grid-item-tid" />,
      <RnuiGridItem key="y" md={6} testID="y-grid-item-tid" />,
      <RnuiGridItem key="z" md={6} testID="z-grid-item-tid" />,
    ];

    const { getAllByTestId, findAllByTestId } = render(
      <RnuiMasonryGrid spacing={12}>{children}</RnuiMasonryGrid>
    );

    // simulate measuring children
    const measurmenetViews = getAllByTestId("measurement-view-tid");
    act(() => {
      triggerMeasurements(measurmenetViews, [60, 30, 20]);
    });

    // verify positions
    const animatedViews1 = await findAllByTestId("animated-view-tid");
    expect(animatedViews1.length).toBe(children.length);
    expect(animatedViews1[0].props.children.props.testID).toBe("x-grid-item-tid"); // key === "x"
    expect(animatedViews1[0].props.style.left).toBe("0%"); // key === "x"
    expect(animatedViews1[1].props.children.props.testID).toBe("y-grid-item-tid"); // key === "y"
    expect(animatedViews1[1].props.style.left).toBe("50%"); // key === "y"
    expect(animatedViews1[2].props.children.props.testID).toBe("z-grid-item-tid"); // key === "z"
    expect(animatedViews1[2].props.style.left).toBe("50%"); // key === "z"

    // simulate change in measurement
    const measurmenetViews2 = getAllByTestId("measurement-view-tid");
    act(() => {
      triggerMeasurements(measurmenetViews2, [20, 30, 20]);
    });

    // verify positions
    const animatedViews2 = await findAllByTestId("animated-view-tid");
    expect(animatedViews2.length).toBe(children.length);
    expect(animatedViews2[0].props.children.props.testID).toBe("x-grid-item-tid"); // key === "x"
    expect(animatedViews2[0].props.style.left).toBe("0%"); // key === "x"
    expect(animatedViews2[1].props.children.props.testID).toBe("y-grid-item-tid"); // key === "y"
    expect(animatedViews2[1].props.style.left).toBe("50%"); // key === "y"
    expect(animatedViews2[2].props.children.props.testID).toBe("z-grid-item-tid"); // key === "z"
    expect(animatedViews2[2].props.style.left).toBe("0%"); // key === "z"
  });

  test("repositions children change", async () => {
    const children = [
      <RnuiGridItem key="x" md={6} testID="x-grid-item-tid" />,
      <RnuiGridItem key="y" md={6} testID="y-grid-item-tid" />,
      <RnuiGridItem key="z" md={6} testID="z-grid-item-tid" />,
    ];

    const { getAllByTestId, findAllByTestId, rerender } = render(
      <RnuiMasonryGrid spacing={12}>{children}</RnuiMasonryGrid>
    );

    // simulate measuring children
    const measurmenetViews = getAllByTestId("measurement-view-tid");
    act(() => {
      triggerMeasurements(measurmenetViews, [60, 30, 20]);
    });

    // verify positions
    const animatedViews1 = await findAllByTestId("animated-view-tid");
    expect(animatedViews1.length).toBe(children.length);
    expect(animatedViews1[0].props.children.props.testID).toBe("x-grid-item-tid"); // key === "x"
    expect(animatedViews1[0].props.style.left).toBe("0%"); // key === "x"
    expect(animatedViews1[1].props.children.props.testID).toBe("y-grid-item-tid"); // key === "y"
    expect(animatedViews1[1].props.style.left).toBe("50%"); // key === "y"
    expect(animatedViews1[2].props.children.props.testID).toBe("z-grid-item-tid"); // key === "z"
    expect(animatedViews1[2].props.style.left).toBe("50%"); // key === "z"

    // rerender
    const children2 = [
      <RnuiGridItem key="x" md={12} testID="x-grid-item-tid" />,
      <RnuiGridItem key="z" md={12} testID="z-grid-item-tid" />,
    ];
    rerender(<RnuiMasonryGrid spacing={12}>{children2}</RnuiMasonryGrid>);

    // verify positions
    const animatedViews2 = await findAllByTestId("animated-view-tid");
    expect(animatedViews2.length).toBe(children2.length);
    expect(animatedViews2[0].props.children.props.testID).toBe("x-grid-item-tid"); // key === "x"
    expect(animatedViews2[0].props.style.left).toBe("0%"); // key === "x"
    expect(animatedViews2[1].props.children.props.testID).toBe("z-grid-item-tid"); // key === "z"
    expect(animatedViews2[1].props.style.left).toBe("0%"); // key === "z"
  });

  test("child has no key", async () => {
    // eslint-disable-next-line react/jsx-key
    const children = [<View key="x" />, <View />, <View key="z" />];

    expect(() => {
      render(<RnuiMasonryGrid spacing={12}>{children}</RnuiMasonryGrid>);
    }).toThrow("[RnuiMasonryGrid] All children must have a unique `key`.");
  });
});