
import { __engineAppUiMocks } from '@ig/engine-app-ui';
import { buildMockedTranslation } from '@test/mocks/EngineAppUiMocks';
import { render } from '@testing-library/react-native';
import React from 'react';
import { OpenGameInstanceButtonLink } from './OpenGameInstanceButtonLink';

// tests

describe('OpenGameInstanceButtonLink', () => {
  const {
    buildGameInstanceDashboardUrlPathMock,
  } = __engineAppUiMocks;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders properly', async () => {
    buildGameInstanceDashboardUrlPathMock.mockReturnValue('mockedUrl');

    const gameInstanceId = 'ABC';

    const { getByTestId, getByText } = render(
      <OpenGameInstanceButtonLink gameInstanceId={gameInstanceId} />
    );

    const link = getByTestId('PlatformUiLink-tid');
    expect(link.props.href).toEqual('mockedUrl');

    getByTestId('RnuiButton-tid');
    getByText(buildMockedTranslation('common:open'));
  });
});
