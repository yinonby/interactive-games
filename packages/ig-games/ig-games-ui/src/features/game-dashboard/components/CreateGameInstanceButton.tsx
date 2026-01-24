
import { useAppConfig, useAppErrorHandling, useAppLocalization } from "@ig/engine-ui";
import type { GameConfigIdT, GameInstanceIdT } from '@ig/games-models';
import { usePlatformUiNavigation } from '@ig/platform-ui';
import { RnuiButton } from "@ig/rnui";
import React, { type FC } from 'react';
import {
    useGamesUserConfigController
} from '../../../domains/user-config/controller/user-actions/GamesUserConfigController';
import type { TestableComponentT } from '../../../types/ComponentTypes';

export type CreateGameInstanceButtonPropsT = TestableComponentT & {
  gameConfigId: GameConfigIdT,
};

export const CreateGameInstanceButton: FC<CreateGameInstanceButtonPropsT> = ({ gameConfigId }) => {
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const { t } = useAppLocalization();
  const { onCreateGameInstance } = useGamesUserConfigController();
  const { navigate } = usePlatformUiNavigation();
  const { onUnknownError } = useAppErrorHandling();

  const handleCreateGameInstance = async (): Promise<void> => {
    try {
      const gameInstanceId: GameInstanceIdT = await onCreateGameInstance(gameConfigId);
      const url = gamesUiUrlPathsAdapter.buildGameInstanceDashboardUrlPath(gameInstanceId);
      navigate(url);
    } catch (error: unknown) {
      onUnknownError(error);
    }
  }

  return (
    <RnuiButton testID="RnuiButton-tid" size="xs" mode="outlined" onPress={handleCreateGameInstance}>
      {t("games:createNewPlayersGroup")}
    </RnuiButton>
  );
};
