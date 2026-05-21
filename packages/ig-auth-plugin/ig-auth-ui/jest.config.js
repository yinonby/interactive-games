
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
    '^msw/node$': '<rootDir>/../../../node_modules/msw/lib/node/index.js',
  },
}
