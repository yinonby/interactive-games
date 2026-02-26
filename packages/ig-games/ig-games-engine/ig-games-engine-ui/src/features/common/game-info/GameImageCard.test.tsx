
import type { AppImageAssetT } from '@ig/app-engine-models';
import { __engineAppUiMocks, type AppConfigContextT } from '@ig/app-engine-ui';
import { buildMinimalPublicGameConfigMock } from '@ig/games-engine-models/test-utils';
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
  const getGameConfigImagePropsSpy = jest.spyOn(GameViewUtils, 'getGameConfigImageProps');

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
    getGameConfigImagePropsSpy.mockReturnValue({ imageSource: '123' });
    useAppConfigMock.mockReturnValue({
      imagesSourceMap: imagesSourceMap,
    } as AppConfigContextT)

    // render
    const minimalPublicGameConfig = buildMinimalPublicGameConfigMock({
      gameConfigId: 'ABC',
    });

    const { getByTestId } = render(
      <GameImageCard
        minimalPublicGameConfig={minimalPublicGameConfig}
        includeFreeLabel={includeFreeLabel}
      />
    );

    // verify calls
    expect(getGameConfigImagePropsSpy)
      .toHaveBeenCalledWith(minimalPublicGameConfig, imagesSourceMap, includeFreeLabel);

    // verify components
    const card = getByTestId('RnuiCard-tid');
    expect(card.props.imageProps).toEqual(rnuiImageProps);
  });
});
