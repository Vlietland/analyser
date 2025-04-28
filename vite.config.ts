import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

export default defineConfig({
  base: '/analyser/',
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@src': '/analyserWeb/src'
    }
  }
});