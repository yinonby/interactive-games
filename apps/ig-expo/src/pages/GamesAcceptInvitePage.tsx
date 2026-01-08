
import { GamesAcceptInvitePageContent } from "@ig/engine-ui";

export default function GamesAcceptInvitePage({ invitationCode }: { invitationCode: string }) {
  return (
    <GamesAcceptInvitePageContent invitationCode={invitationCode} />
  );
}
