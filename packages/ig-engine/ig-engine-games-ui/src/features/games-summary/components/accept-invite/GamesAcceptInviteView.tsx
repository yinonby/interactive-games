
import { useAppConfig, useAppErrorHandling } from "@ig/engine-app-ui";
import type { GameInstanceIdT } from "@ig/engine-models";
import { usePlatformUiNavigation } from "@ig/platform-ui";
import { RnuiActivityIndicator } from "@ig/rnui";
import React, { useEffect, type FC } from 'react';
import { Text, View } from "react-native";
import { useGamesUserConfigController } from "../../../../domains/user-config/controller/user-actions/GamesUserConfigController";

export type GamesAcceptInviteViewPropsT = {
  invitationCode: string,
  testID?: string
};

export const GamesAcceptInviteView: FC<GamesAcceptInviteViewPropsT> = ({ invitationCode }) => {
  const { onAcceptInvite } = useGamesUserConfigController();
  const { navigateReplace } = usePlatformUiNavigation();
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const { onUnknownError } = useAppErrorHandling();

  useEffect(() => {
    if (!invitationCode) return;

    const acceptInvite = async () => {
      try {
        const gameInstanceId: GameInstanceIdT = await onAcceptInvite(invitationCode);

        const url = gamesUiUrlPathsAdapter.buildGameInstanceDashboardUrlPath(gameInstanceId);
        navigateReplace(url);
      } catch (e) {
        onUnknownError(e);

        const url = gamesUiUrlPathsAdapter.buildGamesDashboardUrlPath();
        navigateReplace(url);
      }
    };

    acceptInvite();
  }, [invitationCode]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <RnuiActivityIndicator testID="activity-indicator-tid" />
      <Text testID="activity-message-tid">Accepting invitation...</Text>
    </View>
  );
};
