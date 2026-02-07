
import { useAppConfig, useAppLocalization, type GamesUiUrlPathsAdapter } from '@ig/app-engine-ui';
import { type GameInfoT } from '@ig/games-engine-models';
import { PlatformUiLink } from '@ig/platform-ui';
import { RnuiButton, RnuiTableCell, RnuiTableRow, RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import type { TestableComponentT } from '../../../types/ComponentTypes';

export type GamesTableRowPropsT = TestableComponentT & {
  joinedGameInfo: GameInfoT,
};

export const GamesTableRow: FC<GamesTableRowPropsT> = ({ joinedGameInfo }) => {
  const { gamesUiUrlPathsAdapter } = useAppConfig();

  return (
    <RnuiTableRow testID="RnuiTableRow-tid">
      <RnuiTableCell testID="RnuiTableCell-tid" >
        <RnuiText testID="gameName-text-tid">{joinedGameInfo.gameName}</RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="RnuiTableCell-tid" endContent>
        <GameActionButton
          gamesUiUrlPathsAdapter={gamesUiUrlPathsAdapter}
          joinedGameInfo={joinedGameInfo}
        />
      </RnuiTableCell>
    </RnuiTableRow>
  );
};

type GameActionButtonPropsT = {
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
  joinedGameInfo: GameInfoT,
};

const GameActionButton: FC<GameActionButtonPropsT> = ({ gamesUiUrlPathsAdapter, joinedGameInfo }) => {
  const { t } = useAppLocalization();
  const gameInstanceUrl = gamesUiUrlPathsAdapter.buildGameDashboardUrlPath(joinedGameInfo.gameConfigId);

  return (
    <PlatformUiLink href={gameInstanceUrl} asChild>
      <RnuiButton testID="open-game-btn-tid" size="xs">{t("common:open")}</RnuiButton>
    </PlatformUiLink>
  );
};
