
import { GamesAcceptInvitePageContent } from '@ig/games-engine-ui';

export default function GamesAcceptInvitePage({ invitationCode }: { invitationCode: string }) {
  return (
    <GamesAcceptInvitePageContent invitationCode={invitationCode} />
  );
}
