export default {
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },

  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};