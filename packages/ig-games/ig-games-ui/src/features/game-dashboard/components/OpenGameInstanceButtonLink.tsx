
import { useAppConfig, useAppLocalization } from '@ig/engine-ui';
import type { GameInstanceIdT } from '@ig/games-models';
import { PlatformUiLink } from '@ig/platform-ui';
import { RnuiButton } from '@ig/rnui';
import React, { type FC } from 'react';
import type { TestableComponentT } from '../../../types/ComponentTypes';

export type GameInstanceViewPropsT = TestableComponentT & {
  gameInstanceId: GameInstanceIdT,
};

export const OpenGameInstanceButtonLink: FC<GameInstanceViewPropsT> = (props) => {
  const { gameInstanceId } = props;
  const { t } = useAppLocalization();
  const { gamesUiUrlPathsAdapter } = useAppConfig();
  const gameInstanceUrl = gamesUiUrlPathsAdapter.buildGameInstanceDashboardUrlPath(gameInstanceId);

  return (
    <PlatformUiLink testID='PlatformUiLink-tid' href={gameInstanceUrl} asChild>
      <RnuiButton testID="RnuiButton-tid" size="xs">{t("common:open")}</RnuiButton>
    </PlatformUiLink>
  )
};
