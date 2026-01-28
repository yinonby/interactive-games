
import { describe, expect, it } from 'vitest';
import type { PlayerExposedInfoT } from '../types/game/GameInstanceTypes';
import { comparePlayersForDisplaySort } from './PlayerUtils';

describe('comparePlayersForDisplaySort', () => {
  it('places admin before non-admin', () => {
    const admin = { playerRole: 'admin', playerNickname: 'Zed' } as PlayerExposedInfoT;
    const player = { playerRole: 'player', playerNickname: 'Alice' } as PlayerExposedInfoT;

    expect(comparePlayersForDisplaySort(admin, player)).toBeLessThan(0);
    expect(comparePlayersForDisplaySort(player, admin)).toBeGreaterThan(0);
  });

  it('when roles are equal, sorts by nickname (ascending)', () => {
    const p1 = { playerRole: 'player', playerNickname: 'Alice' } as PlayerExposedInfoT;
    const p2 = { playerRole: 'player', playerNickname: 'Bob' } as PlayerExposedInfoT;

    expect(comparePlayersForDisplaySort(p1, p2)).toBeLessThan(0);
    expect(comparePlayersForDisplaySort(p2, p1)).toBeGreaterThan(0);
  });

  it('returns 0 for identical role and nickname', () => {
    const a = { playerRole: 'player', playerNickname: 'Sam' } as PlayerExposedInfoT;
    const b = { playerRole: 'player', playerNickname: 'Sam' } as PlayerExposedInfoT;

    expect(comparePlayersForDisplaySort(a, b)).toBe(0);
  });

  it('delegates nickname comparison to localeCompare when roles match', () => {
    const p1 = { playerRole: 'player', playerNickname: 'alpha' } as PlayerExposedInfoT;
    const p2 = { playerRole: 'player', playerNickname: 'Beta' } as PlayerExposedInfoT;

    const expected = p1.playerNickname.localeCompare(p2.playerNickname);
    expect(comparePlayersForDisplaySort(p1, p2)).toBe(expected);
  });
});
