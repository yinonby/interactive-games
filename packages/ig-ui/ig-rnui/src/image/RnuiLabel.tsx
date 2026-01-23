
import type { FC } from "react";
import { type ViewStyle, StyleSheet, View } from "react-native";
import { RnuiText } from "../text/RnuiText";
import { useRnuiContext } from "../theme/RnuiProvider";
import type { RnuiLabelPropsT } from "../types/ComponentTypes";

export const RnuiLabel: FC<RnuiLabelPropsT> = (props) => {
  const { rnuiStyles } = useRnuiContext();
  const labelStyle: ViewStyle = {};

  // background color
  if (props.backgroundColor) {
    labelStyle.backgroundColor = props.backgroundColor;
  } else if (rnuiStyles.imageLabel?.backgroundColor) {
    labelStyle.backgroundColor = rnuiStyles.imageLabel.backgroundColor;
  }

  // border radius
  if (rnuiStyles.imageLabel?.borderRadius !== undefined) {
    labelStyle.borderRadius = rnuiStyles.imageLabel.borderRadius;
  }

  // padding
  if (rnuiStyles.imageLabel?.paddingHorizontal !== undefined) {
    labelStyle.paddingHorizontal = rnuiStyles.imageLabel.paddingHorizontal;
  }
  if (rnuiStyles.imageLabel?.paddingVertical !== undefined) {
    labelStyle.paddingVertical = rnuiStyles.imageLabel.paddingVertical;
  }

  return (
    <View
      testID="container-tid"
      style={[
        styles.label,
        labelStyle,
      ]}
    >
      <RnuiText testID="label-text-tid"
        style={[
          styles.labelText,
          (props.textColor || rnuiStyles.imageLabel?.textColor) && {
            color: props.textColor || rnuiStyles.imageLabel?.textColor
          }
        ]}
      >
        {props.text}
      </RnuiText>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "black",
  },
  labelText: {
    color: "white",
  },
});
