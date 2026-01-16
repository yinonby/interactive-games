
import { FC, ReactNode } from "react";
import { StyleSheet, View, type DimensionValue } from "react-native";
import { RnuiImage, RnuiImagePropsT } from "../image/RnuiImage";

export type RnuiCardPropsT = {
  height?: DimensionValue;
  imageProps?: RnuiImagePropsT;
  children?: ReactNode;
  testID?: string;
};

export const RnuiCard: FC<RnuiCardPropsT> = ({
  height,
  imageProps,
  children,
}) => {
  return (
    <View testID="container-tid" style={[styles.card, { height }]}>
      {imageProps && <RnuiImage testID="image-tid" {...imageProps} />}

      <View testID="content-tid" style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  content: {
    padding: 12,
    flexGrow: 1,
  },
});
