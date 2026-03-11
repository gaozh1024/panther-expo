import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, './test-setup.ts')],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.*', '**/test-setup.ts'],
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
  },
  resolve: {
    alias: {
      '@panther-expo/core': path.resolve(__dirname, './packages/core/src'),
      '@panther-expo/theme': path.resolve(__dirname, './packages/theme/src'),
      '@panther-expo/ui': path.resolve(__dirname, './packages/ui/src'),
      '@panther-expo/utils': path.resolve(__dirname, './packages/utils/src'),
    },
  },
});
