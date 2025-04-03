/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^canvas$': '<rootDir>/src/__mocks__/canvasMock.js',
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ["node_modules/(?!@?react-spring)/"],
};

module.exports = config;
