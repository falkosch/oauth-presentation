const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  coverageReporters: ['text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  errorOnDeprecated: true,
  resetMocks: true,
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs|@datorama/akita/.+)$)'],
};
