
import { rnJestConfig } from '@ig/rn-testing';

export default {
  ...rnJestConfig,
  setupFilesAfterEnv: ['./test/jest.setup.ts'],
  transform: {
    '^.+\\.(mj|jt)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // Don't ignore these
    'node_modules/(?!(msw|rettime|@open-draft|until-async|expo|@expo|expo-constants|expo-modules-core|expo-router|react-native|@react-native|@react-navigation|react-redux|@reduxjs/toolkit|immer)/)',
  ],
  moduleNameMapper: {
    '^@test/(.*)$': '<rootDir>/test/$1',
    '@ig/app-engine-ui/test-utils': '<rootDir>/../../../ig-app-engine/ig-app-engine-ui/test/test-index.ts',
    '@ig/games-engine-models/test-utils': '<rootDir>/../ig-games-engine-models/test/test-index.ts',
    '^msw/node$': '<rootDir>/../../../../node_modules/msw/lib/node/index.js',
  },
}
