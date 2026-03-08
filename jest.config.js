/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/test-*.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components.ts',
    'src/ui.ts',
    'src/engine.ts'
  ],
  coverageThreshold: {
    global: {
      lines: 80
    }
  }
};
