
import { rnJestConfig } from '@ig/rn-testing';

export default {
  ...rnJestConfig,
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./test/jest.setup.ts'],
  transformIgnorePatterns: [
    // Don't ignore these
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo.*)/)',
  ],
}
