
import { render } from '@testing-library/react-native';
import { StyleSheet, Text, View } from 'react-native';
import * as RnuiProvider from '../theme/RnuiProvider';
import { RnuiTableRow } from './RnuiTableRow';

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    DataTable: {
      Row: View,
    }
  };
});

describe('RnuiTableRow', () => {
  const useRnuiContextSpy = jest.spyOn(RnuiProvider, 'useRnuiContext');

  it('renders correctly with default props', () => {
    useRnuiContextSpy.mockReturnValue({ rnuiStyles: {} });

    const { getByTestId } = render(
      <RnuiTableRow ><Text testID="Text-id">Hello</Text></RnuiTableRow>
    );

    getByTestId('DataTableRow-tid');
    getByTestId('Text-id');
  });

  it('renders correctly with dense, using rnuiStyles', () => {
    useRnuiContextSpy.mockReturnValue({ rnuiStyles: { tableRow: { denseMinHeight: 20 }}});

    const { getByTestId } = render(
      <RnuiTableRow dense><View/></RnuiTableRow>
    );

    const row = getByTestId('DataTableRow-tid');
    const rowStyle = StyleSheet.flatten(row.props.style);
    expect(rowStyle.minHeight).toEqual(20);
  });

  it('renders correctly with dense, using local style in absence of rnuiStyles', () => {
    useRnuiContextSpy.mockReturnValue({ rnuiStyles: {} });

    const { getByTestId } = render(
      <RnuiTableRow dense><View/></RnuiTableRow>
    );

    const row = getByTestId('DataTableRow-tid');
    const rowStyle = StyleSheet.flatten(row.props.style);
    expect(rowStyle.minHeight).toEqual(32);
  });

  it('renders correctly with noHorizontalPadding', () => {
    useRnuiContextSpy.mockReturnValue({ rnuiStyles: {} });

    const { getByTestId } = render(
      <RnuiTableRow noHorizontalPadding><View /></RnuiTableRow>
    );

    const row = getByTestId('DataTableRow-tid');
    const rowStyle = StyleSheet.flatten(row.props.style);
    expect(rowStyle.paddingHorizontal).toEqual(0);
  });
});
