
import type { AppImageAssetT } from '@ig/app-engine-models';
import type { MinimalGameInfoT } from '@ig/games-engine-models';
import { type RnuiImagePropsT, type RnuiImageSourceT } from '@ig/rnui';

export const getMinimalGameConfigImageProps = (
  minimalGameInfo: MinimalGameInfoT,
  imagesSourceMap: Record<AppImageAssetT, RnuiImageSourceT>,
  includeFreeLabel = true,
): RnuiImagePropsT | undefined => {
  let rnuiImageProps: RnuiImagePropsT | undefined = undefined;

  if (minimalGameInfo.imageInfo.kind === 'asset') {
    const gameImageType: AppImageAssetT = minimalGameInfo.imageInfo.imageAssetName;
    const imageSource: RnuiImageSourceT | undefined = imagesSourceMap[gameImageType]
    if (imageSource !== undefined) {
      rnuiImageProps = { imageSource: imageSource, height: 200 };
    }
  } else {
    rnuiImageProps = { imageSource: minimalGameInfo.imageInfo.imageUrl, height: 200 };
  }

  if (includeFreeLabel && rnuiImageProps !== undefined &&
    (minimalGameInfo.gamePriceInfo.kind === "free" || minimalGameInfo.gamePriceInfo.priceRate === 0)
  ) {
    rnuiImageProps.imgLabelProps = {
      text: "free",
      textColor: "white",
      backgroundColor: "green",
    };
    rnuiImageProps.imgLabelPosition = "top-start";
  }

  return rnuiImageProps;
};
