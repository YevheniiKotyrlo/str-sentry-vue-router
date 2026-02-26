<template>
  <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px">
    <h2>STR: @sentry/vue + Vue Router 5.0.3 (patched)</h2>
    <p>
      <strong>Expected:</strong> NO deprecation warning in console.
    </p>

    <nav style="display: flex; gap: 16px; margin: 20px 0">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
    </nav>

    <div style="background: #d4edda; border: 1px solid #28a745; padding: 12px; border-radius: 4px; margin-bottom: 20px">
      Open the browser console (F12) and click the navigation links above.<br />
      You should see <strong>no</strong> deprecation warnings.
    </div>

    <router-view />
  </div>
</template>
