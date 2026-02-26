# STR: @sentry/vue Router Deprecation Warning

Minimal reproductions for [getsentry/sentry-javascript#19476](https://github.com/getsentry/sentry-javascript/pull/19476).

## The Bug

`@sentry/vue`'s `instrumentVueRouter` registers a `beforeEach` guard with 3 named parameters (`to`, `_from`, `next`). Vue Router uses `Function.length` to detect legacy guards — when `length >= 3`, it enters callback mode and (since [Vue Router 5.0.3](https://github.com/vuejs/router/releases/tag/v5.0.3)) wraps `next` with `withDeprecationWarning()`, producing:

```
[Vue Router warn]: The `next()` callback in navigation guards is deprecated.
Return the value instead of calling `next(value)`.
```

This warning fires on **every single navigation** for all `@sentry/vue` users on Vue Router 5.0.3+.

## Projects

| Directory | Vue | Vue Router | Sentry | Result |
|-----------|-----|-----------|--------|--------|
| `01-bug-vr5` | 3.x | 5.0.3 | @sentry/vue 9.x (unpatched) | Deprecation warning on every navigation |
| `02-fix-vr5` | 3.x | 5.0.3 | @sentry/vue 9.x (**patched**) | No warning |
| `03-vr4x` | 3.x | 4.5.1 | @sentry/vue 9.x (unpatched) | No warning (4.x has no `withDeprecationWarning`) |
| `04-vr3-legacy` | 2.7 | **3.6.5** | Patched instrumentation (standalone) | Navigation works, `next()` called via `rest[0]` |

Project `04-vr3-legacy` is the backward-compatibility proof: it uses a real Vue Router 3 instance (which REQUIRES `next()` to resolve guards) and the patched `instrumentVueRouter` logic. The test verifies:
- `'mode' in router` correctly detects Vue Router 3
- `guard.length === 2` (rest params don't inflate Function.length)
- `next()` IS called for every navigation
- Navigation does not stall

## Run locally

```bash
cd 01-bug-vr5    && npm install && npm run dev   # http://localhost:5180
cd 02-fix-vr5    && npm install && npm run dev   # http://localhost:5181
cd 03-vr4x       && npm install && npm run dev   # http://localhost:5182
cd 04-vr3-legacy && npm install && npm run dev   # http://localhost:5183
```

Open the browser console (F12) and click any navigation link. Only `01-bug-vr5` produces the warning.

## Playwright verification

Each project includes a Playwright test:

```bash
cd 01-bug-vr5    && npx playwright test  # Asserts warning IS present
cd 02-fix-vr5    && npx playwright test  # Asserts warning is NOT present
cd 03-vr4x       && npx playwright test  # Asserts warning is NOT present
cd 04-vr3-legacy && npx playwright test  # Asserts next() IS called, navigation works
```
