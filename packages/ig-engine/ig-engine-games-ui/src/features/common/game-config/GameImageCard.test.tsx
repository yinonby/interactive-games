
import { __engineAppUiMocks, type AppConfigContextT } from '@ig/engine-app-ui';
import type { AppImageAssetT } from '@ig/engine-models';
import { buildTestMinimalGameConfig } from '@ig/engine-models/test-utils';
import type { RnuiImagePropsT, RnuiImageSourceT } from '@ig/rnui';
import { render } from '@testing-library/react-native';
import React from 'react';
import * as GameViewUtils from '../../../utils/GameViewUtils';
import { GameImageCard } from './GameImageCard';

// tests

describe('GameImageCard', () => {
  const {
    useAppConfigMock,
  } = __engineAppUiMocks;
  const getMinimalGameConfigImagePropsSpy = jest.spyOn(GameViewUtils, 'getMinimalGameConfigImageProps');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const rnuiImageProps: RnuiImagePropsT = { imageSource: '123' };
    const imagesSourceMap = {
      ["treasure-hunt-1"]: { uri: "http://example.com/cover.png" },
    } as Record<AppImageAssetT, RnuiImageSourceT>;
    const includeFreeLabel = false;

    // setup mocks
    getMinimalGameConfigImagePropsSpy.mockReturnValue({ imageSource: '123' });
    useAppConfigMock.mockReturnValue({
      imagesSourceMap: imagesSourceMap,
    } as AppConfigContextT)

    // render
    const minimalGameConfig = buildTestMinimalGameConfig({
      gameConfigId: 'ABC',
    });

    const { getByTestId } = render(
      <GameImageCard
        minimalGameConfig={minimalGameConfig}
        includeFreeLabel={includeFreeLabel}
      />
    );

    // verify calls
    expect(getMinimalGameConfigImagePropsSpy)
      .toHaveBeenCalledWith(minimalGameConfig, imagesSourceMap, includeFreeLabel);

    // verify components
    const card = getByTestId('RnuiCard-tid');
    expect(card.props.imageProps).toEqual(rnuiImageProps);
  });
});
