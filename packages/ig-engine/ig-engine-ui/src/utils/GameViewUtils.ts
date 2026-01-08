
import type { MinimalGameConfigT } from "@ig/engine-models";
import { type RnuiImagePropsT, type RnuiImageSourceT } from "@ig/rnui";
import type { GameImageTypeT } from "../types/GameImageTypes";

export const getMinimalGameConfigImageProps = (
  minimalGameConfig: MinimalGameConfigT,
  imagesSourceMap: Record<GameImageTypeT, RnuiImageSourceT>,
): RnuiImagePropsT | undefined => {
  let rnuiImageProps: RnuiImagePropsT | undefined = undefined;
  if (minimalGameConfig.imageAssetName !== undefined) {
    const gameImageType = minimalGameConfig.imageAssetName as GameImageTypeT;
    const imageSource: RnuiImageSourceT | undefined = imagesSourceMap[gameImageType]
    if (imageSource !== undefined) {
      rnuiImageProps = { imageSource: imageSource, height: 200 };
    }
  } else if (minimalGameConfig.imageUrl !== undefined) {
    rnuiImageProps = { imageSource: minimalGameConfig.imageUrl };
  }
  if (rnuiImageProps !== undefined &&
    (minimalGameConfig.gamePrice === undefined || minimalGameConfig.gamePrice.priceRate === 0)
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
