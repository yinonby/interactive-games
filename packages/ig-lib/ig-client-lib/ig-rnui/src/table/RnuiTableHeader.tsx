
import { type FC } from 'react';
import { StyleSheet } from 'react-native';
import { DataTable, type DataTableHeaderProps } from 'react-native-paper';

export type RnuiTableHeaderPropsT = DataTableHeaderProps & {
  noHorizontalPadding?: boolean,
};

export const RnuiTableHeader: FC<RnuiTableHeaderPropsT> = ({ children, ...props }) => {
  const {
    style,
    noHorizontalPadding,
    ...restProps
  } = props;
  return (
    <DataTable.Header
      testID='DataTableHeader-tid'
      style={[
        style,
        noHorizontalPadding && styles.noHorizontalPadding,
      ]}
      {...restProps}
    >
      {children}
    </DataTable.Header>
  );
};

const styles = StyleSheet.create({
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
});
