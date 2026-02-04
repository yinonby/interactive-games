
import { render } from '@testing-library/react-native';
import { RnuiQrCode } from './RnuiQrCode';

//  mocks

jest.mock("react-native-qrcode-styled", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return View
});

describe("RnuiQrCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders RnuiQrCode with icon button", () => {
    const { getByTestId } = render(
      <RnuiQrCode/>
    );

    const qrCode = getByTestId("qr-code-tid");
    expect(qrCode).toBeTruthy();
  });
});
