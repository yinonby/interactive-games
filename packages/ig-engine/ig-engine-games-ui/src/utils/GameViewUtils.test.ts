
import type { AppImageAssetT, MinimalGameConfigT } from "@ig/engine-models";
import type { RnuiImageSourceT } from "@ig/rnui";
import { getMinimalGameConfigImageProps } from "./GameViewUtils";

describe("getMinimalGameConfigImageProps", () => {
  it("returns imageSource and height for known assetName and marks as free when gamePrice is undefined", () => {
    const imagesSourceMap = {
      ["treasure-hunt-1"]: { uri: "http://example.com/cover.png" },
    } as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = {
      gamePrice: "free",
      imageAssetName: "treasure-hunt-1",
    } as MinimalGameConfigT;

    const result = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    expect(result).toEqual({
      imageSource: imagesSourceMap["treasure-hunt-1"],
      height: 200,
      imgLabelProps: {
        text: "free",
        textColor: "white",
        backgroundColor: "green",
      },
      imgLabelPosition: "top-start",
    });
  });

  it("does not add free label when gamePrice.priceRate is greater than 0", () => {
    const imagesSourceMap = {
      ["treasure-hunt-1"]: { uri: "http://example.com/cover.png" },
    } as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = {
      imageAssetName: "treasure-hunt-1",
      gamePrice: { priceRate: 150 },
    } as MinimalGameConfigT;

    const result = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    expect(result).toEqual({
      imageSource: imagesSourceMap["treasure-hunt-1"],
      height: 200,
    });
    expect(result).not.toHaveProperty("imgLabelProps");
  });

  it("adds free label when gamePrice.priceRate is 0", () => {
    const imagesSourceMap = {
      ["treasure-hunt-1"]: { uri: "http://example.com/cover.png" },
    } as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = {
      imageAssetName: "treasure-hunt-1",
      gamePrice: { priceRate: 0 },
    } as MinimalGameConfigT;

    const result = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    expect(result).toEqual({
      imageSource: imagesSourceMap["treasure-hunt-1"],
      height: 200,
      imgLabelProps: {
        text: "free",
        textColor: "white",
        backgroundColor: "green",
      },
      imgLabelPosition: "top-start",
    });
  });

  it("uses imageUrl when imageAssetName is not provided", () => {
    const imagesSourceMap = {} as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = {
      imageUrl: "http://example.com/from-url.png",
      gamePrice: { priceRate: 100 },
    } as MinimalGameConfigT;

    const result = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    expect(result).toEqual({
      height: 200,
      imageSource: "http://example.com/from-url.png",
    });
  });

  it("uses imageUrl when imageAssetName is not provided and marks as free when priceRate is 0", () => {
    const imagesSourceMap = {} as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = {
      imageUrl: "http://example.com/from-url.png",
      gamePrice: { priceRate: 0 },
    } as MinimalGameConfigT;

    const result = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    expect(result).toEqual({
      height: 200,
      imageSource: "http://example.com/from-url.png",
      imgLabelProps: {
        text: "free",
        textColor: "white",
        backgroundColor: "green",
      },
      imgLabelPosition: "top-start",
    });
  });

  it("uses imageUrl when imageAssetName is not provided and marks as free when price undefined", () => {
    const imagesSourceMap = {} as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = {
      gamePrice: "free",
      imageUrl: "http://example.com/from-url.png",
    } as MinimalGameConfigT;

    const result = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    expect(result).toEqual({
      height: 200,
      imageSource: "http://example.com/from-url.png",
      imgLabelProps: {
        text: "free",
        textColor: "white",
        backgroundColor: "green",
      },
      imgLabelPosition: "top-start",
    });
  });

  it("returns undefined when imageAssetName is provided but not found in imagesSourceMap (imageUrl is ignored)", () => {
    const imagesSourceMap = {} as Record<AppImageAssetT, RnuiImageSourceT>;

    const minimalGameConfig = {
      imageAssetName: "missingAsset",
      imageUrl: "http://example.com/from-url.png",
    } as unknown as MinimalGameConfigT;

    const result = getMinimalGameConfigImageProps(minimalGameConfig, imagesSourceMap);

    expect(result).toBeUndefined();
  });
});