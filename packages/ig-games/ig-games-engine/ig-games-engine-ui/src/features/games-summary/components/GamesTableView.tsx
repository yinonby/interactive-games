
import { useAppLocalization } from '@ig/app-engine-ui';
import { type GameInfoT } from '@ig/games-engine-models';
import { RnuiTable, RnuiTableHeader, RnuiTableTitle, RnuiText } from '@ig/rnui';
import React, { type FC } from 'react';
import { GamesTableRow } from './GamesTableRow';

const compareGames = (mg1: GameInfoT, mg2: GameInfoT): number => {
  return mg1.gameName.localeCompare(mg2.gameName);
}

export type GamesTableViewPropsT = {
  joinedGameInfos: GameInfoT[],
  testID?: string,
};

export const GamesTableView: FC<GamesTableViewPropsT> = ({ joinedGameInfos }) => {
  const { t } = useAppLocalization();

  return (
    <RnuiTable testID="RnuiTable-tid">
      <RnuiTableHeader testID="RnuiTableHeader-tid">
        <RnuiTableTitle testID="RnuiTableTitle-tid">
          <RnuiText>{t("games:gameName")}</RnuiText>
        </RnuiTableTitle>
        <RnuiTableTitle testID="RnuiTableTitle-tid" endContent><></></RnuiTableTitle>
      </RnuiTableHeader>
      {[...joinedGameInfos].sort(compareGames).map((e, index) =>
        <GamesTableRow testID='GamesTableRow-tid' key={index} joinedGameInfo={e}/>
      )}
    </RnuiTable>
  );
};
