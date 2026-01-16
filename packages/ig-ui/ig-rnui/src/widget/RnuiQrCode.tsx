
import { type FC } from 'react';
import QRCodeStyled, { type SVGQRCodeStyledProps } from "react-native-qrcode-styled";

export type RnuiQrCodePropsT = SVGQRCodeStyledProps;

export const RnuiQrCode: FC<RnuiQrCodePropsT> = (props) => {
  return (
    <QRCodeStyled testID="qr-code-tid" {...props}/>
  );
};
