
import { useAppConfig, useClientLogger } from "@ig/engine-app-ui";
import type { GameInstanceIdT } from "@ig/engine-models";
import { usePlatformUiNavigation } from "@ig/platform-ui";
import { RnuiActivityIndicator } from "@ig/rnui";
import React, { useEffect, type FC } from 'react';
import { Text, View } from "react-native";
import { useUserConfigController } from "../../../../domains/user-config/controller/user-actions/UserConfigController";

export type GamesAcceptInviteViewPropsT = {
  invitationCode: string,
  testID?: string
};

export const GamesAcceptInviteView: FC<GamesAcceptInviteViewPropsT> = ({ invitationCode }) => {
  const { onAcceptInvite } = useUserConfigController();
  const { navigateReplace } = usePlatformUiNavigation();
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const logger = useClientLogger();

  useEffect(() => {
    if (!invitationCode) return;

    const acceptInvite = async () => {
      try {
        const gameInstanceId: GameInstanceIdT | null = await onAcceptInvite(invitationCode);

        if (gameInstanceId === null) throw new Error("Invite failed");

        const url = gamesUiUrlPathsAdapter.buildGameInstanceDashboardUrlPath(gameInstanceId);
        navigateReplace(url);
      } catch (e) {
        logger.error(e);

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
