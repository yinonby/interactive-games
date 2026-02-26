
import type { PublicWordleConfigT } from '../../src/types/WordleTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

const basePublicWordleConfig: PublicWordleConfigT = {
  langCode: 'en',
  wordLength: 5,
  allowedGuessesNum: 6,
};

export const buildFullTestPublicWordleConfig = (overrides: Partial<PublicWordleConfigT>): PublicWordleConfigT => ({
  ...basePublicWordleConfig,
  ...overrides,
});
