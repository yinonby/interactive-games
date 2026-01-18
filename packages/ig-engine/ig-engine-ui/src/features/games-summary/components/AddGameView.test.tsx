
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { buildMockedTranslation } from "../../../app/localization/__mocks__/AppLocalizationProvider";
import { useUserConfigController } from '../../../domains/user-config/controller/user-actions/UserConfigController';
import { AddGameView } from './AddGameView';

// --------------------
// Mocks
// --------------------

jest.mock('../../../domains/user-config/controller/user-actions/UserConfigController', () => ({
  useUserConfigController: jest.fn(),
}));

// --------------------
// Helpers
// --------------------

const useUserConfigControllerMock = useUserConfigController as jest.Mock;

// --------------------
// Tests
// --------------------

describe('AddGameView', () => {
  const onAddGameMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useUserConfigControllerMock.mockReturnValue({
      onAddGame: onAddGameMock,
    });
  });

  it('renders input and button', () => {
    const { getByTestId, getByText } = render(<AddGameView />);

    getByTestId('add-game-view');
    getByTestId('game-code-input');
    getByTestId('add-game-button');
    getByText(buildMockedTranslation("games:joinGame"));
  });

  it('renders disabled button when input is empty', () => {
    const { getByTestId } = render(<AddGameView />);

    const button = getByTestId('add-game-button');

    expect(button.props.disabled).toBe(true);
  });

  it('enables button when game code is entered', () => {
    const { getByTestId } = render(<AddGameView />);

    fireEvent(getByTestId('game-code-input'), 'onChangeText', 'ABC123');

    const button = getByTestId('add-game-button');
    expect(button.props.disabled).toBe(false);
  });

  it('does not call onAddGame when button is disabled', () => {
    const { getByTestId } = render(<AddGameView />);

    fireEvent(getByTestId('add-game-button'), 'onPress');

    expect(onAddGameMock).not.toHaveBeenCalled();
  });

  it('calls onAddGame when button is enabled and pressed', () => {
    const { getByTestId } = render(<AddGameView />);

    fireEvent(getByTestId('game-code-input'), 'onChangeText', 'ABC123');
    fireEvent(getByTestId('add-game-button'), 'onPress');

    expect(onAddGameMock).toHaveBeenCalledTimes(1);
    expect(onAddGameMock).toHaveBeenCalledWith('ABC123');
  });
});
