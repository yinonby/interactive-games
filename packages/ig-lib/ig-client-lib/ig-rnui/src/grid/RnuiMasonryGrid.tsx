import {
    FC,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import { RnuiGridItemPropsT } from './RnuiGridItem';
import { getBreakpoint, TOTAL_GRID_COLUMNS } from './RnuiGridUtils';

type PositionedItem = {
  key: string;
  left: number;
  top: number;
  width: number;
  height: number;
  colSpan: number;
  element: ReactElement<RnuiGridItemPropsT>;
};

export type RnuiMasonryGridPropsT = {
  spacing?: number;
  itemFadeInDurationMsOptions?: [number, ...number[]];
  children: ReactElement<RnuiGridItemPropsT>[];
  testID?: string;
};

export const RnuiMasonryGrid: FC<RnuiMasonryGridPropsT> = ({
  spacing = 8,
  itemFadeInDurationMsOptions = [250],
  children,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const breakpoint = getBreakpoint(screenWidth);

  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});
  const [positions, setPositions] = useState<PositionedItem[]>([]);

  // Animation values (persist across renders)
  const fadingOpacityAnimation = useRef<Record<string, Animated.Value>>({}).current;
  const animatedOnce = useRef<Set<string>>(new Set()).current;

  const getChildKey = (child: ReactElement) => {
    if (child.key == null) {
      throw new Error("[RnuiMasonryGrid] All children must have a unique `key`.");
    }
    return String(child.key);
  };

  const getColSpan = (props: RnuiGridItemPropsT) =>
    props[breakpoint] ?? props.md ?? props.sm ?? props.xs ?? TOTAL_GRID_COLUMNS;

  const onMeasure = (key: string, e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    setMeasuredHeights((prev) =>
      prev[key] === height ? prev : { ...prev, [key]: height }
    );
  };

  // Track children identity changes WITHOUT resetting animations
  useEffect(() => {
    const newKeys = children.map(getChildKey);

    // Prune removed items
    Object.keys(fadingOpacityAnimation).forEach((prevKey) => {
      if (!newKeys.includes(prevKey)) {
        delete fadingOpacityAnimation[prevKey];
        animatedOnce.delete(prevKey);
      }
    });

    setMeasuredHeights((prev) => {
      const next: Record<string, number> = {};
      newKeys.forEach((newKey) => {
        if (prev[newKey] != null) next[newKey] = prev[newKey];
      });
      return next;
    });
  }, [children]);

  // Compute positions
  useEffect(() => {
    // no updated if measuredHeights is still not updated to latest children
    if (Object.keys(measuredHeights).length !== children.length) return;

    const columnHeights = Array(TOTAL_GRID_COLUMNS).fill(0);
    const newPositions: PositionedItem[] = [];


    children.forEach((child) => {
      const key = getChildKey(child);
      const height = measuredHeights[key];
      const colSpan = getColSpan(child.props);

      let startCol = 0;
      let minTop = Infinity;

      for (let i = 0; i <= TOTAL_GRID_COLUMNS - colSpan; i++) {
        const sliceTop = Math.max(
          ...columnHeights.slice(i, i + colSpan)
        );
        if (sliceTop < minTop) {
          minTop = sliceTop;
          startCol = i;
        }
      }

      const left = (startCol / TOTAL_GRID_COLUMNS) * 100;
      const top = minTop;
      const width = (colSpan / TOTAL_GRID_COLUMNS) * 100;

      for (let i = startCol; i < startCol + colSpan; i++) {
        columnHeights[i] = top + height + spacing;
      }

      if (!fadingOpacityAnimation[key]) {
        fadingOpacityAnimation[key] = new Animated.Value(0);
      }

      newPositions.push({
        key,
        left,
        top,
        width,
        height,
        colSpan,
        element: child,
      });
    });

    setPositions(newPositions);
  }, [measuredHeights, children, breakpoint, spacing]);

  // Sequential fade-in animation
  useEffect(() => {
    if (!positions.length) return;

    // no updated if measuredHeights is still not updated to latest children
    if (Object.keys(measuredHeights).length !== children.length) return;

    let index = 0;

    const animateNext = () => {
      if (index >= positions.length) return;

      if (animatedOnce.has(index.toString())) {
        index++;
        animateNext();
        return;
      };

      animatedOnce.add(index.toString());

      const key = positions[index].key;
      const itemFadeInDurationMs = index >= itemFadeInDurationMsOptions.length ? itemFadeInDurationMsOptions.at(-1) :
        itemFadeInDurationMsOptions[index];

      Animated.timing(fadingOpacityAnimation[key], {
        toValue: 1,
        duration: itemFadeInDurationMs,
        useNativeDriver: true,
      }).start(() => {
        index++;
        animateNext();
      });
    };

    animateNext();
  }, [positions, itemFadeInDurationMsOptions, fadingOpacityAnimation]);

  return (
    <View style={styles.container}>
      {/* Measurement layer */}
      {children.map((child) => {
        const key = getChildKey(child);
        return (
          <View
            testID="measurement-view-tid"
            key={key}
            style={{ position: "absolute", opacity: 0 }}
            onLayout={(e) => onMeasure(key, e)}
          >
            {child}
          </View>
        );
      })}

      {/* Masonry layer */}
      <View style={{ margin: -spacing / 2 }}>
        {positions.map((item) => (
          <Animated.View
            testID="animated-view-tid"
            key={item.key}
            style={{
              position: "absolute",
              top: item.top,
              left: `${item.left}%`,
              width: `${item.width}%`,
              padding: spacing / 2,
              opacity: fadingOpacityAnimation[item.key] ?? 1,
            }}
          >
            {item.element}
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
});
