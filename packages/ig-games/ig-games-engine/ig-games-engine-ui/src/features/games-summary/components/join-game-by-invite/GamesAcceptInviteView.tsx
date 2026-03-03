
import { useAppConfig, useAppErrorHandling } from '@ig/app-engine-ui';
import type { GameInstanceIdT } from '@ig/games-engine-models';
import { usePlatformUiNavigation } from '@ig/platform-ui';
import { RnuiActivityIndicator } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { Text, View } from 'react-native';
import {
  useGameInstanceController
} from '../../../../domains/game-instance/controller/user-actions/GameInstanceController';

export type GamesAcceptInviteViewPropsT = {
  invitationCode: string,
  testID?: string
};

export const GamesAcceptInviteView: FC<GamesAcceptInviteViewPropsT> = ({ invitationCode }) => {
  const { onJoinGameByInvite } = useGameInstanceController();
  const { navigateReplace } = usePlatformUiNavigation();
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const { onUnknownError } = useAppErrorHandling();

  useEffect(() => {
    if (!invitationCode) return;

    const joinGameByInvite = async () => {
      try {
        const gameInstanceId: GameInstanceIdT = await onJoinGameByInvite(invitationCode);

        const url = gamesUiUrlPathsAdapter.buildGameInstanceDashboardUrlPath(gameInstanceId);
        navigateReplace(url);
      } catch (e) {
        onUnknownError(e);

        const url = gamesUiUrlPathsAdapter.buildGamesDashboardUrlPath();
        navigateReplace(url);
      }
    };

    joinGameByInvite();
  }, [invitationCode]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <RnuiActivityIndicator testID="activity-indicator-tid" />
      <Text testID="activity-message-tid">Accepting invitation...</Text>
    </View>
  );
};
