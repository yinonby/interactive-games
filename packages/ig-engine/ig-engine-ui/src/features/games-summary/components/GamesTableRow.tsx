
import type { GameUiUrlPathsAdapter } from "@/types/GameUiConfigTypes";
import { type MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
import { PlatformUiLink } from "@ig/platform-ui";
import { RnuiButton, RnuiTableCell, RnuiTableRow, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { useGameContext } from "../../../app/layout/GameContextProvider";
import { GameStatusView } from "../../game-instance/components/GameStatusView";

export type GamesTableRowPropsT = {
  minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT,
};

export const GamesTableRow: FC<GamesTableRowPropsT> = ({ minimalGameInstanceExposedInfo }) => {
  const { gameUiUrlPathsAdapter } = useGameContext();

  return (
    <RnuiTableRow testID="games-table-row-tid">
      <RnuiTableCell testID="games-table-cell-tid" >
        <RnuiText testID="game-name-text-tid">{minimalGameInstanceExposedInfo.minimalGameConfig.gameName}</RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="games-table-cell-tid" >
        <GameStatusView gameStatus={minimalGameInstanceExposedInfo.gameStatus} />
      </RnuiTableCell>
      <RnuiTableCell testID="games-table-cell-tid" >
        <RnuiText testID="user-role-text-tid">
          {minimalGameInstanceExposedInfo.playerRole === "admin" ? "Admin" : "Player"}
        </RnuiText>
      </RnuiTableCell>
      <RnuiTableCell testID="games-table-cell-tid" endContent>
        <GameActionButton
          gameUiUrlPathsAdapter={gameUiUrlPathsAdapter}
          minimalGameInstanceExposedInfo={minimalGameInstanceExposedInfo}
        />
      </RnuiTableCell>
    </RnuiTableRow>
  );
};

type GameActionButtonPropsT = {
  gameUiUrlPathsAdapter: GameUiUrlPathsAdapter,
  minimalGameInstanceExposedInfo: MinimalGameInstanceExposedInfoT,
};

const GameActionButton: FC<GameActionButtonPropsT> = ({ gameUiUrlPathsAdapter, minimalGameInstanceExposedInfo }) => {
  const gameInstanceUrl = gameUiUrlPathsAdapter
    .buildGameInstanceDashboardUrlPath(minimalGameInstanceExposedInfo.gameInstanceId);

  return (
    <PlatformUiLink href={gameInstanceUrl} asChild>
      <RnuiButton testID="open-game-btn-tid" size="xs">Open</RnuiButton>
    </PlatformUiLink>
  );
};
