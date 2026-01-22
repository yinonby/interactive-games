
import { rnJestConfig } from '@ig/rn-testing';

export default {
  ...rnJestConfig,
  setupFilesAfterEnv: ['./test/jest.setup.ts'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // Don't ignore these
    'node_modules/(?!(msw|until-async|expo|@expo|expo-constants|expo-modules-core|react-native|@react-native|react-redux|@reduxjs/toolkit|immer)/)',
  ],
  moduleNameMapper: {
    '^@test/(.*)$': '<rootDir>/test/$1',
    '@ig/engine-models/test-utils': '<rootDir>/../ig-engine-models/test/test-index.ts',
    '^msw/node$': '<rootDir>/../../../node_modules/msw/lib/node/index.js', // <-- key fix
  },
}
