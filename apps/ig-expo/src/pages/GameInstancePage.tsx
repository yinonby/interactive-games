
import type { GameInstanceIdT } from "@ig/engine-models";
import { GameInstancePageContent } from "@ig/engine-ui";

export default function GamesDashboardPage({ gameInstanceId }: { gameInstanceId: GameInstanceIdT }) {
  return (
    <GameInstancePageContent gameInstanceId={gameInstanceId} />
  );
}