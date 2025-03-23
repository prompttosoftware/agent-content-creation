// vite.config.ts
// import { defineConfig } from 'vitest/config'

export default {
  test: {
    // Configuration options for Vitest
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    deps: {
      inline: true
    }
  }
}