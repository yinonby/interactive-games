
import type { AppImageAssetT } from '@ig/app-engine-models';
import type { MinimalPublicGameConfigT } from '@ig/games-engine-models';
import { type RnuiImagePropsT, type RnuiImageSourceT } from '@ig/rnui';

export const getGameConfigImageProps = (
  minimalPublicGameConfig: MinimalPublicGameConfigT,
  imagesSourceMap: Record<AppImageAssetT, RnuiImageSourceT>,
  includeFreeLabel = true,
): RnuiImagePropsT | undefined => {
  let rnuiImageProps: RnuiImagePropsT | undefined = undefined;

  if (minimalPublicGameConfig.imageInfo.kind === 'asset') {
    const gameImageType: AppImageAssetT = minimalPublicGameConfig.imageInfo.imageAssetName;
    const imageSource: RnuiImageSourceT | undefined = imagesSourceMap[gameImageType]
    if (imageSource !== undefined) {
      rnuiImageProps = { imageSource: imageSource, height: 200 };
    }
  } else {
    rnuiImageProps = { imageSource: minimalPublicGameConfig.imageInfo.imageUrl, height: 200 };
  }

  if (includeFreeLabel && rnuiImageProps !== undefined &&
    (minimalPublicGameConfig.gamePriceInfo.kind === "free" || minimalPublicGameConfig.gamePriceInfo.priceRate === 0)
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
