
import type { GameInstanceIdT } from "@ig/engine-models";
import { usePlatformUiNavigation } from "@ig/platform-ui";
import React, { useEffect, type FC } from 'react';
import { ActivityIndicator, Text, View } from "react-native";
import { useGameContext } from "../../../../app/layout/GameContextProvider";
import { useClientLogger } from "../../../../app/providers/useClientLogger";
import { useUserConfigController } from "../../../../domains/user-config/controller/user-actions/UserConfigController";

export type GamesAcceptInviteViewPropsT = {
  invitationCode: string,
  testID?: string
};

export const GamesAcceptInviteView: FC<GamesAcceptInviteViewPropsT> = ({ invitationCode }) => {
  const { onAcceptInvite } = useUserConfigController();
  const { navigateReplace } = usePlatformUiNavigation();
  const { gameUiUrlPathsAdapter } = useGameContext();
  const logger = useClientLogger();

  useEffect(() => {
    if (!invitationCode) return;

    const acceptInvite = async () => {
      try {
        const gameInstanceId: GameInstanceIdT | null = await onAcceptInvite(invitationCode);

        if (gameInstanceId === null) throw new Error("Invite failed");

        const url = gameUiUrlPathsAdapter.buildGameInstanceDashboardUrlPath(gameInstanceId);
        navigateReplace(url);
      } catch (e) {
        logger.error(e);

        const url = gameUiUrlPathsAdapter.buildGamesDashboardUrlPath();
        navigateReplace(url);
      }
    };

    acceptInvite();
  }, [invitationCode]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator testID="activity-indicator-tid" />
      <Text testID="activity-message-tid">Accepting invitation...</Text>
    </View>
  );
};
