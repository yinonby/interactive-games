

const jestConfig = {
  preset: 'react-native',
  testEnvironmentOptions: {
    globalsCleanup: 'soft',
  },
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],

  // --- Coverage options ---
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx,js,jsx}', // include all source files
    '!<rootDir>/src/**/*.d.ts',           // ignore type declaration files
    '!<rootDir>/node_modules/**',         // ignore node_modules
  ],
  coverageDirectory: '<rootDir>/.coverage_output', // output directory
  coverageReporters: ['json', 'text', 'lcov'],     // report formats
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/types/"
  ],
}

export default jestConfig