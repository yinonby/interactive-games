
import type { WordleExposedConfigT } from '../../src/types/WordleTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

const baseWordleExposedConfig: WordleExposedConfigT = {
  langCode: 'en',
  wordLength: 5,
  allowedGuessesNum: 6,
};

export const buildFullTestWordleExposedConfig = (overrides: Partial<WordleExposedConfigT>): WordleExposedConfigT => ({
  ...baseWordleExposedConfig,
  ...overrides,
});
