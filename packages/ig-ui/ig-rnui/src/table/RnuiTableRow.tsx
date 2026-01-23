
import { type FC } from 'react';
import { StyleSheet } from 'react-native';
import { DataTable, type DataTableRowProps } from 'react-native-paper';
import { useRnuiContext } from '../theme/RnuiProvider';

export type RnuiTableRowPropsT = DataTableRowProps & {
  noHorizontalPadding?: boolean,
  dense?: boolean,
};

export const RnuiTableRow: FC<RnuiTableRowPropsT> = ({ children, ...props }) => {
  const {
    style,
    noHorizontalPadding,
    dense,
    ...restProps
  } = props;
  const { rnuiStyles } = useRnuiContext();

  return (
    <DataTable.Row
      testID='DataTableRow-tid'
      style={[
        style,
        noHorizontalPadding && styles.noHorizontalPadding,
        dense && (
          rnuiStyles.tableRow?.denseMinHeight ?
          { minHeight: rnuiStyles.tableRow?.denseMinHeight } :
          styles.dense),
      ]}
      {...restProps}
    >
      {children}
    </DataTable.Row>
  );
};

const styles = StyleSheet.create({
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  dense: {
    minHeight: 32,
  },
});
