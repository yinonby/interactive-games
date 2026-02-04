
import { type FC } from 'react';
import { StyleSheet } from 'react-native';
import { DataTable, type DataTableTitleProps } from 'react-native-paper';
import { useRnuiContext } from '../theme/RnuiProvider';

export type RnuiTableTitlePropsT = Omit<DataTableTitleProps, "numeric"> & {
  endContent?: boolean,
  dense?: boolean,
};

export const RnuiTableTitle: FC<RnuiTableTitlePropsT> = ({ children, ...props }) => {
  const {
    style,
    endContent,
    dense,
    ...restProps
  } = props;
  const { rnuiStyles } = useRnuiContext();
  const contentHeight = 24;

  return (
    <DataTable.Title
      testID='DataTableTitle-tid'
      numeric={endContent}
      style={[
        style,
        dense && (
          rnuiStyles.tableRow?.denseMinHeight ?
          { paddingVertical: (Math.max(0, rnuiStyles.tableRow?.denseMinHeight - contentHeight)) / 2 } :
          styles.dense),
      ]}
      {...restProps}
    >
      {children}
    </DataTable.Title>
  );
};

const styles = StyleSheet.create({
  dense: {
    paddingVertical: 4,
  },
});
