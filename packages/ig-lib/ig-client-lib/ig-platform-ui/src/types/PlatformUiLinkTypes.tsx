
import { type ReactNode } from 'react';

export type TestableComponentT = {
  testID?: string;
};

export type PlatformUiLinkPropsT = TestableComponentT & {
  href: string,
  push?: boolean,
  asChild?: boolean,
  children: ReactNode | ReactNode[],
}
