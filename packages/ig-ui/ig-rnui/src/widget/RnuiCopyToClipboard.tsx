
import Clipboard from '@react-native-clipboard/clipboard';
import { type FC } from 'react';
import { RnuiButton } from "../button/RnuiButton";
import { RnuiIconButton } from "../button/RnuiIconButton";
import type { TestableComponentT } from "../types/ComponentTypes";

export type RnuiCopyToClipboardPropsT = TestableComponentT & {
  copyText: string,
  text?: string,
  size?: "xs" | "small" | "medium",
};

export const RnuiCopyToClipboard: FC<RnuiCopyToClipboardPropsT> = ({ copyText, text, size = "small" }) => {
  const handlePress = () => {
    Clipboard.setString(copyText);
  };

  if (text) {
    return (
      <RnuiButton testID="btn-id" size={size} onPress={handlePress}>{text}</RnuiButton>
    );
  }
  return (
    <RnuiIconButton testID="icon-btn-id" size={size} icon="content-copy" onPress={handlePress} />
  );
};
