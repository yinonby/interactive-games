
import { type FC } from 'react';
import type { TextStyle } from "react-native";
import { Button as RnpButton, ButtonProps as RnpButtonProps } from 'react-native-paper';
import { useRnuiContext } from "../theme/RnuiProvider";

export type RnuiButtonPropsT = RnpButtonProps & {
  size?: "xs" | "small" | "medium",
};

export const RnuiButton: FC<RnuiButtonPropsT> = ({
  size,
  mode = 'contained', // default mode
  uppercase = false,  // default PaperButton behavior override
  ...props
}) => {
  const { rnuiStyles } = useRnuiContext();
  let labelStyle: TextStyle | undefined = undefined;
  if (size === "xs") {
    labelStyle = rnuiStyles.xsButtonLabelStyle || {
      margin: 8,
      fontSize: 12,
      lineHeight: 16,
    }
  }

  return (
    <RnpButton
      testID="btn-tid"
      style={{ minWidth: size === "xs" ? 48 : undefined }}
      labelStyle={labelStyle}
      mode={mode}
      uppercase={uppercase}
      {...props}
    />
  );
};
