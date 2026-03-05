
import type { LoggerAdapter } from '@ig/utils';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import * as AuthLoginInfoModel from '../model/rtk/AuthLoginInfoModel';
import { AuthProvider, useAuth } from './AuthProvider';

jest.mock('../components/AuthLoginView', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    AuthLoginView: View,
  };
});

describe('AuthProvider and useAuth', () => {
  const spy_useAuthLoginInfoModel = jest.spyOn(AuthLoginInfoModel, 'useAuthLoginInfoModel');

  const loggerMock: LoggerAdapter = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  const onUnknownErrorMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AuthProvider', () => {
    it('renders activity indicator', async () => {
      spy_useAuthLoginInfoModel.mockReturnValue({
        isLoading: true,
        isError: false,
      });

      const { getByTestId } = render(
        <AuthProvider
          logger={loggerMock}
          onUnknownError={onUnknownErrorMock}
        >
          <View />
        </AuthProvider>
      );

      getByTestId('RnuiActivityIndicator-tid');
    });

    it('handles error', async () => {
      spy_useAuthLoginInfoModel.mockReturnValue({
        isLoading: false,
        isError: true,
        appErrCode: 'appError:unknown',
      });

      render(
        <AuthProvider
          logger={loggerMock}
          onUnknownError={onUnknownErrorMock}
        >
          <View />
        </AuthProvider>
      );

      expect(onUnknownErrorMock).toHaveBeenCalledWith('appError:unknown');
    });

    it('renders AuthLoginView', async () => {
      spy_useAuthLoginInfoModel.mockReturnValue({
        isLoading: false,
        isError: false,
        data: {
          authId: null,
        }
      });

      const { getByTestId } = render(
        <AuthProvider
          logger={loggerMock}
          onUnknownError={onUnknownErrorMock}
        >
          <View />
        </AuthProvider>
      );

      getByTestId('AuthLoginView-tid');
    });

    it('renders children', async () => {
      spy_useAuthLoginInfoModel.mockReturnValue({
        isLoading: false,
        isError: false,
        data: {
          authId: 'AUTHID1',
        }
      });

      const TestChild: React.FC = () => {
        return (
          <Text testID="Text-tid">
            Hello
          </Text>
        );
      };

      const { getByTestId } = render(
        <AuthProvider
          logger={loggerMock}
          onUnknownError={onUnknownErrorMock}
        >
          <TestChild />
        </AuthProvider>
      );

      getByTestId('Text-tid');
    });
  });

  describe('useAuth', () => {
    it('renders children', async () => {
      spy_useAuthLoginInfoModel.mockReturnValue({
        isLoading: false,
        isError: false,
        data: {
          authId: 'AUTHID1',
        }
      });

      const TestChild: React.FC = () => {
        const { curAuthId } = useAuth();

        return (
          <Text testID="Text-tid">
            {curAuthId}
          </Text>
        );
      };

      const { getByText } = render(
        <AuthProvider
          logger={loggerMock}
          onUnknownError={onUnknownErrorMock}
        >
          <TestChild />
        </AuthProvider>
      );

      getByText('AUTHID1');
    });
  });
});
