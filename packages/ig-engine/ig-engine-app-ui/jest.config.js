
import { rnJestConfig } from '@ig/rn-testing';

export default {
  ...rnJestConfig,
  setupFilesAfterEnv: ['./test/jest.setup.ts'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // Don't ignore these
    'node_modules/(?!(msw|until-async|expo|@expo|expo-constants|expo-modules-core|expo-router|react-native|@react-native|@react-navigation|react-redux|@reduxjs/toolkit|immer)/)',
  ],
  moduleNameMapper: {
    '^msw/node$': '<rootDir>/../../../node_modules/msw/lib/node/index.js', // <-- key fix
  },
}
