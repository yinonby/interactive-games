
import type { AppImageAssetT } from '@ig/engine-models';
import type { MinimalGameConfigT } from '@ig/games-models';
import { type RnuiImagePropsT, type RnuiImageSourceT } from "@ig/rnui";

export const getMinimalGameConfigImageProps = (
  minimalGameConfig: MinimalGameConfigT,
  imagesSourceMap: Record<AppImageAssetT, RnuiImageSourceT>,
  includeFreeLabel = true,
): RnuiImagePropsT | undefined => {
  let rnuiImageProps: RnuiImagePropsT | undefined = undefined;

  if (minimalGameConfig.imageInfo.kind === 'asset') {
    const gameImageType: AppImageAssetT = minimalGameConfig.imageInfo.imageAssetName;
    const imageSource: RnuiImageSourceT | undefined = imagesSourceMap[gameImageType]
    if (imageSource !== undefined) {
      rnuiImageProps = { imageSource: imageSource, height: 200 };
    }
  } else {
    rnuiImageProps = { imageSource: minimalGameConfig.imageInfo.imageUrl, height: 200 };
  }

  if (includeFreeLabel && rnuiImageProps !== undefined &&
    (minimalGameConfig.gamePriceInfo.kind === "free" || minimalGameConfig.gamePriceInfo.priceRate === 0)
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
