
import { useAppLocalization } from "@ig/engine-app-ui";
import { type GameConfigT } from "@ig/engine-models";
import { RnuiTable, RnuiTableHeader, RnuiTableTitle, RnuiText } from "@ig/rnui";
import React, { type FC } from 'react';
import { GamesTableRow } from "./GamesTableRow";

const compareGames = (mg1: GameConfigT, mg2: GameConfigT): number => {
  return mg1.gameName.localeCompare(mg2.gameName);
}

export type GamesTableViewPropsT = {
  joinedGameConfigs: GameConfigT[],
  testID?: string,
};

export const GamesTableView: FC<GamesTableViewPropsT> = ({ joinedGameConfigs }) => {
  const { t } = useAppLocalization();

  return (
    <RnuiTable testID="RnuiTable-tid">
      <RnuiTableHeader testID="RnuiTableHeader-tid">
        <RnuiTableTitle testID="RnuiTableTitle-tid">
          <RnuiText>{t("games:gameName")}</RnuiText>
        </RnuiTableTitle>
        <RnuiTableTitle testID="RnuiTableTitle-tid" endContent><></></RnuiTableTitle>
      </RnuiTableHeader>
      {[...joinedGameConfigs].sort(compareGames).map((e, index) =>
        <GamesTableRow testID='GamesTableRow-tid' key={index} joinedGameConfig={e}/>
      )}
    </RnuiTable>
  );
};
