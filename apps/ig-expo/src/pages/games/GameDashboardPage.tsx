
import type { GameConfigIdT } from '@ig/games-engine-models';
import { GameDashboardViewPageContent } from '@ig/games-engine-ui';

export default function GameDashboardPage({ gameConfigId }: { gameConfigId: GameConfigIdT }) {
  return (
    <GameDashboardViewPageContent gameConfigId={gameConfigId} />
  );
}
