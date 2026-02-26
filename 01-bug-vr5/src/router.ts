import { createRouter, createWebHistory } from 'vue-router';

const Home = { template: '<div><h1>Home</h1><p>Open console (F12) and click nav links.</p></div>' };
const About = { template: '<div><h1>About</h1></div>' };
const Contact = { template: '<div><h1>Contact</h1></div>' };

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About },
    { path: '/contact', name: 'contact', component: Contact },
  ],
});

export { router };
