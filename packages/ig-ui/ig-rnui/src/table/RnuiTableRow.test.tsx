
import { render } from '@testing-library/react-native';
import type { FC } from "react";
import { Text } from "react-native";
import { RnuiTableRow, type RnuiTableRowPropsT } from "./RnuiTableRow";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  // Outer dumb component holds all props
  const RnpTextInputMock: FC<RnuiTableRowPropsT> = ({ ...props }) => {
    return (
      <View {...props} testID="cut-test-id" />
    );
  };

  return {
    DataTable: {
      Row: (props: RnuiTableRowPropsT) => <RnpTextInputMock {...props} />,
    }
  };
});

describe('RnuiTableRow', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiTableRow ><Text testID="text-test-id">Hello</Text></RnuiTableRow>
    );

    const cut = getByTestId('cut-test-id');
    const text = getByTestId('text-test-id');
    expect(cut).toBeTruthy();
    expect(text).toBeTruthy();
  });
});
