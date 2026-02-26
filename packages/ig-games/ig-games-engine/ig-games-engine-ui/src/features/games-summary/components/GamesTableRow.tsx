
import { useAppConfig, useAppLocalization, type GamesUiUrlPathsAdapter } from '@ig/app-engine-ui';
import { type PublicGameConfigT } from '@ig/games-engine-models';
import { PlatformUiLink } from '@ig/platform-ui';
import { RnuiButton, RnuiTableCell, RnuiTableRow, RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import type { TestableComponentT } from '../../../types/ComponentTypes';

export type GamesTableRowPropsT = TestableComponentT & {
  joinedPublicGameConfig: PublicGameConfigT,
};

export const GamesTableRow: FC<GamesTableRowPropsT> = ({ joinedPublicGameConfig }) => {
  const { gamesUiUrlPathsAdapter } = useAppConfig();

  return (
    <RnuiTableRow testID="RnuiTableRow-tid">
      <RnuiTableCell testID="RnuiTableCell-tid" >
        <RnuiText testID="gameName-text-tid">{joinedPublicGameConfig.gameName}</RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="RnuiTableCell-tid" endContent>
        <GameActionButton
          gamesUiUrlPathsAdapter={gamesUiUrlPathsAdapter}
          joinedPublicGameConfig={joinedPublicGameConfig}
        />
      </RnuiTableCell>
    </RnuiTableRow>
  );
};

type GameActionButtonPropsT = {
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
  joinedPublicGameConfig: PublicGameConfigT,
};

const GameActionButton: FC<GameActionButtonPropsT> = ({ gamesUiUrlPathsAdapter, joinedPublicGameConfig }) => {
  const { t } = useAppLocalization();
  const gameInstanceUrl = gamesUiUrlPathsAdapter.buildGameDashboardUrlPath(joinedPublicGameConfig.gameConfigId);

  return (
    <PlatformUiLink href={gameInstanceUrl} asChild>
      <RnuiButton testID="open-game-btn-tid" size="xs">{t("common:open")}</RnuiButton>
    </PlatformUiLink>
  );
};
