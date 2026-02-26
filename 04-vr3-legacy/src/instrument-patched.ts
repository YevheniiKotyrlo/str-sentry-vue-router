/**
 * Extracted from the PR: getsentry/sentry-javascript#19476
 *
 * This is the patched version of instrumentVueRouter that uses rest params
 * to keep Function.length === 2 and detects Vue Router 3 via 'mode' in router.
 *
 * Stripped of Sentry span logic to focus purely on the router instrumentation
 * behavior (next() calling, mode detection, Function.length).
 */

type Route = {
  path: string;
  name?: string | symbol | null | undefined;
  params: Record<string, string | string[]>;
  query: Record<string, string | null | (string | null)[]>;
  matched: { path: string }[];
};

interface VueRouter {
  onError: (fn: (err: Error) => void) => void;
  beforeEach: (fn: (to: Route, from: Route, next?: () => void) => void) => void;
  mode?: string;
}

interface InstrumentLog {
  type: 'navigation' | 'pageload';
  from: string;
  to: string;
  isLegacyRouter: boolean;
  calledNext: boolean;
  guardFnLength: number;
}

const instrumentLog: InstrumentLog[] = [];

function instrumentVueRouter(router: VueRouter): void {
  // This is the detection from the PR
  const isLegacyRouter = 'mode' in router;

  console.log(`[instrument] isLegacyRouter=${isLegacyRouter}, router.mode=${(router as any).mode}`);

  router.onError((error) => {
    console.error('[instrument] Router error:', error);
  });

  // This is the key line from the PR — rest params keep Function.length === 2
  const guard = (to: Route, _from: Route, ...rest: [(() => void)?]): void => {
    const entry: InstrumentLog = {
      type: 'navigation',
      from: _from.path,
      to: to.path,
      isLegacyRouter,
      calledNext: false,
      guardFnLength: guard.length,
    };

    console.log(`[instrument] Navigation: ${_from.path} → ${to.path}`);

    // This is the backward-compat logic from the PR
    if (isLegacyRouter) {
      const next = rest[0];
      if (typeof next === 'function') {
        next();
        entry.calledNext = true;
        console.log('[instrument] Called next() for legacy router');
      } else {
        console.warn('[instrument] Legacy router detected but next was not provided!');
      }
    } else {
      console.log('[instrument] Modern router — auto-resolve (no next() call)');
    }

    instrumentLog.push(entry);
  };

  router.beforeEach(guard);

  console.log(`[instrument] Guard Function.length = ${guard.length}`);
}

function getInstrumentLog(): InstrumentLog[] {
  return instrumentLog;
}

export { instrumentVueRouter, getInstrumentLog };
export type { InstrumentLog };
