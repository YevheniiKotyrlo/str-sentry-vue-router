import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';

export default defineConfig({
  plugins: [vue2()],
  server: { port: 5183 },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
    },
  },
});
