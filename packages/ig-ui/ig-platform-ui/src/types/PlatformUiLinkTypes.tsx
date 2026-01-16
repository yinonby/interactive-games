
import { type ReactNode } from 'react';

export type PlatformUiLinkPropsT = {
  href: string,
  push?: boolean,
  asChild?: boolean,
  children: ReactNode | ReactNode[],
}
