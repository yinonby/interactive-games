
import { render } from '@testing-library/react-native';
import { StyleSheet, Text } from "react-native";
import * as RnuiProvider from '../theme/RnuiProvider';
import { RnuiTableTitle } from "./RnuiTableTitle";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    DataTable: {
      Title: View,
    }
  };
});

describe('RnuiTableTitle', () => {
  const useRnuiContextSpy = jest.spyOn(RnuiProvider, 'useRnuiContext');

  it('renders correctly with default props', () => {
    useRnuiContextSpy.mockReturnValue({ rnuiStyles: {} });

    const { getByTestId } = render(
      <RnuiTableTitle ><Text testID="text-test-id">Hello</Text></RnuiTableTitle>
    );

    const title = getByTestId('DataTableTitle-tid');
    expect(title.props.numeric).toBe(undefined);

    getByTestId('text-test-id');
  });

  it('renders correctly with numeric', () => {
    useRnuiContextSpy.mockReturnValue({ rnuiStyles: {} });

    const { getByTestId } = render(
      <RnuiTableTitle endContent><Text testID="text-test-id">Hello</Text></RnuiTableTitle>
    );

    const title = getByTestId('DataTableTitle-tid');
    expect(title.props.numeric).toBe(true);
  });

  it('renders correctly with dense, using rnuiStyles, denseMinHeight >= 24', () => {
    useRnuiContextSpy.mockReturnValue({ rnuiStyles: { tableRow: { denseMinHeight: 30 }}});

    const { getByTestId } = render(
      <RnuiTableTitle dense><Text testID="text-test-id">Hello</Text></RnuiTableTitle>
    );

    const title = getByTestId('DataTableTitle-tid');
    const titleStyle = StyleSheet.flatten(title.props.style);

    expect(titleStyle.paddingVertical).toEqual(3); // (30 - 24) / 2
  });

  it('renders correctly with dense, using rnuiStyles, denseMinHeight < 24', () => {
    useRnuiContextSpy.mockReturnValue({ rnuiStyles: { tableRow: { denseMinHeight: 20 } } });

    const { getByTestId } = render(
      <RnuiTableTitle dense><Text testID="text-test-id">Hello</Text></RnuiTableTitle>
    );

    const title = getByTestId('DataTableTitle-tid');
    const titleStyle = StyleSheet.flatten(title.props.style);

    expect(titleStyle.paddingVertical).toEqual(0);
  });

  it('renders correctly with dense, using local values in absence of rnuiStyles', () => {
    useRnuiContextSpy.mockReturnValue({ rnuiStyles: {} });

    const { getByTestId } = render(
      <RnuiTableTitle dense><Text testID="text-test-id">Hello</Text></RnuiTableTitle>
    );

    const title = getByTestId('DataTableTitle-tid');
    const titleStyle = StyleSheet.flatten(title.props.style);

    expect(titleStyle.paddingVertical).toEqual(4);
  });
});
