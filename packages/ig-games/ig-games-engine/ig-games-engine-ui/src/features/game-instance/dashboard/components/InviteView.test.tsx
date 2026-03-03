
import { useAppConfig } from '@ig/app-engine-ui';
import { buildMockedTranslation } from '@ig/app-engine-ui/test-utils';
import type { GameConfigIdT, PublicGameInstanceT } from '@ig/games-engine-models';
import { fireEvent, render } from '@testing-library/react-native';
import React, { act } from 'react';
import { InviteView } from './InviteView';

// tests

describe("InviteView", () => {
  const baseGameInstance: PublicGameInstanceT = {
    invitationCode: "ABC123",
    publicGameConfig: { maxParticipants: 4 } as unknown as GameConfigIdT,
    publicPlayerInfos: [],
  } as unknown as PublicGameInstanceT;

  it("renders component properly", () => {
    const { gameUiConfig } = useAppConfig();

    const { getByTestId, getByText } = render(
      <InviteView publicGameInstance={baseGameInstance} />
    );

    getByTestId("invite-code-title-tid");
    getByText(buildMockedTranslation("games:invitationCode") + ":");

    const codeText = getByTestId("invite-code-tid");
    expect(codeText.props.children).toBe("ABC123");

    const copyToClipboardCode = getByTestId("copy-to-clipboard-code-tid");
    expect(copyToClipboardCode.props.copyText).toBe("ABC123");

    const copyToClipboardLink = getByTestId("copy-to-clipboard-link-tid");
    expect(copyToClipboardLink.props.copyText).toBe(gameUiConfig.apiUrl + "/games/accept-invite/ABC123");
    expect(copyToClipboardLink.props.text).toBe(buildMockedTranslation("common:copyLink"));

    const shareButton = getByTestId("share-btn-tid");
    expect(shareButton.props.disabled).toBe(false);
    getByText(buildMockedTranslation("common:share"));

    const qrCode = getByTestId("qr-code-tid");
    expect(qrCode.props.data).toBe(gameUiConfig.apiUrl + "/games/accept-invite/ABC123");
  });

  it("handles press share link", async () => {
    const { getByTestId } = render(
      <InviteView publicGameInstance={baseGameInstance} />
    );

    const shareButton = getByTestId("share-btn-tid");
    expect(shareButton.props.disabled).toBe(false);

    await act(async () => {
      fireEvent.press(shareButton);
    });
  });
});
