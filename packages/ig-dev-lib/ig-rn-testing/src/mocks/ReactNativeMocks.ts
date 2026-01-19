
import React from 'react';

export const initReactNativeMocks = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createFlatMock = (_React: any, _RN: any) =>  _React.forwardRef(<T,>(
    props: {
      data?: readonly T[];
      renderItem?: (info: { item: T; index: number }) => React.ReactElement | null;
      keyExtractor?: (item: T, index: number) => string;
      onContentSizeChange?: () => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.Ref<any>
  ) => {
    const {
      data = [],
      renderItem,
      keyExtractor,
      onContentSizeChange,
      ...restProps
    } = props;

    // Expose imperative methods on the ref
    _React.useImperativeHandle(ref, () => ({
      scrollToEnd: jest.fn(),
      scrollToIndex: jest.fn(),
    }));

    // Execute renderItem for coverage
    data.forEach((item, index) => {
      keyExtractor?.(item, index);
      renderItem?.({ item, index });
    });

    // Simulate content size change
    onContentSizeChange?.();

    // Return a View with all props forwarded
    return _React.createElement(_RN.View, { ...restProps, data, onContentSizeChange});
  });

  jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native'); // import the real module
    const React = jest.requireActual('react'); // import the real module

    return {
      View: RN.View,
      Text: RN.Text,
      ScrollView: RN.View,
      FlatList: createFlatMock(React, RN),
      ActivityIndicator: RN.View,
      StyleSheet: { create: (styles: object) => styles, flatten: (style: object) => style },
    };
  });
}
