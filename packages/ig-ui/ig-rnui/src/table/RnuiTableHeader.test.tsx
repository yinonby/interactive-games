
import { render } from '@testing-library/react-native';
import { StyleSheet, Text } from "react-native";
import { RnuiTableHeader } from "./RnuiTableHeader";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    DataTable: {
      Header: View,
    }
  };
});

describe('RnuiTableHeader', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiTableHeader ><Text testID="text-test-id">Hello</Text></RnuiTableHeader>
    );

    getByTestId('DataTableHeader-tid');
    getByTestId('text-test-id');
  });

  it('renders correctly with noHorizontalPadding', () => {
    const { getByTestId } = render(
      <RnuiTableHeader noHorizontalPadding><Text testID="text-test-id">Hello</Text></RnuiTableHeader>
    );

    const header = getByTestId('DataTableHeader-tid');
    const headerStyle = StyleSheet.flatten(header.props.style);
    expect(headerStyle.paddingHorizontal).toEqual(0);
  });
});
