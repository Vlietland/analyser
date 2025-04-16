import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'], // Add the setup file
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'tests/**/*.test.ts']
  }
})
