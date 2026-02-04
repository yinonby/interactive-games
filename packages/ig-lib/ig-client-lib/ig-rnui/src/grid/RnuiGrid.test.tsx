
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { Animated } from 'react-native';
import type { RnuiDimensionsT } from '../theme/RnuiDimensionsProvider';
import * as RnuiDimensionsProvider from '../theme/RnuiDimensionsProvider';
import { RnuiGrid } from './RnuiGrid';
import { RnuiGridItem } from './RnuiGridItem';
import { mdWidth } from './RnuiGridUtils';

jest.spyOn(Animated, 'timing').mockImplementation(
  ((value: Animated.Value | Animated.ValueXY, config: Animated.TimingAnimationConfig) => {
    return {
      start: (callback?: Animated.EndCallback) => {
        (value as Animated.Value).setValue(config.toValue as number);
        callback?.({ finished: true });
      },
    } as Animated.CompositeAnimation;
  })
);

describe('RnuiGrid', () => {
  const useRnuiDimensionsSpy = jest.spyOn(RnuiDimensionsProvider, 'useRnuiDimensions');
  beforeAll(() => {
    useRnuiDimensionsSpy.mockReturnValue({
      width: mdWidth,
    } as RnuiDimensionsT);
  });

  test('renders with default breakpoint', async () => {
    const children = [
      <RnuiGridItem key='x' testID='x-grid-item-tid' />,
      <RnuiGridItem key='y' testID='y-grid-item-tid' />,
      <RnuiGridItem key='z' testID='z-grid-item-tid' />,
    ];

    const { getAllByTestId } = render(
      <RnuiGrid >{children}</RnuiGrid>
    );

    // verify positions
    const gridRows = getAllByTestId('grid-row-tid');
    expect(gridRows.length).toBe(3);
  });

  test('renders with given breakpoint', async () => {
    const children = [
      <RnuiGridItem key='x' md={6} testID='x-grid-item-tid' />,
      <RnuiGridItem key='y' md={6} testID='y-grid-item-tid' />,
      <RnuiGridItem key='z' md={6} testID='z-grid-item-tid' />,
    ];

    const { getAllByTestId } = render(
      <RnuiGrid >{children}</RnuiGrid>
    );

    // verify positions
    const gridRows = getAllByTestId('grid-row-tid');
    expect(gridRows.length).toBe(2);
  });

  test('renders grid items in columns', async () => {
    const children = [
      <RnuiGridItem key='x' md={6} testID='x-grid-item-tid' />,
      <RnuiGridItem key='y' md={6} testID='y-grid-item-tid' />,
      <RnuiGridItem key='z' md={6} testID='z-grid-item-tid' />,
    ];

    const { getAllByTestId } = render(
      <RnuiGrid spacing={12} >{children}</RnuiGrid>
    );

    // verify positions
    const gridRows = getAllByTestId('grid-row-tid');
    expect(gridRows.length).toBe(2);
  });

  test('does not excced columns', async () => {
    const children = [
      <RnuiGridItem key='x' md={6} testID='x-grid-item-tid' />,
      <RnuiGridItem key='y' md={7} testID='y-grid-item-tid' />,
    ];

    const { getAllByTestId } = render(
      <RnuiGrid spacing={12} >{children}</RnuiGrid>
    );

    // verify positions
    const gridRows = getAllByTestId('grid-row-tid');
    expect(gridRows.length).toBe(2);
  });

  test('does not render invalid elements', async () => {
    const children = [
      <RnuiGridItem key='x' md={6} testID='x-grid-item-tid' />,
      'Hello' as unknown as ReactElement,
      <RnuiGridItem key='z' md={6} testID='z-grid-item-tid' />,
    ];

    const { getAllByTestId } = render(
      <RnuiGrid >{children}</RnuiGrid>
    );

    // verify positions
    const gridRows = getAllByTestId('grid-row-tid');
    expect(gridRows.length).toBe(1);
  });

  test('auto-generates key', async () => {
    const children = [
      <RnuiGridItem key='x' md={6} testID='x-grid-item-tid' />,
      // eslint-disable-next-line react/jsx-key
      <RnuiGridItem md={6} testID='z-grid-item-tid' />,
    ];

    const { getAllByTestId } = render(
      <RnuiGrid >{children}</RnuiGrid>
    );

    // verify positions
    const gridRows = getAllByTestId('grid-row-tid');
    expect(gridRows.length).toBe(1);
  });
});
