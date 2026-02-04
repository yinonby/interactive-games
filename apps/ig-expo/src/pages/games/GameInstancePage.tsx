
import type { GameInstanceIdT } from '@ig/games-engine-models';
import { GameInstancePageContent } from '@ig/games-engine-ui';

export default function GamesDashboardPage({ gameInstanceId }: { gameInstanceId: GameInstanceIdT }) {
  return (
    <GameInstancePageContent gameInstanceId={gameInstanceId} />
  );
}
