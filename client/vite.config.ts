/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { defineConfig as defineVitestConfig } from 'vitest/config';

const config = defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.tsx'],
    globals: true,
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: 'svg?react',
        replacement: 'svg',
      },
    ],
    deps: {
      web: {
        transformAssets: true,
      },
    },
    reporters: ['default', 'html'],
  },
});

export default { ...config, ...vitestConfig };
