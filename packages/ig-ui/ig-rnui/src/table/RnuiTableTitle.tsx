
import { type FC } from 'react';
import { DataTable, type DataTableTitleProps } from 'react-native-paper';

export type RnuiTableTitlePropsT = Omit<DataTableTitleProps, "numeric"> & {
  endContent?: boolean,
};

export const RnuiTableTitle: FC<RnuiTableTitlePropsT> = ({ endContent, children, ...props }) => {
  return <DataTable.Title numeric={endContent} {...props}>{children}</DataTable.Title>;
};
