
import { useAppErrorHandling, useAppLocalization } from '@ig/app-engine-ui';
import { type GameConfigIdT, type PublicGameConfigT } from '@ig/games-engine-models';
import { RnuiActivityIndicator, RnuiTable, RnuiTableHeader, RnuiTableTitle, RnuiText } from '@ig/rnui';
import React, { useEffect, type FC } from 'react';
import { useGameConfigsModel } from '../../../domains/game-config/model/rtk/GameConfigsModel';
import { GamesTableRow } from './GamesTableRow';

const compareGames = (mg1: PublicGameConfigT, mg2: PublicGameConfigT): number => {
  return mg1.gameName.localeCompare(mg2.gameName);
}

export type GamesTableViewPropsT = {
  joinedGameConfigIds: GameConfigIdT[],
  testID?: string,
};

export const GamesTableView: FC<GamesTableViewPropsT> = ({ joinedGameConfigIds }) => {
  const { t } = useAppLocalization();
  const { isLoading, isError, appErrCode, data: gameConfigsModel } = useGameConfigsModel(joinedGameConfigIds);
  const { onAppError } = useAppErrorHandling();

  useEffect(() => {
    if (isError) {
      onAppError(appErrCode);
    }
  }, [isError, onAppError, appErrCode]);

  if (isLoading) return <RnuiActivityIndicator testID="activity-indicator-tid" size="large"/>;
  if (isError) {
    return null;
  }

  return (
    <RnuiTable testID="RnuiTable-tid">
      <RnuiTableHeader testID="RnuiTableHeader-tid">
        <RnuiTableTitle testID="RnuiTableTitle-tid">
          <RnuiText>{t("games:gameName")}</RnuiText>
        </RnuiTableTitle>
        <RnuiTableTitle testID="RnuiTableTitle-tid" endContent><></></RnuiTableTitle>
      </RnuiTableHeader>
      {[...gameConfigsModel.publicGameConfigs].sort(compareGames).map((e, index) =>
        <GamesTableRow testID='GamesTableRow-tid' key={index} joinedPublicGameConfig={e}/>
      )}
    </RnuiTable>
  );
};
