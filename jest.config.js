module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  verbose: true,
  // Ejecutar tests de forma secuencial para evitar conflictos en MySQL
  maxWorkers: 1,
  testTimeout: 30000,
  // Opcional: configurar reporters para CI/CD
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml',
      }
    ]
  ]
};
