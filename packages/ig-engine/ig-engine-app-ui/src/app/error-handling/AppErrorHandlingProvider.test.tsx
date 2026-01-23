
import * as Rnui from '@ig/rnui';
import { jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React, { act, type ReactNode } from 'react';
import { View } from 'react-native';
import { AppError, type AppErrorCodeT } from '../../types/AppErrorTypes';
import type { AppTranslationKeyT } from '../../types/CommonTranslationTypes';
import {
  APP_ERROR_HANDLING_DEFAULT_SNACKBAR_DURATION_MS,
  AppErrorHandlingProvider, useAppErrorHandling
} from './AppErrorHandlingProvider';

jest.mock('../localization/AppLocalizationProvider', () => {
  return {
    AppLocalizationProvider: ({ children }: { children: ReactNode }) => children,
    useAppLocalization: () => ({
      t: jest.fn((tKey: AppTranslationKeyT) => 'mocked-t-' + tKey),
    })
  };
});

jest.mock('./AppErrorPage', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    AppErrorPage: View,
  };
});

describe('AppErrorHandlingProvider', () => {
  const useRnuiSnackbarSpy = jest.spyOn(Rnui, 'useRnuiSnackbar');

  beforeEach(() => {
    jest.setSystemTime(0);
    useRnuiSnackbarSpy.mockReset();
  });

  it('renders properly', () => {
    const onShowSnackbarMock = jest.fn();
    useRnuiSnackbarSpy.mockReturnValue({ onShowSnackbar: onShowSnackbarMock });

    const { getByTestId } = render(
      <AppErrorHandlingProvider>
        <View testID='View-tid' />
      </AppErrorHandlingProvider>
    );

    getByTestId('RnuiErrorBoundary-tid');
    getByTestId('View-tid');
  });

  it('checks that ErrorBoundary renders the correct page', () => {
    const onShowSnackbarMock = jest.fn();
    useRnuiSnackbarSpy.mockReturnValue({ onShowSnackbar: onShowSnackbarMock });

    // first, render the provider
    const { getByTestId } = render(
      <AppErrorHandlingProvider>
        <View />
      </AppErrorHandlingProvider>
    );

    const errorBoundary = getByTestId('RnuiErrorBoundary-tid');

    // then, render the error page
    const { getByTestId: getByTestId2 } = render(errorBoundary.props.renderErrorNode());

    // verify error page rendered
    getByTestId2('AppErrorPage-tid');
  });

  it('calls onAppError, uses default duration', () => {
    let onAppError!: (code: AppErrorCodeT) => void;

    const onShowSnackbarMock = jest.fn();
    useRnuiSnackbarSpy.mockReturnValue({ onShowSnackbar: onShowSnackbarMock });

    const TestConsumer: React.FC = () => {
      ({ onAppError } = useAppErrorHandling());
      return null;
    };

    render(
      <AppErrorHandlingProvider>
        <TestConsumer />
      </AppErrorHandlingProvider>
    );

    act(() => {
      onAppError('ERR-1' as AppErrorCodeT);
    });

    expect(onShowSnackbarMock).toHaveBeenCalledWith({
      message: 'mocked-t-ERR-1',
      level: 'err',
      durationMs: APP_ERROR_HANDLING_DEFAULT_SNACKBAR_DURATION_MS,
      withCloseButton: true,
    });
  });

  it('does not call onAppError twice for same error within duration', async () => {
    let onAppError!: (code: AppErrorCodeT) => void;

    const onShowSnackbarMock = jest.fn();
    useRnuiSnackbarSpy.mockReturnValue({ onShowSnackbar: onShowSnackbarMock });

    const errorDurationMs = 2000;
    const TestConsumer: React.FC = () => {
      ({ onAppError } = useAppErrorHandling());
      return null;
    };

    render(
      <AppErrorHandlingProvider errorDurationMs={errorDurationMs}>
        <TestConsumer />
      </AppErrorHandlingProvider>
    );

    // handle 2 errors
    act(() => {
      onAppError('ERR-1' as AppErrorCodeT);
      onAppError('ERR-2' as AppErrorCodeT);
      onAppError('ERR-1' as AppErrorCodeT); // this one should do nothing
    });
    expect(onShowSnackbarMock).toHaveBeenCalledTimes(2);
    expect(onShowSnackbarMock).toHaveBeenNthCalledWith(1, {
      message: 'mocked-t-ERR-1',
      level: 'err',
      durationMs: errorDurationMs,
      withCloseButton: true,
    });
    expect(onShowSnackbarMock).toHaveBeenNthCalledWith(2, {
      message: 'mocked-t-ERR-2',
      level: 'err',
      durationMs: errorDurationMs,
      withCloseButton: true,
    });
    onShowSnackbarMock.mockClear();

    // timeout doesn't elapse
    jest.advanceTimersByTime(errorDurationMs - 1);

    // nothing to do
    act(() => {
      onAppError('ERR-1' as AppErrorCodeT);
    });
    expect(onShowSnackbarMock).not.toHaveBeenCalled();

    // timeout elapses
    jest.advanceTimersByTime(1);

    // error should be handled
    act(() => {
      onAppError('ERR-1' as AppErrorCodeT);
    });
    expect(onShowSnackbarMock).toHaveBeenCalledWith({
      message: 'mocked-t-ERR-1',
      level: 'err',
      durationMs: errorDurationMs,
      withCloseButton: true,
    });
  });

  it('calls onUnknownError, error is AppError', () => {
    let onUnknownError!: (error: unknown) => void;

    const onShowSnackbarMock = jest.fn();
    useRnuiSnackbarSpy.mockReturnValue({ onShowSnackbar: onShowSnackbarMock });

    const TestConsumer: React.FC = () => {
      ({ onUnknownError } = useAppErrorHandling());
      return null;
    };

    render(
      <AppErrorHandlingProvider>
        <TestConsumer />
      </AppErrorHandlingProvider>
    );

    act(() => {
      const appError = new AppError('ERR-1' as AppErrorCodeT);
      onUnknownError(appError);
    });

    expect(onShowSnackbarMock).toHaveBeenCalledWith({
      message: 'mocked-t-ERR-1',
      level: 'err',
      durationMs: APP_ERROR_HANDLING_DEFAULT_SNACKBAR_DURATION_MS,
      withCloseButton: true,
    });
  });

  it('calls onUnknownError, error is not AppError', () => {
    let onUnknownError!: (error: unknown) => void;

    const onShowSnackbarMock = jest.fn();
    useRnuiSnackbarSpy.mockReturnValue({ onShowSnackbar: onShowSnackbarMock });

    const TestConsumer: React.FC = () => {
      ({ onUnknownError } = useAppErrorHandling());
      return null;
    };

    render(
      <AppErrorHandlingProvider>
        <TestConsumer />
      </AppErrorHandlingProvider>
    );

    act(() => {
      const appError = {};
      onUnknownError(appError);
    });

    expect(onShowSnackbarMock).toHaveBeenCalledWith({
      message: 'mocked-t-appError:unknown',
      level: 'err',
      durationMs: APP_ERROR_HANDLING_DEFAULT_SNACKBAR_DURATION_MS,
      withCloseButton: true,
    });
  });
});
