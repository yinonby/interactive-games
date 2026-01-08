
import { Link as ExpoLink } from "expo-router";
import { type FC } from 'react';
import type { PlatformUiLinkPropsT } from "../types/PlatformUiLinkTypes";

export const PlatformUiExpoLink: FC<PlatformUiLinkPropsT> = ({ href, push, asChild, children }) => {
  return (
    <ExpoLink href={href} push={push} asChild={asChild} >{children}</ExpoLink>
  );
};
