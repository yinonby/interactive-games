
import { type FC } from 'react';
import { DataTable, type DataTableHeaderProps } from 'react-native-paper';

export type RnuiTableHeaderPropsT = DataTableHeaderProps;

export const RnuiTableHeader: FC<RnuiTableHeaderPropsT> = ({ children, ...props }) => {
  return <DataTable.Header {...props}>{children}</DataTable.Header>;
};
