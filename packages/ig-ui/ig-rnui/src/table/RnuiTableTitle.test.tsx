
import { render } from '@testing-library/react-native';
import type { FC } from "react";
import { Text } from "react-native";
import { RnuiTableTitle, type RnuiTableTitlePropsT } from "./RnuiTableTitle";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  // Outer dumb component holds all props
  const RnpTextInputMock: FC<RnuiTableTitlePropsT> = ({ ...props }) => {
    return (
      <View {...props} testID="cut-test-id" />
    );
  };

  return {
    DataTable: {
      Title: (props: RnuiTableTitlePropsT) => <RnpTextInputMock {...props} />,
    }
  };
});

describe('RnuiTableTitle', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiTableTitle ><Text testID="text-test-id">Hello</Text></RnuiTableTitle>
    );

    const cut = getByTestId('cut-test-id');
    const text = getByTestId('text-test-id');
    expect(cut).toBeTruthy();
    expect(cut.props.numeric).toBe(undefined);
    expect(text).toBeTruthy();
  });

  it('renders correctly with numeric', () => {
    const { getByTestId } = render(
      <RnuiTableTitle endContent><Text testID="text-test-id">Hello</Text></RnuiTableTitle>
    );

    const cut = getByTestId('cut-test-id');
    expect(cut).toBeTruthy();
    expect(cut.props.numeric).toBe(true);
  });
});
