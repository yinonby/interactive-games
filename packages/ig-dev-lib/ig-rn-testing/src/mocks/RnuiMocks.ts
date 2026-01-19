
export const initRnuiMocks = () => {
  jest.mock("@ig/rnui", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text, View } = require('react-native');
    const React = require('react');

    const RnuiButton = (props: any) => {
      // Render a View wrapping the children in a Text
      return React.createElement(
        View,
        props,
        React.createElement(Text, null, props.children)
      );
    };

    return {
      RnuiText: Text,
      RnuiButton: RnuiButton,
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
