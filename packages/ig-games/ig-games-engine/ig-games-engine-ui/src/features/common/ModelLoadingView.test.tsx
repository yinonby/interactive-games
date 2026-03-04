
import { __engineAppUiMocks } from '@ig/app-engine-ui';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ModelLoadingView } from './ModelLoadingView';

// tests

describe('ModelLoadingView', () => {
  const { onAppErrorMock } = __engineAppUiMocks;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading screen', () => {
    const { getByTestId } = render(
      <ModelLoadingView isLoading={true} appErrCode={null} />
    );

    getByTestId("RnuiActivityIndicator-tid");
  });

  it('renders error', () => {
    render(
      <ModelLoadingView isLoading={false} appErrCode={'apiError:server'} />
    );

    expect(onAppErrorMock).toHaveBeenCalledWith("apiError:server");
  });
});
