
import { type FC } from 'react';
import { DataTable, type DataTableCellProps } from 'react-native-paper';

export type RnuiTableCellPropsT = Omit<DataTableCellProps, "numeric"> & {
  endContent?: boolean,
};

export const RnuiTableCell: FC<RnuiTableCellPropsT> = ({ endContent, children, ...props }) => {
  return <DataTable.Cell numeric={endContent} {...props}>{children}</DataTable.Cell>;
};
