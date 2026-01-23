
import { type FC } from 'react';
import { DataTable, DataTableProps } from 'react-native-paper';

export type RnuiTablePropsT = DataTableProps;

export const RnuiTable: FC<RnuiTablePropsT> = ({ children, ...props }) => {
  return <DataTable testID='DataTable-tid' {...props}>{children}</DataTable>;
};
