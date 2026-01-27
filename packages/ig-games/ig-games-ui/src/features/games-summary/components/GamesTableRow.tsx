
import { useAppConfig, useAppLocalization, type GamesUiUrlPathsAdapter } from "@ig/engine-ui";
import { type GameConfigT } from '@ig/games-models';
import { PlatformUiLink } from "@ig/platform-ui";
import { RnuiButton, RnuiTableCell, RnuiTableRow, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import type { TestableComponentT } from '../../../types/ComponentTypes';

export type GamesTableRowPropsT = TestableComponentT & {
  joinedGameConfig: GameConfigT,
};

export const GamesTableRow: FC<GamesTableRowPropsT> = ({ joinedGameConfig }) => {
  const { gamesUiUrlPathsAdapter } = useAppConfig();

  return (
    <RnuiTableRow testID="RnuiTableRow-tid">
      <RnuiTableCell testID="RnuiTableCell-tid" >
        <RnuiText testID="gameName-text-tid">{joinedGameConfig.gameName}</RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="RnuiTableCell-tid" endContent>
        <GameActionButton
          gamesUiUrlPathsAdapter={gamesUiUrlPathsAdapter}
          joinedGameConfig={joinedGameConfig}
        />
      </RnuiTableCell>
    </RnuiTableRow>
  );
};

type GameActionButtonPropsT = {
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
  joinedGameConfig: GameConfigT,
};

const GameActionButton: FC<GameActionButtonPropsT> = ({ gamesUiUrlPathsAdapter, joinedGameConfig }) => {
  const { t } = useAppLocalization();
  const gameInstanceUrl = gamesUiUrlPathsAdapter.buildGameDashboardUrlPath(joinedGameConfig.gameConfigId);

  return (
    <PlatformUiLink href={gameInstanceUrl} asChild>
      <RnuiButton testID="open-game-btn-tid" size="xs">{t("common:open")}</RnuiButton>
    </PlatformUiLink>
  );
};
