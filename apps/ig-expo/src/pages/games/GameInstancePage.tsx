
import type { GameInstanceIdT } from '@ig/games-models';
import { GameInstancePageContent } from "@ig/games-ui";

export default function GamesDashboardPage({ gameInstanceId }: { gameInstanceId: GameInstanceIdT }) {
  return (
    <GameInstancePageContent gameInstanceId={gameInstanceId} />
  );
}
