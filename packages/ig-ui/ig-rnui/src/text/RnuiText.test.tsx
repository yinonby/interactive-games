
import { render } from '@testing-library/react-native';
import type { FC } from "react";
import { RnuiText, type RnuiTextPropsT } from "./RnuiText";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');

  // Outer dumb component holds all props
  const RnpTextMock: FC<RnuiTextPropsT> = ({ children, ...props }) => {
    return (
      <Text {...props} testID="text-test-id" >{children}</Text>
    );
  };

  return {
    Text: (props: RnuiTextPropsT) => <RnpTextMock {...props} />,
  };
});

describe('RnuiText', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiText >{"Hello"}</RnuiText>
    );

    const text = getByTestId('text-test-id');
    expect(text.props.children).toBe('Hello');
  });
});
