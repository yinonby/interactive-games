
import { useAppConfig, useAppErrorHandling, useAppLocalization, useGenericStyles } from "@ig/engine-app-ui";
import type { MinimalGameConfigT } from '@ig/games-models';
import { usePlatformUiNavigation } from "@ig/platform-ui";
import { RnuiButton, RnuiTable, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { View } from 'react-native';
import { useGamesUserConfigController } from "../../../domains/user-config/controller/user-actions/GamesUserConfigController";
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameImageCard } from '../../common/game-config/GameImageCard';
import { MinimalGameConfigTableRows } from './MinimalGameConfigTableRows';

export type JoinableGameCardViewPropsT = TestableComponentT & {
  minimalGameConfig: MinimalGameConfigT,
};

export const JoinableGameCardView: FC<JoinableGameCardViewPropsT> = ({ minimalGameConfig }) => {
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const { t } = useAppLocalization();
  const { onPlayGame } = useGamesUserConfigController();
  const { navigate } = usePlatformUiNavigation();
  const { onUnknownError } = useAppErrorHandling();
  const genericStyles = useGenericStyles();

  const handlePlayGamePress = async (): Promise<void> => {
    try {
      await onPlayGame(minimalGameConfig.gameConfigId);
      const url = gamesUiUrlPathsAdapter.buildGameDashboardUrlPath(minimalGameConfig.gameConfigId);
      navigate(url);
    } catch (error: unknown) {
      onUnknownError(error);
    }
  }

  return (
    <GameImageCard testID='GameImageCard-tid' minimalGameConfig={minimalGameConfig} includeFreeLabel>
      <View style={genericStyles.verticalSpacing}>
        <RnuiText variant="titleSmall">
          {minimalGameConfig.gameName}
        </RnuiText>

        <RnuiTable>
          <MinimalGameConfigTableRows testID='MinimalGameConfigTableRows-tid' minimalGameConfig={minimalGameConfig} />
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
