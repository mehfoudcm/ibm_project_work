// jest.config.js
module.exports = {
  testEnvironment: 'node', // Use 'jsdom' for browser-like environment if needed
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore these paths
  moduleDirectories: ['node_modules', 'src'], // Specify directories to search for modules
  coverageDirectory: 'coverage', // Directory for coverage reports
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/node_modules/**'], // Files to collect coverage from
};
