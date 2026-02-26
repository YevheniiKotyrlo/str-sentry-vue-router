import { createApp } from 'vue';
import * as Sentry from '@sentry/vue';
import App from './App.vue';
import { router } from './router';

const app = createApp(App);

Sentry.init({
  app,
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
  integrations: [Sentry.browserTracingIntegration({ router })],
  tracesSampleRate: 1.0,
});

app.use(router);
app.mount('#app');
