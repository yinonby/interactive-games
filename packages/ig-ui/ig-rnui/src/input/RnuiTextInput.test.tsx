
import { render } from '@testing-library/react-native';
import { StyleSheet } from "react-native";
import { RnuiTextInput } from "./RnuiTextInput";

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    TextInput: View,
  };
});

describe('RnuiTextInput', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <RnuiTextInput />
    );

    const textInput = getByTestId('text-input-tid');
    expect(textInput.props.mode).toBe('outlined');
  });

  it('renders correctly with given props', () => {
    const { getByTestId } = render(
      <RnuiTextInput mode="outlined"/>
    );

    const textInput = getByTestId('text-input-tid');
    expect(textInput.props.mode).toBe('outlined');
  });

  it('renders correctly with size xs', () => {
    const { getByTestId } = render(
      <RnuiTextInput size="xs" />
    );

    const textInput = getByTestId('text-input-tid');
    expect(textInput.props.dense).toBe(false);

    const textInputFinalStyle = StyleSheet.flatten(textInput.props.style);
    expect(textInputFinalStyle.height).toBe(32);
  });

  it('renders correctly with size small (as default)', () => {
    const { getByTestId } = render(
      <RnuiTextInput/>
    );

    const textInput = getByTestId('text-input-tid');
    expect(textInput.props.dense).toBe(true);
  });

  it('renders correctly with size medium', () => {
    const { getByTestId } = render(
      <RnuiTextInput size="medium"/>
    );

    const textInput = getByTestId('text-input-tid');
    expect(textInput.props.dense).toBe(false);
  });
});
