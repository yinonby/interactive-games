
import { RnuiAppContent } from "@ig/rnui";
import React, { type FC } from 'react';
import { GamesAcceptInviteView } from "../components/accept-invite/GamesAcceptInviteView";

export const GamesAcceptInvitePageContent: FC<{ invitationCode: string }> = ({ invitationCode }) => {
  return (
    <RnuiAppContent testID="app-content-tid">
      <GamesAcceptInviteView testID="games-accept-invite-view-tid" invitationCode={invitationCode} />
    </RnuiAppContent>
  );
};
