<template>
  <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px">
    <h2>STR: @sentry/vue + Vue Router 4.5.1 (baseline)</h2>
    <p>
      <strong>Expected:</strong> No deprecation warning (VR 4.x has no withDeprecationWarning).
    </p>

    <nav style="display: flex; gap: 16px; margin: 20px 0">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
    </nav>

    <div style="background: #d1ecf1; border: 1px solid #17a2b8; padding: 12px; border-radius: 4px; margin-bottom: 20px">
      Open the browser console (F12) and click the navigation links above.<br />
      No warnings expected — VR 4.x doesn't have withDeprecationWarning.
    </div>

    <router-view />
  </div>
</template>
