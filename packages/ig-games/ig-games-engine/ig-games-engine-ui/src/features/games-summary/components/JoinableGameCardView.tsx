
import { useAppConfig, useAppErrorHandling, useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { MinimalGameInfoT } from '@ig/games-engine-models';
import { usePlatformUiNavigation } from '@ig/platform-ui';
import { RnuiButton, RnuiTable, RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import { View } from 'react-native';
import {
  useGamesUserConfigController
} from '../../../domains/user-config/controller/user-actions/GamesUserConfigController';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameImageCard } from '../../common/game-info/GameImageCard';
import { MinimalGameInfoTableRows } from './MinimalGameInfoTableRows';

export type JoinableGameCardViewPropsT = TestableComponentT & {
  minimalGameInfo: MinimalGameInfoT,
};

export const JoinableGameCardView: FC<JoinableGameCardViewPropsT> = ({ minimalGameInfo }) => {
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const { t } = useAppLocalization();
  const { onPlayGame } = useGamesUserConfigController();
  const { navigate } = usePlatformUiNavigation();
  const { onUnknownError } = useAppErrorHandling();
  const genericStyles = useGenericStyles();

  const handlePlayGamePress = async (): Promise<void> => {
    try {
      await onPlayGame(minimalGameInfo.gameConfigId);
      const url = gamesUiUrlPathsAdapter.buildGameDashboardUrlPath(minimalGameInfo.gameConfigId);
      navigate(url);
    } catch (error: unknown) {
      onUnknownError(error);
    }
  }

  return (
    <GameImageCard testID='GameImageCard-tid' minimalGameInfo={minimalGameInfo} includeFreeLabel>
      <View style={genericStyles.spacing}>
        <RnuiText variant="titleSmall">
          {minimalGameInfo.gameName}
        </RnuiText>

        <RnuiTable>
          <MinimalGameInfoTableRows testID='MinimalGameInfoTableRows-tid' minimalGameInfo={minimalGameInfo} />
        </RnuiTable>

        <View style={{ flexDirection: "row" }}>
          <RnuiButton testID="play-game-btn-tid" size="xs" mode="outlined" onPress={handlePlayGamePress}>
            {t("games:play")}
          </RnuiButton>
        </View>
      </View>
    </GameImageCard>
  );
};
