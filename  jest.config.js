
module.exports = {
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    preset: 'next',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
    moduleFileExtensions: ['js', 'jsx'],
    setupFilesAfterEnv: ['setupTest.js'],
    // Add other Jest configuration options as needed
  };