
import React, { ReactElement } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export type RnuiAppContentPropsT = {
  children: ReactElement | ReactElement[],
  testID?: string,
};

export const RnuiAppContent: React.FC<RnuiAppContentPropsT> = ({ children }) => {
  return (
    <ScrollView style={styles.container} testID="scroll-view-tid" >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: "100%",
    padding: 24,
  },
});
