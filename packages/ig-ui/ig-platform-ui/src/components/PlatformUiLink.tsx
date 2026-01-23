
import { type FC } from 'react';
import { View } from 'react-native';
import type { PlatformUiLinkPropsT } from "../types/PlatformUiLinkTypes";
import { PlatformUiExpoLink } from "./PlatformUiExpoLink";

export const PlatformUiLink: FC<PlatformUiLinkPropsT> = ({
  ...props
}) => {
  return (
    <View testID={props.testID}>
      <PlatformUiExpoLink {...props} />
    </View>
  );
};
