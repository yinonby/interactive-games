
import GameInstancePageContent from "@/src/pages/GameInstancePage";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
  const { gameInstanceId } = useLocalSearchParams<{ gameInstanceId: string }>();

  return (
    <GameInstancePageContent gameInstanceId={gameInstanceId } />
  );
}
