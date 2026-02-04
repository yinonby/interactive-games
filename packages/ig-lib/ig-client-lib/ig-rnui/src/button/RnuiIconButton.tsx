
import { type FC } from 'react';
import { IconButton as RnpIconButton, IconButtonProps as RnpIconButtonProps } from 'react-native-paper';
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export type RnuiIconSourceT = IconSource;

export type RnuiIconButtonPropsT = Omit<RnpIconButtonProps, "icon" | "size"> & {
  size?: "xs" | "small" | "medium",
  icon: RnuiIconSourceT,
};

export const RnuiIconButton: FC<RnuiIconButtonPropsT> = ({
  size,
  mode = 'contained', // default mode
  ...props
}) => {
  return (
    <RnpIconButton
      testID="icon-btn-tid"
      size={size === "xs" ? 16 : (size === "small" ? 24 : 32)}
      mode={mode}
      {...props}
    />
  );
};
