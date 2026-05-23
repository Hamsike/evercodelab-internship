import { createDefaultPreset } from "ts-jest";

const presetConfig = createDefaultPreset({
  tsconfig: 'tsconfig.json',
})

export default {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  verbose: true,
  transform: {
    ...presetConfig.transform,
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
};
