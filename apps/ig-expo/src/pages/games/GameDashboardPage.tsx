
import type { GameConfigIdT } from '@ig/games-models';
import { GameDashboardViewPageContent } from "@ig/games-ui";

export default function GameDashboardPage({ gameConfigId }: { gameConfigId: GameConfigIdT }) {
  return (
    <GameDashboardViewPageContent gameConfigId={gameConfigId} />
  );
}
