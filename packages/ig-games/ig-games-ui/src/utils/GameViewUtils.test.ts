
import type { AppImageAssetT } from '@ig/engine-models';
import { buildTestMinimalGameConfig } from '@ig/games-models/test-utils';
import type { RnuiImagePropsT, RnuiImageSourceT } from '@ig/rnui';
import { getMinimalGameConfigImageProps } from './GameViewUtils';

describe('getMinimalGameConfigImageProps', () => {
  it('uses imageUrl when imageInfo kind is url', () => {
    const imagesSourceMap = {} as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = buildTestMinimalGameConfig({
      imageInfo: { kind: 'url', imageUrl: 'http://example.com/from-url.png' },
      gamePriceInfo: { kind: 'free' },
    });

    const result: RnuiImagePropsT | undefined = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    if (result === undefined) {
      throw new Error('Unexpected result');
    }
    expect(result.imageSource).toEqual('http://example.com/from-url.png');
    expect(result.height).toEqual(200);
  });

  it('uses imageAssetName when imageInfo kind is asset', () => {
    const imagesSourceMap = {
      ['treasure-hunt-1']: { uri: 'http://example.com/cover.png' },
    } as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = buildTestMinimalGameConfig({
      imageInfo: { kind: 'asset', imageAssetName: 'treasure-hunt-1' },
      gamePriceInfo: { kind: 'free' },
    });

    const result: RnuiImagePropsT | undefined = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    if (result === undefined) {
      throw new Error('Unexpected result');
    }
    expect(result.imageSource).toEqual({ uri: 'http://example.com/cover.png' });
    expect(result.height).toEqual(200);
  });

  it('returns undefined when when imageInfo kind is asset but imageAssetName is not in map', () => {
    const imagesSourceMap = {} as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = buildTestMinimalGameConfig({
      imageInfo: { kind: 'asset', imageAssetName: 'missingAsset' as AppImageAssetT },
      gamePriceInfo: { kind: 'free' },
    })

    const result: RnuiImagePropsT | undefined = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    expect(result).toBeUndefined();
  });

  it('adds free label when gamePriceInfo.kind is free', () => {
    const imagesSourceMap = {} as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = buildTestMinimalGameConfig({
      imageInfo: { kind: 'url', imageUrl: 'http://example.com/from-url.png' },
      gamePriceInfo: { kind: 'free' },
    });

    const result = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    if (result === undefined || result.imgLabelProps === undefined) {
      throw new Error('Unexpected result');
    }
    expect(result.imgLabelProps.text).toEqual('free')
    expect(result.imgLabelProps.textColor).toEqual('white')
    expect(result.imgLabelProps.backgroundColor).toEqual('green')
  });

  it('does not add free label when gamePriceInfo.kind is notFree', () => {
    const imagesSourceMap = {} as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = buildTestMinimalGameConfig({
      imageInfo: { kind: 'url', imageUrl: 'http://example.com/from-url.png' },
      gamePriceInfo: { kind: 'notFree', priceRate: 1, priceCurrency: 'EUR' },
    });

    const result = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    if (result === undefined) {
      throw new Error('Unexpected result');
    }
    expect(result.imgLabelProps).toBeUndefined();
  });
});