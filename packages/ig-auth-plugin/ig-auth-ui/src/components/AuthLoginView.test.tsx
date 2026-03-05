
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import * as AuthControllerModule from '../model/controllers/user-actions/AuthController';
import { AuthLoginView } from './AuthLoginView';

describe('AuthLoginView', () => {
  const spy_useAuthController = jest.spyOn(AuthControllerModule, 'useAuthController');
  const mock_onGuestLogin = jest.fn();
  spy_useAuthController.mockReturnValue({
    onGuestLogin: mock_onGuestLogin,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ModelLoadingView when loading', () => {
    const handleAuthGuestLogin = jest.fn();

    const { getByTestId } = render(
      <AuthLoginView onAuthGuestLogin={handleAuthGuestLogin} />
    );

    getByTestId('RnuiTextInput-nickname-tid');
    getByTestId('RnuiButton-guestLogin-tid');
  });

  it('simulates click, empty nickname', async () => {
    const { getByTestId } = render(
      <AuthLoginView />
    );

    const btn = getByTestId('RnuiButton-guestLogin-tid');

    // simulate press button
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(mock_onGuestLogin).not.toHaveBeenCalledWith();
  });

  it('simulates click, without callback', async () => {
    const { getByTestId } = render(
      <AuthLoginView />
    );

    const textInput = getByTestId('RnuiTextInput-nickname-tid');
    const btn = getByTestId('RnuiButton-guestLogin-tid');

    // set new message in text input
    fireEvent(textInput, 'onChangeText', 'NICKNAME1');

    // simulate press button
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(mock_onGuestLogin).toHaveBeenCalledWith('NICKNAME1');
  });

  it('simulates click, with callback', async () => {
    const mock_handleAuthGuestLogin = jest.fn();
    mock_onGuestLogin.mockReturnValue('AUTHID1');

    const { getByTestId } = render(
      <AuthLoginView onAuthGuestLogin={mock_handleAuthGuestLogin} />
    );

    const textInput = getByTestId('RnuiTextInput-nickname-tid');
    const btn = getByTestId('RnuiButton-guestLogin-tid');

    // set new message in text input
    fireEvent(textInput, 'onChangeText', 'NICKNAME1');

    // simulate press button
    await act(async () => {
      fireEvent.press(btn);
    });

    expect(mock_onGuestLogin).toHaveBeenCalledWith('NICKNAME1');
    expect(mock_handleAuthGuestLogin).toHaveBeenCalledWith('AUTHID1');
  });
});
