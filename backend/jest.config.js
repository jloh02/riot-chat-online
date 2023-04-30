module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  rootDir: ".",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
