
import { render } from '@testing-library/react-native';
import { Text } from "react-native";
import { RnuiTableCell } from "./RnuiTableCell";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    DataTable: {
      Cell: View,
    }
  };
});

describe('RnuiTableCell', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiTableCell ><Text testID="text-test-id">Hello</Text></RnuiTableCell>
    );

    const cut = getByTestId('DataTableCell-tid');
    const text = getByTestId('text-test-id');
    expect(cut).toBeTruthy();
    expect(cut.props.numeric).toBe(undefined);
    expect(text).toBeTruthy();
  });

  it('renders correctly with numeric', () => {
    const { getByTestId } = render(
      <RnuiTableCell endContent><Text testID="text-test-id">Hello</Text></RnuiTableCell>
    );

    const cut = getByTestId('DataTableCell-tid');
    expect(cut).toBeTruthy();
    expect(cut.props.numeric).toBe(true);
  });
});
