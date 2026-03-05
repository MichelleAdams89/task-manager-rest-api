export default {
  testEnvironment: "node",

  testTimeout: 30000,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js"
  ],
  testMatch: ["**/tests/**/*.test.js"]
};