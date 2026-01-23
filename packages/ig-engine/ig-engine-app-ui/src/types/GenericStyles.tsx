
import { StyleSheet } from 'react-native';

export const useGenericStyles = () => StyleSheet.create({
  verticalSpacing: {
    gap: 8,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexRowReverse: {
    flexDirection: 'row-reverse',
    alignItems: "center",
  },
  flexRowAlignTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  flex1: {
    flex: 1,
  },
  spacingBottom: {
    marginBottom: 8,
  },
  spacingEnd: {
    marginEnd: 8,
  },
  alignTextToTableCell: {
    paddingStart: 16,
  }
});
