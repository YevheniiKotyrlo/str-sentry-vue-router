# STR: @sentry/vue Router Deprecation Warning

Minimal reproductions for [getsentry/sentry-javascript#19476](https://github.com/getsentry/sentry-javascript/pull/19476).

## The Bug

`@sentry/vue`'s `instrumentVueRouter` registers a `beforeEach` guard with 3 named parameters (`to`, `_from`, `next`). Vue Router uses `Function.length` to detect legacy guards — when `length >= 3`, it enters callback mode and (since [Vue Router 5.0.3](https://github.com/vuejs/router/releases/tag/v5.0.3)) wraps `next` with `withDeprecationWarning()`, producing:

```
[Vue Router warn]: The `next()` callback in navigation guards is deprecated.
Return the value instead of calling `next(value)`.
```

This warning fires on **every single navigation** for all `@sentry/vue` users on Vue Router 5.0.3+.

## The Fix

The PR uses two techniques:

1. **Rest parameters** (`...rest`) instead of a named `next` — keeps `Function.length === 2`, so Vue Router 4+/5+ uses modern return-based resolution (no deprecation warning).
2. **`'mode' in router`** detection — Vue Router 3 exposes `mode` (`'hash' | 'history' | 'abstract'`), Vue Router 4+ does not. When legacy router is detected, `next()` is called via `rest[0]`.

## Projects

All projects use `@sentry/vue@10.40.0` (latest). Patched demos apply the PR code via `patch-package` with added `console.log` statements to show guard execution flow.

| # | Directory | Vue Router | Patched | What to observe in browser console |
|---|-----------|-----------|---------|-----------------------------------|
| 1 | `01-bug-vr5` | **5.0.3** | No (baseline) | Deprecation warning on every navigation |
| 2 | `02-fix-vr5` | **5.0.3** | Yes | `isLegacyRouter: false` → no `next()` → **no warning** |
| 3 | `03-vr4x` | **4.5.1** | Yes | `isLegacyRouter: false` → no `next()` → no warning |
| 4 | `04-vr3-legacy` | **3.6.5** | Yes | `isLegacyRouter: true` → `next()` called → **navigation works** |

Project `04-vr3-legacy` is the backward-compatibility proof: Vue Router 3 **requires** `next()` to resolve navigation guards. Without the `isLegacyRouter` detection, navigation stalls completely.

## Run locally

```bash
cd 01-bug-vr5    && npm install && npm run dev   # http://localhost:5180
cd 02-fix-vr5    && npm install && npm run dev   # http://localhost:5181
cd 03-vr4x       && npm install && npm run dev   # http://localhost:5182
cd 04-vr3-legacy && npm install && npm run dev   # http://localhost:5183
```

Open the browser console (F12) and click any navigation link. Only `01-bug-vr5` produces the deprecation warning.

## Playwright tests

Each project includes a Playwright test that verifies behavior automatically:

```bash
cd 01-bug-vr5    && npx playwright test  # Asserts warning IS present
02-fix-vr5    && npx playwright test  # Asserts warning is NOT present, guard logs visible
03-vr4x       && npx playwright test  # Asserts warning is NOT present, guard logs visible
04-vr3-legacy && npx playwright test  # Asserts next() IS called, navigation works
```

```
01-bug-vr5:    ✅ Deprecation warning IS present (confirms the bug)
02-fix-vr5:    ✅ No deprecation warning (fix works on VR5)
03-vr4x:       ✅ No deprecation warning (fix works on VR4)
04-vr3-legacy: ✅ next() IS called, navigation resolves (backward compat with VR3)
```
