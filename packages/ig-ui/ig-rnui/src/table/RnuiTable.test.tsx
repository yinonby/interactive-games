
import { render } from '@testing-library/react-native';
import type { FC } from "react";
import { Text } from "react-native";
import { RnuiTable, type RnuiTablePropsT } from "./RnuiTable";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  // Outer dumb component holds all props
  const RnpTextInputMock: FC<RnuiTablePropsT> = ({ ...props }) => {
    return (
      <View {...props} testID="cut-test-id" />
    );
  };

  return {
    DataTable: (props: RnuiTablePropsT) => <RnpTextInputMock {...props} />,
  };
});

describe('RnuiTable', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiTable ><Text testID="text-test-id">Hello</Text></RnuiTable>
    );

    const cut = getByTestId('cut-test-id');
    const text = getByTestId('text-test-id');
    expect(cut).toBeTruthy();
    expect(text).toBeTruthy();
  });
});
