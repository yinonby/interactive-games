
import { StyleSheet } from 'react-native';

export const useGenericStyles = () => StyleSheet.create({
  spacing: {
    gap: 8,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flexRowReverse: {
    flexDirection: 'row-reverse',
    alignItems: "center",
    gap: 8,
  },
  flexRowAlignTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
  spacingBottom: {
    marginBottom: 8,
  },
  alignTextToTableCell: {
    paddingStart: 16,
  }
});
