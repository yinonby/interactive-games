
import { render } from '@testing-library/react-native';
import type { FC } from "react";
import { Text } from "react-native";
import { RnuiTableCell, type RnuiTableCellPropsT } from "./RnuiTableCell";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  // Outer dumb component holds all props
  const RnpTextInputMock: FC<RnuiTableCellPropsT> = ({ ...props }) => {
    return (
      <View {...props} testID="cut-test-id" />
    );
  };

  return {
    DataTable: {
      Cell : (props: RnuiTableCellPropsT) => <RnpTextInputMock {...props} />,
    }
  };
});

describe('RnuiTableCell', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiTableCell ><Text testID="text-test-id">Hello</Text></RnuiTableCell>
    );

    const cut = getByTestId('cut-test-id');
    const text = getByTestId('text-test-id');
    expect(cut).toBeTruthy();
    expect(cut.props.numeric).toBe(undefined);
    expect(text).toBeTruthy();
  });

  it('renders correctly with numeric', () => {
    const { getByTestId } = render(
      <RnuiTableCell endContent><Text testID="text-test-id">Hello</Text></RnuiTableCell>
    );

    const cut = getByTestId('cut-test-id');
    expect(cut).toBeTruthy();
    expect(cut.props.numeric).toBe(true);
  });
});
