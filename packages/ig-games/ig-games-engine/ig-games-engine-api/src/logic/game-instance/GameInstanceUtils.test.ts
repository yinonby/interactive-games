import type { PublicLevelConfigT } from '@ig/games-engine-models';
import type { WordleAdapter } from '@ig/games-wordle-be-models';
import { levelConfigTolevelState } from './GameInstanceUtils';

describe('GameInstanceUtils', () => {
  let mockWordleAdapter: WordleAdapter;

  beforeEach(() => {
    mockWordleAdapter = {
      generateWordleSolution: vi.fn(() => 'HELLO'),
    };
  });

  describe('levelConfigTolevelState', () => {
    it('should return correct state for code kind', () => {
      const levelConfig = {
        publicPluginConfig: {
          kind: 'code',
          publicCodePuzzleConfig: { difficulty: 'easy' },
        },
      } as unknown as PublicLevelConfigT;

      const result = levelConfigTolevelState(levelConfig, mockWordleAdapter);

      expect(result.levelStatus).toBe('notStarted');
      if (result.pluginState.kind !== 'code') {
        throw new Error('Unexpected kind');
      }
      expect(result.pluginState.kind).toBe('code');
      expect(result.pluginState.codeSolution).toBe('');
    });

    it('should return correct state for wordle kind', () => {
      const levelConfig = {
        publicPluginConfig: {
          kind: 'wordle',
          publicWordleConfig: { maxAttempts: 6 },
        },
      } as unknown as PublicLevelConfigT;

      const result = levelConfigTolevelState(levelConfig, mockWordleAdapter);

      expect(result.levelStatus).toBe('notStarted');
      expect(result.pluginState.kind).toBe('wordle');
      if (result.pluginState.kind !== 'wordle') {
        throw new Error('Unexpected kind');
      }
      expect(result.pluginState.publicWordleState.guessDatas).toEqual([]);
      expect(result.pluginState.wordleSolution).toBe('HELLO');
      expect(mockWordleAdapter.generateWordleSolution).toHaveBeenCalled();
    });

    it('should throw error for unknown kind', () => {
      const levelConfig = {
        publicPluginConfig: {
          kind: 'unknown',
        },
      } as unknown as PublicLevelConfigT;

      expect(() => levelConfigTolevelState(levelConfig, mockWordleAdapter)).toThrow(
        'Unexpected level kind'
      );
    });
  });
});