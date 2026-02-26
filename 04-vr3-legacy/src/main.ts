import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Sentry from '@sentry/vue';
import App from './App.vue';

Vue.use(VueRouter);

const Home = { template: '<div><h1>Home</h1><p>Open console (F12) and click nav links.</p></div>' };
const About = { template: '<div><h1>About</h1></div>' };
const Contact = { template: '<div><h1>Contact</h1></div>' };

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About },
    { path: '/contact', name: 'contact', component: Contact },
  ],
});

// Log the router's mode property for debugging
console.log(`[main] Router mode: ${router.mode}`);
console.log(`[main] 'mode' in router: ${'mode' in router}`);

Sentry.init({
  Vue,
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
  integrations: [Sentry.browserTracingIntegration({ router: router as any })],
  tracesSampleRate: 1.0,
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
