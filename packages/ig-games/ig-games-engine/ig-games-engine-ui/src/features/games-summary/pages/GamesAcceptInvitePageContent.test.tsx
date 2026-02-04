
import { render } from '@testing-library/react-native';
import React from 'react';
import { GamesAcceptInvitePageContent } from './GamesAcceptInvitePageContent';

// mocks
jest.mock("../components/accept-invite/GamesAcceptInviteView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GamesAcceptInviteView: View,
  };
});

describe("JoinableGameCardView", () => {
  it("renders properly", async () => {
    const { queryByTestId } = render(
      <GamesAcceptInvitePageContent invitationCode="invt-1"/>
    );

    expect(queryByTestId("app-content-tid")).toBeTruthy();
    const acceptInviteView = queryByTestId("games-accept-invite-view-tid");
    expect(acceptInviteView).toBeTruthy();
    expect(acceptInviteView.props.invitationCode).toBe("invt-1");
  });

});
