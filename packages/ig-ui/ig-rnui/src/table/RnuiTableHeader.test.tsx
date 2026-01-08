
import { render } from '@testing-library/react-native';
import type { FC } from "react";
import { Text } from "react-native";
import { RnuiTableHeader, type RnuiTableHeaderPropsT } from "./RnuiTableHeader";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  // Outer dumb component holds all props
  const RnpTextInputMock: FC<RnuiTableHeaderPropsT> = ({ ...props }) => {
    return (
      <View {...props} testID="cut-test-id" />
    );
  };

  return {
    DataTable: {
      Header: (props: RnuiTableHeaderPropsT) => <RnpTextInputMock {...props} />,
    }
  };
});

describe('RnuiTableHeader', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiTableHeader ><Text testID="text-test-id">Hello</Text></RnuiTableHeader>
    );

    const cut = getByTestId('cut-test-id');
    const text = getByTestId('text-test-id');
    expect(cut).toBeTruthy();
    expect(text).toBeTruthy();
  });
});
