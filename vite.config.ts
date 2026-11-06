import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'node:path';

const portalSrc = resolve(__dirname, 'src');
const vueStub = resolve(portalSrc, 'shims/vue.ts');
const anvilStub = resolve(portalSrc, 'shims/forgedevstack-anvil.ts');

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': portalSrc,
      '@constants': resolve(portalSrc, 'constants'),
      '@pages': resolve(portalSrc, 'pages'),
      '@components': resolve(portalSrc, 'components'),
      '@hooks': resolve(portalSrc, 'hooks'),
      '@utils': resolve(portalSrc, 'utils'),
      '@store': resolve(portalSrc, 'store'),
      '@assets': resolve(portalSrc, 'assets'),
      vue: vueStub,
      '@forgedevstack/anvil': anvilStub,
    },
  },
  optimizeDeps: {
    include: ['vue'],
    exclude: ['@forgedevstack/anvil'],
    esbuildOptions: {
      alias: {
        vue: vueStub,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
