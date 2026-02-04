
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import * as RnuiProvider from '../theme/RnuiProvider';
import { RnuiButton } from './RnuiButton';

// Mock react-native-paper Button
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    Button: View,
  };
});

describe('RnuiButton', () => {
  const useRnuiContextSpy = jest.spyOn(RnuiProvider, 'useRnuiContext');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with children', () => {
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {}
    });

    const { getByTestId } = render(
      <RnuiButton onPress={() => { }}>Click me</RnuiButton>
    );

    const button = getByTestId('btn-tid');
    expect(button.props.children).toBe('Click me');
  });

  it('applies default mode "contained" and uppercase "false"', () => {
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {}
    });

    const { getByTestId } = render(
      <RnuiButton onPress={() => { }}>Default Props</RnuiButton>
    );

    const button = getByTestId('btn-tid').parent; // TouchableOpacity
    expect(button.props.mode).toBe('contained');
    expect(button.props.uppercase).toBe(false);
  });

  it('accepts custom mode and uppercase props', () => {
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {}
    });

    const { getByTestId } = render(
      <RnuiButton mode="outlined" uppercase>
        Custom Props
      </RnuiButton>
    );

    const button = getByTestId('btn-tid').parent;
    expect(button.props.mode).toBe('outlined');
    expect(button.props.uppercase).toBe(true);
  });

  it('renders with size xs', () => {
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {}
    });

    const { getByTestId } = render(
      <RnuiButton size="xs">XS Button</RnuiButton>
    );

    const button = getByTestId('btn-tid');
    expect(button.props.labelStyle).toBeDefined();
    expect(button.props.labelStyle.margin).toBe(8);
    expect(button.props.labelStyle.fontSize).toBe(12);
    expect(button.props.labelStyle.lineHeight).toBe(16);

    const finalButtonStyle = StyleSheet.flatten(button.props.style);
    expect(finalButtonStyle.minWidth).toBe(48);
  });

  it('renders with size xs, override defaults', () => {
    const xsButtonLabelStyle = {
      margin: 18,
      fontSize: 112,
      lineHeight: 116
    };
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {
        xsButtonLabelStyle
      }
    });

    const { getByTestId } = render(
      <RnuiButton size="xs">XS Button</RnuiButton>
    );

    const button = getByTestId('btn-tid');
    expect(button.props.labelStyle).toBeDefined();
    expect(button.props.labelStyle).toBe(xsButtonLabelStyle);

    const finalButtonStyle = StyleSheet.flatten(button.props.style);
    expect(finalButtonStyle.minWidth).toBe(48);
  });

  it('renders with size small', () => {
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {}
    });

    const { getByTestId } = render(
      <RnuiButton size="small">Small Button</RnuiButton>
    );

    const button = getByTestId('btn-tid');
    expect(button.props.labelStyle).toBeUndefined();

    const finalButtonStyle = StyleSheet.flatten(button.props.style);
    expect(finalButtonStyle.minWidth).toBeUndefined();
  });

  it('renders with size medium', () => {
    useRnuiContextSpy.mockReturnValue({
      rnuiStyles: {}
    });

    const { getByTestId } = render(
      <RnuiButton size="medium">Medium Button</RnuiButton>
    );

    const button = getByTestId('btn-tid');
    expect(button.props.labelStyle).toBeUndefined();

    const finalButtonStyle = StyleSheet.flatten(button.props.style);
    expect(finalButtonStyle.minWidth).toBeUndefined();
  });
});
