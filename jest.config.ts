import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: getSetupFilesEnvConfig(),
  setupFilesAfterEnv: getSetupFilesAfterEnvConfig(),
  testPathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/src/http/app.ts",
    "<rootDir>/src/http/routes/routes.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

function getSetupFilesEnvConfig() {
  console.debug(`NODE_ENV ===> ${process.env.NODE_ENV}`);
  return ["./jest.setup.local.js"];
}

function getSetupFilesAfterEnvConfig() {
  console.debug(`NODE_ENV ===> ${process.env.NODE_ENV}`);
  return ["./jest.setup.after.js"];
}

export default config;
