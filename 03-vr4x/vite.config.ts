import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: { port: 5182 },
  resolve: { alias: { vue: 'vue/dist/vue.esm-bundler.js' } },
});
