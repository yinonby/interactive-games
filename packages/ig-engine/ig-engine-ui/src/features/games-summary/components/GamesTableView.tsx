
import { MinimalGameInstanceExposedInfoDao, type MinimalGameInstanceExposedInfoT } from "@ig/engine-models";
import { RnuiTable, RnuiTableHeader, RnuiTableTitle } from "@ig/rnui";
import React, { type FC } from 'react';
import { GamesTableRow } from "./GamesTableRow";

const compareGames = (mgii1: MinimalGameInstanceExposedInfoT, mgii2: MinimalGameInstanceExposedInfoT): number => {
  return (new MinimalGameInstanceExposedInfoDao(mgii1)).compare(new MinimalGameInstanceExposedInfoDao(mgii2));
}

export type GamesTableViewPropsT = {
  minimalGameInstanceExposedInfos: MinimalGameInstanceExposedInfoT[],
  testID?: string,
};

export const GamesTableView: FC<GamesTableViewPropsT> = ({ minimalGameInstanceExposedInfos }) => {
  return (
    <RnuiTable testID="game-table-tid">
      <RnuiTableHeader testID="game-table-header-tid">
        <RnuiTableTitle testID="game-table-title-tid">Game Name</RnuiTableTitle>
        <RnuiTableTitle testID="game-table-title-tid">Status</RnuiTableTitle>
        <RnuiTableTitle testID="game-table-title-tid">Role</RnuiTableTitle>
        <RnuiTableTitle testID="game-table-title-tid" endContent><></></RnuiTableTitle>
      </RnuiTableHeader>
      {[...minimalGameInstanceExposedInfos].sort(compareGames).map((e, index) =>
        <GamesTableRow key={index} minimalGameInstanceExposedInfo={e}/>
      )}
    </RnuiTable>
  );
};
