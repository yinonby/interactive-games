
import { fireEvent, render } from '@testing-library/react-native';
import { RnuiIconButton } from './RnuiIconButton';

// mocks

jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    IconButton: View,
  };
});

// tests

describe('RnuiIconButton', () => {
  it('renders correctly with default props', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <RnuiIconButton icon="home" onPress={handlePress} />
    );

    const buttonText = getByTestId('icon-btn-tid');
    expect(buttonText.props.mode).toBe('contained');
  });

  it('renders correctly with props', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <RnuiIconButton icon="home" onPress={handlePress} mode="outlined" />
    );

    const buttonText = getByTestId('icon-btn-tid');
    expect(buttonText.props.mode).toBe('outlined');
  });

  it('renders correctly with size xs', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <RnuiIconButton icon="home" onPress={handlePress} size="xs" />
    );

    const buttonText = getByTestId('icon-btn-tid');
    expect(buttonText.props.size).toBe(16);
  });

  it('renders correctly with size small', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <RnuiIconButton icon="home" onPress={handlePress} size="small" />
    );

    const buttonText = getByTestId('icon-btn-tid');
    expect(buttonText.props.size).toBe(24);
  });

  it('renders correctly with size medium', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <RnuiIconButton icon="home" onPress={handlePress} size="medium" />
    );

    const buttonText = getByTestId('icon-btn-tid');
    expect(buttonText.props.size).toBe(32);
  });

  it('calls onPress when pressed', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <RnuiIconButton icon="home" onPress={handlePress}/>
    );

    const buttonText = getByTestId('icon-btn-tid');
    expect(buttonText).toBeTruthy();

    fireEvent.press(buttonText);
    expect(handlePress).toHaveBeenCalled();
  });
});
