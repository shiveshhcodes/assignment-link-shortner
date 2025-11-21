module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    testMatch: ['**/tests/**/*.test.ts'],
    collectCoverageFrom: [
        'pages/api/**/*.ts',
        'lib/**/*.ts',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
}
