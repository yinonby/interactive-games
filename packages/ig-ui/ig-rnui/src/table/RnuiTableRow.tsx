
import { type FC } from 'react';
import { DataTable, type DataTableRowProps } from 'react-native-paper';

export type RnuiTableRowPropsT = DataTableRowProps;

export const RnuiTableRow: FC<RnuiTableRowPropsT> = ({ children, ...props }) => {
  return <DataTable.Row {...props}>{children}</DataTable.Row>;
};
