
import { RnuiAppContent } from '@ig/rnui';
import React, { type FC } from 'react';
import { GamesDashboardView } from '../components/GamesDashboardView';

export const GamesDashboardPageContent: FC = () => {
  return (
    <RnuiAppContent testID="app-content-tid">
      <GamesDashboardView testID="games-dashboard-view-tid"/>
    </RnuiAppContent>
  );
};
