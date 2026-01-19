
import { GamesAcceptInvitePageContent } from "@ig/engine-games-ui";

export default function GamesAcceptInvitePage({ invitationCode }: { invitationCode: string }) {
  return (
    <GamesAcceptInvitePageContent invitationCode={invitationCode} />
  );
}
