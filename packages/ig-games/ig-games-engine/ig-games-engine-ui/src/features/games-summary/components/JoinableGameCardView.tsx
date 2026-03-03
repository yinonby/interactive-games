
import {
  useAppConfig, useAppErrorHandling,
  useAppLocalization, useGenericStyles
} from '@ig/app-engine-ui';
import type { MinimalPublicGameConfigT } from '@ig/games-engine-models';
import { usePlatformUiNavigation } from '@ig/platform-ui';
import { RnuiButton, RnuiTable, RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import { View } from 'react-native';
import { useGameUserController } from '../../../domains/game-user/controller/user-actions/GameUserController';
import type { TestableComponentT } from '../../../types/ComponentTypes';
import { GameImageCard } from '../../common/game-info/GameImageCard';
import { MinimalPublicGameConfigTableRows } from './MinimalPublicGameConfigTableRows';

export type JoinableGameCardViewPropsT = TestableComponentT & {
  minimalPublicGameConfig: MinimalPublicGameConfigT,
};

export const JoinableGameCardView: FC<JoinableGameCardViewPropsT> = ({ minimalPublicGameConfig }) => {
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const { t } = useAppLocalization();
  const { onAddGameConfigId } = useGameUserController();
  const { navigate } = usePlatformUiNavigation();
  const { onUnknownError } = useAppErrorHandling();
  const genericStyles = useGenericStyles();

  const handlePlayGamePress = async (): Promise<void> => {
    try {
      await onAddGameConfigId(minimalPublicGameConfig.gameConfigId);
      const url = gamesUiUrlPathsAdapter.buildGameDashboardUrlPath(minimalPublicGameConfig.gameConfigId);
      navigate(url);
    } catch (error: unknown) {
      onUnknownError(error);
    }
  }

  return (
    <GameImageCard testID='GameImageCard-tid' minimalPublicGameConfig={minimalPublicGameConfig} includeFreeLabel>
      <View style={genericStyles.spacing}>
        <RnuiText variant="titleSmall">
          {minimalPublicGameConfig.gameName}
        </RnuiText>

        <RnuiTable>
          <MinimalPublicGameConfigTableRows testID='MinimalPublicGameConfigTableRows-tid' minimalPublicGameConfig={minimalPublicGameConfig} />
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
