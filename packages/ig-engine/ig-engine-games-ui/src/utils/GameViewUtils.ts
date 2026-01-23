
import type { AppImageAssetT, MinimalGameConfigT } from "@ig/engine-models";
import { type RnuiImagePropsT, type RnuiImageSourceT } from "@ig/rnui";

export const getMinimalGameConfigImageProps = (
  minimalGameConfig: MinimalGameConfigT,
  imagesSourceMap: Record<AppImageAssetT, RnuiImageSourceT>,
  includeFreeLabel = true,
): RnuiImagePropsT | undefined => {
  let rnuiImageProps: RnuiImagePropsT | undefined = undefined;

  if (minimalGameConfig.imageAssetName !== undefined) {
    const gameImageType = minimalGameConfig.imageAssetName as AppImageAssetT;
    const imageSource: RnuiImageSourceT | undefined = imagesSourceMap[gameImageType]
    if (imageSource !== undefined) {
      rnuiImageProps = { imageSource: imageSource, height: 200 };
    }
  } else {
    rnuiImageProps = { imageSource: minimalGameConfig.imageUrl, height: 200 };
  }
  if (includeFreeLabel && rnuiImageProps !== undefined &&
    (minimalGameConfig.gamePrice === "free" || minimalGameConfig.gamePrice.priceRate === 0)
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
