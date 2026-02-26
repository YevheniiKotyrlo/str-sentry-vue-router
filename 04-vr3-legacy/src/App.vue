<template>
  <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px">
    <h2>STR: Vue Router 3.6 + Patched Instrumentation</h2>
    <p>
      <strong>Expected:</strong> Navigation works (next() called by patched code).<br />
      No stalling. Legacy router detected via <code>'mode' in router</code>.
    </p>

    <nav style="display: flex; gap: 16px; margin: 20px 0">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
    </nav>

    <div
      style="
        background: #d4edda;
        border: 1px solid #28a745;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 20px;
      "
    >
      Vue Router 3 requires <code>next()</code> to resolve guards.<br />
      The patched code detects VR3 via <code>'mode' in router</code> and calls <code>next()</code>
      through <code>rest[0]</code>.<br />
      If navigation works, the fix is backward-compatible.
    </div>

    <router-view />
  </div>
</template>
