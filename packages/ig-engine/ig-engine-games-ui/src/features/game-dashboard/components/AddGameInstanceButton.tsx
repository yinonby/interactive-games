
import { useAppConfig, useAppErrorHandling, useAppLocalization } from "@ig/engine-app-ui";
import type { GameConfigIdT, GameInstanceIdT } from "@ig/engine-models";
import { usePlatformUiNavigation } from '@ig/platform-ui';
import { RnuiButton } from "@ig/rnui";
import React, { type FC } from 'react';
import {
  useGamesUserConfigController
} from '../../../domains/user-config/controller/user-actions/GamesUserConfigController';
import type { TestableComponentT } from '../../../types/ComponentTypes';

export type AddGameInstanceButtonPropsT = TestableComponentT & {
  gameConfigId: GameConfigIdT,
};

export const AddGameInstanceButton: FC<AddGameInstanceButtonPropsT> = ({ gameConfigId }) => {
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const { t } = useAppLocalization();
  const { onAddGameInstance } = useGamesUserConfigController();
  const { navigate } = usePlatformUiNavigation();
  const { onUnknownError } = useAppErrorHandling();

  const handleAddGameInstance = async (): Promise<void> => {
    try {
      const gameInstanceId: GameInstanceIdT = await onAddGameInstance(gameConfigId);
      const url = gamesUiUrlPathsAdapter.buildGameInstanceDashboardUrlPath(gameInstanceId);
      navigate(url);
    } catch (error: unknown) {
      onUnknownError(error);
    }
  }

  return (
    <RnuiButton testID="RnuiButton-tid" size="xs" mode="outlined" onPress={handleAddGameInstance}>
      {t("games:createNewPlayersGroup")}
    </RnuiButton>
  );
};
