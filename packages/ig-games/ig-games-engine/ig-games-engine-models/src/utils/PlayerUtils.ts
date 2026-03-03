
import type { PublicPlayerInfoT } from '../types/game/GameInstanceTypes';

export const comparePlayersForDisplaySort = (p1: PublicPlayerInfoT, p2: PublicPlayerInfoT): number => {
  const rolePriority1 = p1.playerRole === 'admin' ? 0 : 1;
  const rolePriority2 = p2.playerRole === 'admin' ? 0 : 1;
  const roleDiff = rolePriority1 - rolePriority2;

  // 1 criteria: admin first
  if (roleDiff !== 0) return roleDiff;

  // 2 criteria: by nickname
  return p1.playerNickname.localeCompare(p2.playerNickname);
}
