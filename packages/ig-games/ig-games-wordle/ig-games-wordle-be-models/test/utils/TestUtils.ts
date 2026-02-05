
import type { WordleConfigT } from '@/types/WordleTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

const baseWordleConfig: WordleConfigT = {
  langCode: 'en',
  wordLength: 5,
  allowedGuessesNum: 6,
  solution: {
    word: 'hello',
  },
};

export const buildFullTestWordleConfig = (overrides: Partial<WordleConfigT>): WordleConfigT => ({
  ...baseWordleConfig,
  ...overrides,
});
