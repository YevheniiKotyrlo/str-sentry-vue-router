/**
 * Postinstall patch for @sentry/vue router instrumentation.
 *
 * Applies the fix from https://github.com/getsentry/sentry-javascript/pull/19476:
 * - Uses rest params (...rest) to keep Function.length === 2
 * - Detects Vue Router 3 via 'mode' in router for backward compatibility
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'node_modules', '@sentry', 'vue', 'build', 'esm', 'router.js');

if (!fs.existsSync(file)) {
  console.log('[patch] @sentry/vue not installed yet, skipping');
  process.exit(0);
}

let code = fs.readFileSync(file, 'utf8');

// Check if already patched
if (code.includes('isLegacyRouter')) {
  console.log('[patch] Already patched, skipping');
  process.exit(0);
}

// 1. Add legacy router detection after hasHandledFirstPageLoad
code = code.replace(
  'let hasHandledFirstPageLoad = false;',
  `let hasHandledFirstPageLoad = false;
  const isLegacyRouter = 'mode' in router;`
);

// 2. Change guard signature from (to, _from, next) to (to, _from, ...rest)
code = code.replace(
  'router.beforeEach((to, _from, next) => {',
  'router.beforeEach((to, _from, ...rest) => {'
);

// 3. Replace the next() call with legacy-only path
code = code.replace(
  /\/\/ Vue Router 4 no longer.*?\n.*?\/\/.*?\n.*?if \(next\) \{\n\s*next\(\);\n\s*\}/s,
  `if (isLegacyRouter) {
      const next = rest[0];
      if (typeof next === 'function') { next(); }
    }`
);

fs.writeFileSync(file, code, 'utf8');
console.log('[patch] @sentry/vue router.js patched successfully');
