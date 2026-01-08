
import { FC } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View
} from "react-native";
import type { RnuiLabelPropsT, TestableComponentT } from "../types/ComponentTypes";
import { RnuiLabel } from "./RnuiLabel";

export type RnuiImageSourceT = ImageSourcePropType;

export type RnuiImagePropsT = TestableComponentT & {
  imageSource: RnuiImageSourceT | string;
  height?: number;
  imgLabelProps?: RnuiLabelPropsT;
  imgLabelPosition?: "top-start" | "top-end";
};

export const RnuiImage: FC<RnuiImagePropsT> = ({
  imageSource,
  height = 180,
  imgLabelProps,
  imgLabelPosition = "top-start",
}) => {
  const actualImageSource: ImageSourcePropType = typeof imageSource === "string" ?
    { uri: imageSource } : imageSource;

  return (
    <View testID="container-tid" style={[styles.container, { height }]}>
      <Image testID="image-tid" source={actualImageSource} style={styles.image} resizeMode="cover" />

      {imgLabelProps &&
        <View
          testID="label-container"
          style={[
            styles.labelContainer,
            imgLabelPosition === "top-start" && styles.labelTopStart,
            imgLabelPosition === "top-end" && styles.labelTopEnd,
          ]}
        >
          <RnuiLabel {...imgLabelProps} />
        </View>
      }
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  labelContainer: {
    position: "absolute",
  },
  labelTopStart: {
    top: 8,
    start: 8,
  },
  labelTopEnd: {
    top: 8,
    end: 8,
  },
});
