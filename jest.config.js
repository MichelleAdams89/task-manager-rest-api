export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 30000,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js"
  ],
  testMatch: ["**/tests/**/*.test.js"]
};