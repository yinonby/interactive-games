
import '@testing-library/jest-native/extend-expect';
import React from "react";

jest.mock("react-native/Libraries/Components/ScrollView/ScrollView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View } = require("react-native");

    return {
      default: View,
    };
  }
);

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      API_URL: "fake-url",
    },
  },
}));

jest.mock('@react-native-clipboard/clipboard', () => {
  return {
    Clipboard: {
      setString: jest.fn(),
    }
  };
});

jest.mock('react-native-qrcode-styled', () => {
  return {
    QRCodeStyled: jest.fn(),
  };
});

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

jest.mock("@ig/rnui", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text, View } = require('react-native');

  return {
    RnuiText: Text,
    RnuiButton: View,
    RnuiIconButton: View,
    RnuiProvider: View,
    RnuiCard: View,
    RnuiGrid: View,
    RnuiMasonryGrid: View,
    RnuiGridItem: View,
    RnuiBlinker: View,
    RnuiTextInput: View,
    RnuiTableRow: View,
    RnuiTableCell: View,
    RnuiTable: View,
    RnuiTableHeader: View,
    RnuiTableTitle: View,
    RnuiAppContent: View,
    RnuiCopyToClipboard: View,
    RnuiQrCode: View,
  };
});

jest.mock("@ig/platform-ui", () => {
  const navigateMock = jest.fn();
  const navigateReplaceMock = jest.fn();

  return {
    __esModule: true,
    usePlatformUiNavigation: () => ({
      navigate: navigateMock,
      navigateReplace: navigateReplaceMock,
    }),
    // expose for tests
    __puiMocks: {
      navigateMock,
      navigateReplaceMock,
    },
  };
});

declare module "@ig/platform-ui" {
  export const __puiMocks: {
    navigateMock: jest.Mock,
    navigateReplaceMock: jest.Mock,
  };
}

jest.mock('../src/app/providers/useClientLogger');

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});
