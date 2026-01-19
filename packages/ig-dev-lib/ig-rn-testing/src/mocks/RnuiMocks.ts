
export const initRnuiMocks = () => {
  jest.mock("@ig/rnui", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text, View } = require('react-native');

    return {
      RnuiText: Text,
      RnuiButton: View,
      RnuiIconButton: View,
      RnuiProvider: View,
      RnuiCard: View,
      RnuiGrid: View,
      RnuiMasonryGrid: View,
      RnuiGridItem: View,
      RnuiBlinker: View,
      RnuiTextInput: View,
      RnuiTableRow: View,
      RnuiTableCell: View,
      RnuiTable: View,
      RnuiTableHeader: View,
      RnuiTableTitle: View,
      RnuiAppContent: View,
      RnuiCopyToClipboard: View,
      RnuiQrCode: View,
      RnuiActivityIndicator: View,
      useRnuiSnackbar: jest.fn(),
    };
  });
}
