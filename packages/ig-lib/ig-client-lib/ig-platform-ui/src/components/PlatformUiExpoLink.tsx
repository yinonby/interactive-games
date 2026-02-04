
import { Link as ExpoLink } from 'expo-router';
import { type FC } from 'react';
import type { PlatformUiLinkPropsT } from '../types/PlatformUiLinkTypes';

export const PlatformUiExpoLink: FC<PlatformUiLinkPropsT> = ({ href, push, asChild, children }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ExpoLink href={href as any} push={push} asChild={asChild} >{children}</ExpoLink>
  );
};
