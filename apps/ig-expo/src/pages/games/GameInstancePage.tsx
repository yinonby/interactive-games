
import { GameInstancePageContent } from "@ig/engine-games-ui";
import type { GameInstanceIdT } from "@ig/engine-models";

export default function GamesDashboardPage({ gameInstanceId }: { gameInstanceId: GameInstanceIdT }) {
  return (
    <GameInstancePageContent gameInstanceId={gameInstanceId} />
  );
}
