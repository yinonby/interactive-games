
import { type FC } from 'react';
import type { PlatformUiLinkPropsT } from "../types/PlatformUiLinkTypes";
import { PlatformUiExpoLink } from "./PlatformUiExpoLink";

export const PlatformUiLink: FC<PlatformUiLinkPropsT> = ({
  ...props
}) => {
  return (
    <PlatformUiExpoLink {...props} />
  );
};
