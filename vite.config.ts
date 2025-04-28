import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // You can also manually define the alias here if needed
      '@src': '/analyserWeb/src'
    }
  }
});
