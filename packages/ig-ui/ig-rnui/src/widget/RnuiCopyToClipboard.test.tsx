
import { fireEvent, render } from '@testing-library/react-native';
import { RnuiCopyToClipboard } from "./RnuiCopyToClipboard";

//  mocks

jest.mock("@react-native-clipboard/clipboard", () => {
  return {
    setString: jest.fn(),
  }
});

jest.mock("../button/RnuiButton", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    RnuiButton: View,
  };
});

jest.mock("../button/RnuiIconButton", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    RnuiIconButton: View,
  };
});

// import afterm mocks

import * as Clipboard from "@react-native-clipboard/clipboard";

// tests

describe("RnuiCopyToClipboard", () => {
  const setStringSpy = jest.spyOn(Clipboard.default, "setString");

  beforeEach(() => {
    jest.clearAllMocks();
    setStringSpy.mockImplementation(jest.fn());
  });

  it("renders RnuiCopyToClipboard with icon button", () => {
    const { getByTestId } = render(
      <RnuiCopyToClipboard copyText="aaa"/>
    );

    const btn = getByTestId("icon-btn-id");
    fireEvent.press(btn);
    expect(setStringSpy).toHaveBeenCalledWith("aaa");
  });

  it("renders RnuiCopyToClipboard with text button", () => {
    const { getByTestId } = render(
      <RnuiCopyToClipboard copyText="bbb" text="Copy Me"/>
    );

    const btn = getByTestId("btn-id");
    fireEvent.press(btn);
    expect(setStringSpy).toHaveBeenCalledWith("bbb");
  });
});
