
import { GameDashboardViewPageContent } from "@ig/engine-games-ui";
import type { GameConfigIdT } from "@ig/engine-models";

export default function GameDashboardPage({ gameConfigId }: { gameConfigId: GameConfigIdT }) {
  return (
    <GameDashboardViewPageContent gameConfigId={gameConfigId} />
  );
}
