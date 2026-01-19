
import type { AppErrorCodeT } from "@/types/AppRtkTypes";
import * as Rnui from "@ig/rnui";
import { jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React, { act, type ReactNode } from 'react';
import type { AppTranslationKeyT } from '../../types/CommonTranslationTypes';
import {
  APP_ERROR_HANDLING_DEFAULT_SNACKBAR_DURATION_MS,
  AppErrorHandlingProvider, useAppErrorHandling
} from './AppErrorHandlingProvider';

jest.mock("../localization/AppLocalizationProvider", () => {
  return {
    AppLocalizationProvider: ({ children }: { children: ReactNode }) => children,
    useAppLocalization: () => ({
      t: jest.fn((tKey: AppTranslationKeyT) => "mocked-t-" + tKey),
    })
  };
});

describe('AppErrorHandlingProvider', () => {
  const useRnuiSnackbarSpy = jest.spyOn(Rnui, "useRnuiSnackbar");

  beforeEach(() => {
    jest.setSystemTime(0);
    useRnuiSnackbarSpy.mockReset();
  });

  it('calls onError, uses default duration', () => {
    let onError!: (code: AppErrorCodeT) => void;

    const onShowSnackbarMock = jest.fn();
    useRnuiSnackbarSpy.mockReturnValue({ onShowSnackbar: onShowSnackbarMock });

    const TestConsumer: React.FC = () => {
      ({ onError } = useAppErrorHandling());
      return null;
    };

    render(
      <AppErrorHandlingProvider>
        <TestConsumer />
      </AppErrorHandlingProvider>
    );

    act(() => {
      onError("ERR-1" as AppErrorCodeT);
    });

    expect(onShowSnackbarMock).toHaveBeenCalledWith({
      message: "mocked-t-ERR-1",
      level: "err",
      durationMs: APP_ERROR_HANDLING_DEFAULT_SNACKBAR_DURATION_MS,
      withCloseButton: true,
    });
  });

  it("doesn't call onError twice for same error within duration", async () => {
    let onError!: (code: AppErrorCodeT) => void;

    const onShowSnackbarMock = jest.fn();
    useRnuiSnackbarSpy.mockReturnValue({ onShowSnackbar: onShowSnackbarMock });

    const errorDurationMs = 2000;
    const TestConsumer: React.FC = () => {
      ({ onError } = useAppErrorHandling());
      return null;
    };

    render(
      <AppErrorHandlingProvider errorDurationMs={errorDurationMs}>
        <TestConsumer />
      </AppErrorHandlingProvider>
    );

    // handle 2 errors
    act(() => {
      onError("ERR-1" as AppErrorCodeT);
      onError("ERR-2" as AppErrorCodeT);
      onError("ERR-1" as AppErrorCodeT); // this one should do nothing
    });
    expect(onShowSnackbarMock).toHaveBeenCalledTimes(2);
    expect(onShowSnackbarMock).toHaveBeenNthCalledWith(1, {
      message: "mocked-t-ERR-1",
      level: "err",
      durationMs: errorDurationMs,
      withCloseButton: true,
    });
    expect(onShowSnackbarMock).toHaveBeenNthCalledWith(2, {
      message: "mocked-t-ERR-2",
      level: "err",
      durationMs: errorDurationMs,
      withCloseButton: true,
    });
    onShowSnackbarMock.mockClear();

    // timeout doesn't elapse
    jest.advanceTimersByTime(errorDurationMs - 1);

    // nothing to do
    act(() => {
      onError("ERR-1" as AppErrorCodeT);
    });
    expect(onShowSnackbarMock).not.toHaveBeenCalled();

    // timeout elapses
    jest.advanceTimersByTime(1);

    // error should be handled
    act(() => {
      onError("ERR-1" as AppErrorCodeT);
    });
    expect(onShowSnackbarMock).toHaveBeenCalledWith({
      message: "mocked-t-ERR-1",
      level: "err",
      durationMs: errorDurationMs,
      withCloseButton: true,
    });
  });
});
