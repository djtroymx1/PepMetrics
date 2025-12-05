# PepMetrics Code Audit (2025-12-05)

## Scope and Method
- Reviewed API routes, client hooks/components, scheduling/analysis utilities, and Supabase/Anthropic integrations.
- Ran `npm run lint` (warnings only) and enumerated Playwright specs with `npx playwright test --list` (did not execute tests).

## Key Findings (ordered by severity)
- **Anthropic client hard-fails without key; invalid model IDs** (`lib/anthropic.ts`): Client is instantiated at module load and throws when `ANTHROPIC_API_KEY` is missing. This breaks any request that imports the module (including builds/edge routes) even for non-AI pages. Configured models (`claude-sonnet-4-20250514`, `claude-haiku-4-5-20251001`) are not valid, so all AI calls will 500 even with a key. Mitigation: lazy-init inside handlers, return 503 with friendly copy when missing key, and swap to valid model IDs.
- **Garmin import CPU/memory blowups and N+1 DB writes** (`app/api/garmin/import/route.ts`, `hooks/use-garmin-import.ts`): Server reads up to 200 MB uploads into memory (`file.text()`), then upserts per activity with per-row selects/updates—likely to exceed the 60s function cap and can be abused for DoS. Client parses ZIPs up to 500 MB on the main thread, freezing the UI. Mitigation: stream or chunk server-side, enforce smaller limits, and batch UPSERTs; move ZIP parsing off main thread (Web Worker) or reduce max size.
- **Date parsing uses UTC-affected `new Date("YYYY-MM-DD")`** (`lib/analysis/data-aggregation.ts`, `lib/scheduling.ts`): This can shift a day in non-UTC time zones, causing wrong dose schedules and analysis windows. Mitigation: parse dates via manual split to local midnight before comparisons.
- **Insights API pagination lacks bounds and count** (`app/api/insights/route.ts`): `limit/offset` are unchecked and no `count` is requested, so large limits can be requested and pagination metadata is inaccurate. Mitigation: validate/clamp limit (e.g., 10–100), ensure integers, and request `count: 'exact'`.
- **Corrupted user-facing copy** (`lib/analysis/validation.ts`, `app/insights/page.tsx`, `components/garmin-import.tsx`): Strings contain `ƒ?`/`ƒ+` artifacts that will render as gibberish. Mitigation: clean and rephrase affected strings.
- **Hook dependency gaps** (`components/providers/auth-provider.tsx`, `hooks/use-garmin-import.ts`): Missing deps flagged by lint can lead to stale session/profile data or stale history fetch callbacks. Mitigation: align deps or wrap stable refs.
- **UI performance and quality**: Multiple components use raw `<img>` tags hurting LCP (`components/landing/*`, `components/progress-photos.tsx`). Replace with `next/image` or justify with suppression. Numerous unused vars across components/hooks/libs clutter lint output.

## Additional Observations
- Auth middleware and Supabase client will throw if env vars are absent; consider graceful errors on cold starts.
- Playwright suite is present (70 tests) but not run; execute in CI once env/test data are available.

## Recommended Remediation Plan
1) Anthropic: guard initialization, use valid model names, and return 503 with helpful messaging when unset. Add lightweight health check if desired.
2) Garmin import: stream/chunk uploads, tighten size limits, batch UPSERTs, and move ZIP parsing off the main thread (or lower client cap). Add rate limiting.
3) Date handling: replace `new Date("YYYY-MM-DD")` with explicit local parsing helpers in scheduling and analysis paths.
4) Insights API: add numeric validation and clamped limits; request `count` for pagination metadata.
5) Copy cleanup: fix corrupted strings in validation/insights/import UIs.
6) Lint hygiene: address unused vars and swap `<img>` to `next/image` where possible; resolve hook dependency warnings.
7) Testing: run Playwright suite after fixes; consider adding targeted unit tests for date parsing and import batching.

## Remediation Completed (this pass)
- Anthropic client no longer throws on import; now lazily inits with a friendly missing-key error and valid model IDs (`lib/anthropic.ts`).
- Insights API clamps and validates pagination inputs and returns accurate counts (`app/api/insights/route.ts`).
- Copy cleanup for validation, insights, and Garmin instructions (user-facing text now readable).
- Lint/UX hygiene: removed unused vars, fixed hook deps, converted landing/progress images to `next/image`, and cleaned toast helper types.
- Supabase middleware now degrades gracefully if env vars are missing instead of throwing at import (`lib/supabase/middleware.ts`).
- Reduced Garmin upload caps to 150MB server-side and client-side to avoid excessive resource use while keeping large exports usable.
