/// <reference types="vite/client" />

declare module '*.vue' {
  import type Vue from 'vue';
  export default Vue;
}

declare module 'vue-router' {
  import VueRouter from 'vue-router';
  export default VueRouter;
}
