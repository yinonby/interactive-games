
import { FC, ReactNode } from "react";

export type RnuiGridItemPropsT = {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  children?: ReactNode;
  testID?: string;
};

export const RnuiGridItem: FC<RnuiGridItemPropsT> = ({ children }) => {
  return <>{children}</>;
};
