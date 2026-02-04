
import { type FC } from 'react';
import { Text as RnpText, TextProps as RnpTextProps } from 'react-native-paper';

export type RnuiTextPropsT = RnpTextProps<string> & {
  size?: "small" | "medium",
}

export const RnuiText: FC<RnuiTextPropsT> = ({
  ...props
}) => {
  return (
    <RnpText
      {...props}
    />
  );
};
