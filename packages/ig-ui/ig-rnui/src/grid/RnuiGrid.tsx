
import React, { FC, ReactNode, useEffect, useRef, type PropsWithChildren, type ReactElement } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { useRnuiDimensions } from "../theme/RnuiDimensionsProvider";
import { RnuiGridItemPropsT } from "./RnuiGridItem";
import { getBreakpoint, TOTAL_GRID_COLUMNS } from "./RnuiGridUtils";

type AnimatedGridCellProps = {
  children: ReactNode;
  style?: ViewStyle;
};

const AnimatedGridCell: FC<AnimatedGridCellProps> = ({ children, style }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

type RnuiGridProps = {
  spacing?: number;
};

export const RnuiGrid: FC<PropsWithChildren<RnuiGridProps>> = ({
  spacing = 8,
  children,
}) => {
  const { width } = useRnuiDimensions();
  const breakpoint = getBreakpoint(width);

  const rows: ReactElement[][] = [];
  let currentRow: ReactElement[] = [];
  let currentWidth = 0;

  const pushRow = () => {
    if (currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }
  };

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<RnuiGridItemPropsT>(child)) return;

    const colSpan =
      child.props[breakpoint] ??
      child.props.md ??
      child.props.sm ??
      child.props.xs ??
      TOTAL_GRID_COLUMNS;

    if (currentWidth + colSpan > TOTAL_GRID_COLUMNS) {
      pushRow();
    }

    const childKey = child.key ?? `${rows.length}-${currentRow.length}`;

    currentRow.push(
      <AnimatedGridCell
        key={childKey}
        style={{
          flexBasis: `${(colSpan / 12) * 100}%`,
          padding: spacing / 2,
        }}
      >
        {child}
      </AnimatedGridCell>
    );

    currentWidth += colSpan;

    if (currentWidth === TOTAL_GRID_COLUMNS) {
      pushRow();
    }
  });

  pushRow();

  return (
    <View style={[styles.container, { margin: -spacing / 2 }]}>
      {rows.map((row, index) => (
        <View testID="grid-row-tid" key={`row-${index}`} style={styles.row}>
          {row}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    width: "100%",
  },
});
