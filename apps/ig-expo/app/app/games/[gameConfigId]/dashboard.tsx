
import GameDashboardPage from '@/src/pages/games/GameDashboardPage';
import { useLocalSearchParams } from "expo-router";

export default function Page() {
  const { gameConfigId } = useLocalSearchParams<{ gameConfigId: string }>();

  return (
    <GameDashboardPage gameConfigId={gameConfigId} />
  );
}
