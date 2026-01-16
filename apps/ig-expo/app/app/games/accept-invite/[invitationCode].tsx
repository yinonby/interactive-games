
import GamesAcceptInvitePage from "@/src/pages/GamesAcceptInvitePage";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
  const { invitationCode } = useLocalSearchParams<{ invitationCode: string }>();

  return (
    <GamesAcceptInvitePage invitationCode={invitationCode} />
  );
}
