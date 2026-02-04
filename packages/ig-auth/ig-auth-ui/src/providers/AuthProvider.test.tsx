
import type { LoggerAdapter } from '@ig/utils';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import * as AuthController from '../model/controllers/user-actions/AuthController';
import { AuthProvider, useAuth, type AuthContextT } from './AuthProvider';
import * as AuthUtils from './AuthUtils';

describe('AuthProvider and useAppConfig (React Native)', () => {
  const existingUserId = 'existingUserId';

  // AuthUi mocks
  const onGuestLoginMock = jest.fn();
  const useAuthControllerSpy = jest.spyOn(AuthController, 'useAuthController');
  useAuthControllerSpy.mockReturnValue({
    onGuestLogin: onGuestLoginMock,
  });

  const loggerMock: LoggerAdapter = {
    debug: jest.fn(),
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  const onUnknownErrorMock = jest.fn();

  // AppConfigUtils mocks
  const getLocalUserIdSpy = jest.spyOn(AuthUtils, 'getLocalUserId');
  const setLocalUserIdSpy = jest.spyOn(AuthUtils, 'setLocalUserId');

  const TestChild: React.FC = () => {
    return (
      <Text testID="text-tid">
        Hello
      </Text>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders activity indicator', async () => {
    const { getByTestId, queryByTestId } = render(
      <AuthProvider
        logger={loggerMock}
        onUnknownError={onUnknownErrorMock}
      >
        <TestChild />
      </AuthProvider>
    );

    getByTestId('RnuiActivityIndicator-tid');

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    expect(queryByTestId('RnuiActivityIndicator-tid')).toBeNull();
  });

  it('creates new local user id, guest login fails', async () => {
    getLocalUserIdSpy.mockResolvedValue(null);
    onGuestLoginMock.mockRejectedValue('ERROR');

    render(
      <AuthProvider
        logger={loggerMock}
        onUnknownError={onUnknownErrorMock}
      >
        <TestChild />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(onGuestLoginMock).toHaveBeenCalled()
    );

    // verify calls
    expect(getLocalUserIdSpy).toHaveBeenCalledWith();
    expect(onGuestLoginMock).toHaveBeenCalled();
    expect(onUnknownErrorMock).toHaveBeenCalledWith('ERROR');
  });

  it('creates new local user id, guest login succeeds', async () => {
    getLocalUserIdSpy.mockResolvedValue(null);
    onGuestLoginMock.mockResolvedValue('USER1');

    render(
      <AuthProvider
        logger={loggerMock}
        onUnknownError={onUnknownErrorMock}
      >
        <TestChild />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(setLocalUserIdSpy).toHaveBeenCalled()
    );

    // verify calls
    expect(getLocalUserIdSpy).toHaveBeenCalledWith();
    expect(onGuestLoginMock).toHaveBeenCalledWith();
    expect(setLocalUserIdSpy).toHaveBeenCalledWith('USER1');
  });

  it('uses existing local user id', async () => {
    getLocalUserIdSpy.mockResolvedValue(existingUserId);

    render(
      <AuthProvider
        logger={loggerMock}
        onUnknownError={onUnknownErrorMock}
      >
        <TestChild />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    // verify calls
    expect(getLocalUserIdSpy).toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    getLocalUserIdSpy.mockResolvedValue(null);

    const { getByTestId, queryByTestId } = render(
      <AuthProvider
        logger={loggerMock}
        onUnknownError={onUnknownErrorMock}
      >
        <TestChild />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    // verify components
    expect(queryByTestId('RnuiActivityIndicator-tid')).toBeNull();

    const child = getByTestId('text-tid');
    expect(child.props.children).toBe('Hello');
  });

  it('renders multiple children correctly', async () => {
    getLocalUserIdSpy.mockResolvedValue(null);

    const { getAllByTestId } = render(
      <AuthProvider
        logger={loggerMock}
        onUnknownError={onUnknownErrorMock}
      >
        <TestChild />
        <TestChild />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    const children = getAllByTestId('text-tid');
    expect(children).toHaveLength(2);
  });

  it('useAppConfig returns the exact config object', async () => {
    // setup mocks
    getLocalUserIdSpy.mockResolvedValue(existingUserId);

    let contextValue!: AuthContextT;
    const TestConsumer: React.FC = () => {
      (contextValue = useAuth());
      return null;
    };

    render(
      <AuthProvider
        logger={loggerMock}
        onUnknownError={onUnknownErrorMock}
      >
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getLocalUserIdSpy).toHaveBeenCalled()
    );

    expect(contextValue.curUserId).toBe(existingUserId);
  });
});
