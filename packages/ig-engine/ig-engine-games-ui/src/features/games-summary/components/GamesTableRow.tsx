
import { useAppConfig, useAppLocalization, type GamesUiUrlPathsAdapter } from "@ig/engine-app-ui";
import { type MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
import { PlatformUiLink } from "@ig/platform-ui";
import { RnuiButton, RnuiTableCell, RnuiTableRow, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { GameStatusView } from "../../game-instance/components/GameStatusView";

export type GamesTableRowPropsT = {
  minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT,
};

export const GamesTableRow: FC<GamesTableRowPropsT> = ({ minimalGameInstanceExposedInfo }) => {
  const { gamesUiUrlPathsAdapter } = useAppConfig();

  return (
    <RnuiTableRow testID="games-table-row-tid">
      <RnuiTableCell testID="games-table-cell-tid" >
        <RnuiText testID="game-name-text-tid">{minimalGameInstanceExposedInfo.minimalGameConfig.gameName}</RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="games-table-cell-tid" >
        <GameStatusView gameStatus={minimalGameInstanceExposedInfo.gameStatus} />
      </RnuiTableCell>
      <RnuiTableCell testID="games-table-cell-tid" endContent>
        <GameActionButton
          gamesUiUrlPathsAdapter={gamesUiUrlPathsAdapter}
          minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo}
        />
      </RnuiTableCell>
    </RnuiTableRow>
  );
};

type GameActionButtonPropsT = {
  gamesUiUrlPathsAdapter: GamesUiUrlPathsAdapter,
  minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT,
};

const GameActionButton: FC<GameActionButtonPropsT> = ({ gamesUiUrlPathsAdapter, minimalGameInstanceExposedInfo }) => {
  const { t } = useAppLocalization();
  const gameInstanceUrl = gamesUiUrlPathsAdapter
    .buildGameInstanceDashboardUrlPath(minimalGameInstanceExposedInfo.gameInstanceId);

  return (
    <PlatformUiLink href={gameInstanceUrl} asChild>
      <RnuiButton testID="open-game-btn-tid" size="xs">{t("common:open")}</RnuiButton>
    </PlatformUiLink>
  );
};
