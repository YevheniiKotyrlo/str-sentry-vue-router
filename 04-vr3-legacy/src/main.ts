import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { instrumentVueRouter, getInstrumentLog } from './instrument-patched';

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

// Apply the patched instrumentation (same logic as PR #19476)
instrumentVueRouter(router as any);

// Expose for Playwright assertions
(window as any).__instrumentLog = getInstrumentLog;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
