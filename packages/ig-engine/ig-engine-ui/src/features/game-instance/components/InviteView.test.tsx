
import type { GameConfigIdT, GameInstanceExposedInfoT } from "@ig/engine-models";
import { fireEvent, render } from "@testing-library/react-native";
import React, { act } from "react";
import { buildMockedTranslation } from "../../../app/localization/__mocks__/AppLocalizationProvider";
import { InviteView } from "./InviteView";

// mocks

jest.mock("../../../app/layout/AppConfigProvider", () => ({
  useAppConfig: () => ({ gameUiConfig: { appUrl: "https://example.com" } }),
}));

// tests

describe("InviteView", () => {
  const baseGameInstance: GameInstanceExposedInfoT = {
    invitationCode: "ABC123",
    gameConfig: { maxParticipants: 4 } as unknown as GameConfigIdT,
    otherPlayerExposedInfos: [],
  } as unknown as GameInstanceExposedInfoT;

  it("renders component properly", () => {
    const { getByTestId, getByText } = render(
      <InviteView gameInstanceExposedInfo={baseGameInstance} />
    );

    getByTestId("invite-code-title-tid");
    getByText(buildMockedTranslation("games:invitationCode") + ":");

    const codeText = getByTestId("invite-code-tid");
    expect(codeText.props.children).toBe("ABC123");

    const copyToClipboardCode = getByTestId("copy-to-clipboard-code-tid");
    expect(copyToClipboardCode.props.copyText).toBe("ABC123");

    const copyToClipboardLink = getByTestId("copy-to-clipboard-link-tid");
    expect(copyToClipboardLink.props.copyText).toBe("https://example.com/games/accept-invite/ABC123");
    expect(copyToClipboardLink.props.text).toBe(buildMockedTranslation("common:copyLink"));

    const shareButton = getByTestId("share-btn-tid");
    expect(shareButton.props.disabled).toBe(false);
    getByText(buildMockedTranslation("common:share"));

    const qrCode = getByTestId("qr-code-tid");
    expect(qrCode.props.data).toBe("https://example.com/games/accept-invite/ABC123");
  });

  it("handles press share link", async () => {
    const { getByTestId } = render(
      <InviteView gameInstanceExposedInfo={baseGameInstance} />
    );

    const shareButton = getByTestId("share-btn-tid");
    expect(shareButton.props.disabled).toBe(false);

    await act(async () => {
      fireEvent.press(shareButton);
    });
  });
});
