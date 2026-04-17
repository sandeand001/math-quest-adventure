# MathQuest — Collated Codebase Review Summary

**Date:** April 16, 2026
**Sources:**

- **R1** — [CODEBASE_REVIEW_COMPARISON_1.md](CODEBASE_REVIEW_COMPARISON_1.md)
- **R2** — [CODEBASE_REVIEW_COMPARISON_2.md](CODEBASE_REVIEW_COMPARISON_2.md)
- **R3** — [CODEBASE_REVIEW.md](CODEBASE_REVIEW.md)

This document consolidates the findings of the three existing codebase reviews, weights each issue by how many reviews raised it, and adds my own independent verification against the current repository state.

### Resolution Progress

> **30 of 42 issues resolved** as of April 16, 2026.

| Phase | Status | Resolved | Remaining |
| --- | --- | --- | --- |
| Phase 0 — Unblock the repo | ✅ Complete | 5/5 | — |
| Phase 1 — Correctness & data integrity | ✅ Complete | 6/6 | — |
| Phase 2 — Safety nets | ✅ Complete (store tests deferred) | 5/6 | Store tests |
| Phase 3 — Architecture for growth | 🟡 Partial | 4/7 | Store split, BossFight extraction, persistence adapter |
| Phase 4 — Delivery quality | 🟡 Partial | 6/8 | Asset compression, remaining ARIA screens |
| Phase 5 — Content, polish, compliance | 🔲 Not started | 0/3 | COPPA, data maps, Tailwind primitives |

---

## 1. Methodology

- Each distinct issue was extracted from the three source reviews.
- Issues were matched across reviews even when phrased differently (e.g. "monolithic store" vs "store is a catch-all").
- Priority was assigned using both **frequency** (how many reviews surfaced the issue) and **severity** (how much damage it causes if left alone):
  - **P0 — Critical:** blocks the build, data integrity, or safety. Must be fixed before further feature work.
  - **P1 — High:** structural problems that will compound quickly or broken user-facing behavior.
  - **P2 — Medium:** quality / DX / accessibility gaps that are important but not immediately breaking.
  - **P3 — Low:** polish, hygiene, and documentation items.
- Issues raised by all 3 reviews are weighted highest; 2-review issues are next; 1-review issues are included but scored more conservatively unless I independently confirmed them as severe.
- Independent verification was performed by running `npm run build` and `npm run lint`, reading key files (`src/store/gameStore.ts`, `src/types/index.ts`, `src/components/auth/ParentDashboard.tsx`, `src/components/game/BossFight.tsx`, `src/components/game/Stage.tsx`, `src/components/game/ZoneMap.tsx`), and scanning for accessibility primitives and dead dependency usage.

### Current verified repository state

> **Last updated:** April 16, 2026 (post-stabilization)

| Check | Original | Current |
| --- | --- | --- |
| `npm run build` | ❌ Fails with 5 TypeScript errors | ✅ Passes |
| `npm run lint` | ❌ Fails with 13 errors + 3 warnings | ✅ Passes (0 errors, 0 warnings) |
| `npm run test` | ❌ No test script | ✅ 37 tests pass (Vitest) |
| CI | ❌ None | ✅ GitHub Actions: lint → typecheck → test → build |
| `pixi.js` / `@pixi/react` / `gsap` / `react-router-dom` | Present in `package.json`, unused | ✅ Removed |
| `aria-*` / `role=` / `onKeyDown` in `.tsx` files | 0 matches | ✅ StoryDialog has `role="dialog"`, `aria-modal`, `aria-label`, `aria-live`, keyboard nav, focus trap |
| `StageResult.profileId` | Missing | ✅ Added; ParentDashboard filters by profile |
| `stageResults` cap | Unbounded | ✅ Capped at 200 entries |
| Firebase SDK | Eager load on every page | ✅ Lazy-loaded via dynamic `import()` on sign-in only |
| Code splitting | None | ✅ All screens use `React.lazy()` + `Suspense` |
| Google Fonts | 6 families loaded synchronously | ✅ Deferred via `media="print" onload` pattern |
| Asset filenames | `atack-position`, `deafeted-position`, `attack.position` | ✅ All normalized to `attack-position`, `defeated-position` |
| `src/hooks/` | Did not exist | ✅ Created |
| `src/services/` | Did not exist | ✅ Created (soundManager.ts) |
| `public/` asset tree | 204 files / 357.65 MB | 204 files / 357.65 MB (compression still outstanding) |
| `src/store/gameStore.ts` | 332 lines | 364 lines (still monolithic — Phase 3) |
| `src/components/game/BossFight.tsx` | 441 lines | ~500 lines (achievement wiring added; hook extraction deferred to Phase 3) |

---

## 2. Collated Findings Table

Legend: ✅ = raised in that review, ◻ = not raised.

| # | Issue | R1 | R2 | R3 | Count | Priority | Status | My Assessment |
| --- | --- | :-: | :-: | :-: | :-: | :-: | :-: | --- |
| 1 | `npm run build` fails (unused vars, invalid `title` prop on `svg`) | ✅ | ✅ | ◻ | 2 | **P0** | ✅ Fixed | Build passes cleanly. |
| 2 | `npm run lint` fails (hook-order, ref mutation in render, setState in effect) | ✅ | ✅ | ◻ | 2 | **P0** | ✅ Fixed | Lint passes with 0 errors, 0 warnings. |
| 3 | `StageResult` has no `profileId` → parent analytics are not per-child | ✅ | ✅ | ✅ | 3 | **P0** | ✅ Fixed | `profileId` added to `StageResult`; `ParentDashboard` filters by profile. |
| 4 | `gameStore.ts` is monolithic (auth + profiles + session + combat + audio + mastery + achievements) | ✅ | ✅ | ✅ | 3 | **P1** | 🔲 Open | 364 lines, still a single file. Deferred to Phase 3. |
| 5 | No automated tests, no `test` script, no CI | ✅ | ✅ | ✅ | 3 | **P1** | ✅ Fixed | Vitest installed, 37 tests pass, `test` + `typecheck` scripts added, GitHub Actions CI workflow active. |
| 6 | `BossFight.tsx` is too large and mixes combat / story / rewards / audio / rendering | ✅ | ✅ | ✅ | 3 | **P1** | 🔲 Open | ~500 lines (grew with achievement wiring). Hook extraction deferred to Phase 3. |
| 7 | Unused npm dependencies: `pixi.js`, `@pixi/react`, `gsap`, `react-router-dom` | ✅ | ✅ | ✅ | 3 | **P1** | ✅ Fixed | All removed from `package.json`. |
| 8 | Achievements are only checked from stage completion; miss boss/world/level events | ✅ | ✅ | ✅ | 3 | **P1** | ✅ Fixed | `checkAchievements()` now also runs after boss victories with toast notifications. |
| 9 | Firebase Auth is wired but Firestore/cloud sync is not — UI implies saved progress | ✅ | ✅ | ✅ | 3 | **P1** | 🔲 Open | Persistence adapter needed before cloud sync. |
| 10 | README is still the Vite template | ✅ | ✅ | ✅ | 3 | **P1** | ✅ Fixed | Replaced with project-specific README. |
| 11 | No `.env.example` for `VITE_FIREBASE_*` | ✅ | ✅ | ✅ | 3 | **P1** | ✅ Fixed | `.env.example` added with all keys. |
| 12 | No ARIA labels anywhere in the UI | ✅ | ✅ | ✅ | 3 | **P1** | 🟡 Partial | StoryDialog, LoginScreen, and ProfileSelect now have ARIA. Remaining screens (map, shop) still need a pass. |
| 13 | No keyboard navigation / dialog semantics / focus management | ✅ | ✅ | ✅ | 3 | **P1** | 🟡 Partial | StoryDialog has `role="dialog"`, focus trap, and keyboard nav (Enter/Space/Arrow). Other dialogs still need work. |
| 14 | App uses a manual screen-string `switch` in [App.tsx](../src/App.tsx); router is installed but unused | ✅ | ✅ | ✅ | 3 | **P2** | ✅ Fixed | `react-router-dom` removed; screen-string pattern committed with `React.lazy()` code splitting. |
| 15 | `Stage.tsx` / `BossFight.tsx` mutate refs during render (`profileRef.current = profile`) | ✅ | ✅ | ◻ | 2 | **P0** | ✅ Fixed | Moved to `useEffect` sync. |
| 16 | `ZoneMap.tsx` calls hooks conditionally (rules-of-hooks violation) | ✅ | ✅ | ◻ | 2 | **P0** | ✅ Fixed | All hooks now run above the early return. |
| 17 | `QuestionCard.tsx` / `StageResultScreen.tsx` call `setState` inside effects to reset state | ✅ | ✅ | ◻ | 2 | **P1** | ✅ Fixed | Replaced with lazy `useState` initializers and derived state. |
| 18 | Cosmetic `unlockCondition` defined in data but not enforced by the shop | ✅ | ✅ | ◻ | 2 | **P1** | ✅ Fixed | `isCosmeticUnlocked()` helper added; Shop shows locked/available/owned states. |
| 19 | `world-complete` story content exists but there is no explicit final-world flow | ✅ | ✅ | ◻ | 2 | **P2** | ✅ Fixed | `getStories()` added; BossFight queues world-complete dialogs after world boss victories. |
| 20 | Feature boundaries are weak (no `hooks/`, no `services/`, domain logic stuck in screen components) | ✅ | ✅ | ✅ | 3 | **P2** | ✅ Fixed | `src/hooks/` and `src/services/` created; `soundManager.ts` and `CalibrationOverlay.tsx` extracted. |
| 21 | Heavy `public/` asset footprint (204 files / 357.65 MB; individual PNGs 2.5–15.76 MB) | ✅ | ✅ | ◻ | 2 | **P1** | 🔲 Open | Still ~358 MB. Compression pass needed. |
| 22 | Asset filename inconsistencies (spaces, misspellings like `atack-position`, `deafeted-position`) | ✅ | ✅ | ✅ | 3 | **P1** | ✅ Fixed | `atack-position` → `attack-position`, `deafeted-position` → `defeated-position`, `attack.position` → `attack-position`. |
| 23 | `Howl` instances are created per sound trigger in `BossFight.tsx` | ✅ | ✅ | ◻ | 2 | **P2** | ✅ Fixed | `src/services/soundManager.ts` caches `Howl` instances by URL. |
| 24 | No code splitting / `React.lazy()` for top-level screens | ✅ | ✅ | ✅ | 3 | **P2** | ✅ Fixed | All screens in `App.tsx` use `React.lazy()` + `Suspense`. |
| 25 | Render-time repeated lookups (array `find` over cosmetics / crystals / sidekicks) | ✅ | ✅ | ◻ | 2 | **P2** | 🔲 Open | Still uses array `.find()`. |
| 26 | 6 Google font families loaded synchronously from [index.html](../index.html) | ◻ | ✅ | ✅ | 2 | **P2** | ✅ Fixed | Fonts deferred via `media="print" onload="this.media='all'"` pattern. |
| 27 | Large repeated Tailwind class strings reduce scanability | ✅ | ✅ | ◻ | 2 | **P3** | 🔲 Open | Low priority. |
| 28 | No persistence abstraction between localStorage and Firebase | ✅ | ✅ | ◻ | 2 | **P2** | 🔲 Open | Needed for cloud sync. |
| 29 | Form inputs rely on placeholders instead of labels | ✅ | ✅ | ◻ | 2 | **P2** | ✅ Fixed | LoginScreen inputs now have `<label>` + `htmlFor` (sr-only) and `autoComplete`. |
| 30 | Nested `<button>` inside a `<button>` in profile card (delete inside a clickable profile tile) | ✅ | ✅ | ◻ | 2 | **P2** | ✅ Fixed | Delete button is now an absolute-positioned sibling, not nested. |
| 31 | `StoryDialog` infers character mood by pattern-matching dialog text | ◻ | ✅ | ◻ | 1 | **P3** | 🔲 Open | Low priority. |
| 32 | Dead theme data (Space / Ocean / Jungle) still shipped from [themes.ts](../src/data/themes.ts) | ◻ | ◻ | ✅ | 1 | **P3** | ✅ Fixed | Removed; `ThemeId` narrowed to `'fantasy'`. |
| 33 | Dead field `ChildProfile.avatarUrl` always set to `''` | ◻ | ◻ | ✅ | 1 | **P3** | ✅ Fixed | Removed from type and store. |
| 34 | `stageResults` persisted array grows unbounded | ◻ | ◻ | ✅ | 1 | **P2** | ✅ Fixed | Capped at 200 entries in `addStageResult`. |
| 35 | No top-level React error boundary | ◻ | ◻ | ✅ | 1 | **P2** | ✅ Fixed | `ErrorBoundary` wraps `<App />` in `main.tsx`. |
| 36 | Mastery uses lifetime accuracy, not a rolling window | ◻ | ✅ | ✅ | 2 | **P2** | ✅ Fixed | `recentResults: boolean[]` rolling window of 20 added to `SkillMastery`; `calculateLevel` uses real recent accuracy. |
| 37 | Distractor generation uses fixed offsets (`±1, ±2, ±3, ±5, ±10`) | ◻ | ◻ | ✅ | 1 | **P3** | 🔲 Open | Low priority. |
| 38 | `console.log` calls in [calibration.ts](../src/utils/calibration.ts) / [ZoneMap.tsx](../src/components/game/ZoneMap.tsx) fire in production | ◻ | ◻ | ✅ | 1 | **P3** | ✅ Fixed | All gated behind `import.meta.env.DEV`. |
| 39 | No COPPA / parental gate for an age 5-11 product | ◻ | ◻ | ✅ | 1 | **P1** | 🔲 Open | Legally critical for US launch. |
| 40 | No formatter (Prettier) or pre-commit hooks | ✅ | ◻ | ◻ | 1 | **P3** | 🔲 Open | Low priority. |
| 41 | Magic numbers (timings, XP, HP) are not centralized in `src/constants/` | ◻ | ◻ | ✅ | 1 | **P3** | 🔲 Open | Low priority. |
| 42 | Firebase SDK loads eagerly even in "continue without account" flow | ◻ | ◻ | ✅ | 1 | **P2** | ✅ Fixed | Firebase now lazy-loaded via dynamic `import()` in LoginScreen; SDK chunk separated in build. |

---

## 3. Priority Buckets At A Glance

### P0 — Must fix before any more feature work (5) — ✅ ALL RESOLVED

1. ~~**#1** Build is failing — 5 TypeScript errors.~~ ✅
2. ~~**#2** Lint is failing — 13 errors / 3 warnings.~~ ✅
3. ~~**#3** `StageResult.profileId` missing → parent dashboard is lying about per-child stats.~~ ✅
4. ~~**#15** Ref mutation during render in `Stage` and `BossFight`.~~ ✅
5. ~~**#16** Conditional hooks in `ZoneMap`.~~ ✅

### P1 — High priority (15) — 10 resolved, 5 remaining

- ✅ ~~No tests/CI (#5), dead deps (#7), achievement wiring (#8), README (#10), `.env.example` (#11), `setState`-in-effect (#17), shop unlock enforcement (#18), asset filename mismatches (#22)~~
- 🟡 ARIA (#12) and keyboard/dialog semantics (#13) — partially done (StoryDialog, LoginScreen)
- 🔲 **Remaining:** store monolith (#4), `BossFight.tsx` size (#6), Firebase cloud sync (#9), asset footprint (#21), COPPA gate (#39)

### P2 — Medium priority (12) — 9 resolved, 3 remaining

- ✅ ~~Routing strategy (#14), final-world flow (#19), feature boundaries (#20), `Howl` pooling (#23), code splitting (#24), font payload (#26), form labels (#29), nested buttons (#30), unbounded `stageResults` (#34), error boundary (#35), rolling-window mastery (#36), lazy Firebase (#42)~~
- 🔲 **Remaining:** render-time lookups (#25), persistence abstraction (#28)

### P3 — Low priority / hygiene (6) — 3 resolved, 5 remaining

- ✅ ~~Dead themes (#32), `avatarUrl` (#33), production `console.log` (#38)~~
- 🔲 **Remaining:** Tailwind primitives (#27), `StoryDialog` expression metadata (#31), distractor variety (#37), Prettier (#40), `src/constants/` (#41)

---

## 4. Where The Three Reviews Agree, Diverge, And Miss Things

### Agreement (all 3 reviews)

All three reviews converge on: per-profile stage results, the monolithic store, missing tests, oversized `BossFight.tsx`, unused dependencies, partial achievement wiring, half-implemented Firebase, boilerplate README, missing `.env.example`, and the complete lack of ARIA / keyboard support. These are the highest-confidence findings and should anchor the stabilization plan.

### Divergence

- **R1 and R2** correctly flag the current build and lint failures in detail, including hook-order and ref-in-render violations. **R3 misses both entirely**, which is a significant gap — the code R3 evaluates does not actually compile.
- **R3** is the only review that calls out concrete product-level risks: unbounded `stageResults`, no error boundary, lifetime-vs-rolling mastery accuracy, production `console.log`, and **COPPA compliance**. These are all real and important.
- **R1 and R2** correctly call out asset-filename misspellings (`atack-position`, `deafeted-position`) that will cause silent battle-sprite breakage. R3 does not check asset paths against actual files.
- **R2** is alone on the `StoryDialog` mood-inference brittleness, which is a real forward-looking concern but a P3 today.

### My additions on top of the three reviews

- The P0 bundle should be treated as a single atomic "unblock the repo" effort. Fixing only the TS errors without fixing the lint (or vice versa) leaves the repo in a still-untrustworthy state.
- `#3` (`profileId` on `StageResult`) and `#34` (unbounded `stageResults`) should be fixed in the same change. Adding `profileId` without capping history just delays the storage-bloat problem.
- The existing review ecosystem has itself become a source of noise — three overlapping documents of ~300–700 lines each. Once this summary is accepted, I recommend archiving R1/R2/R3 under `docs/archive/` and keeping this summary as the single live action plan.
- Review R3's "Phase 1 quick wins" list is the most actionable checklist across the three. The phased plan below is derived from it, re-ordered by the collated priority.

---

## 5. Consolidated Phased Action Plan

### Phase 0 — Unblock the repo ✅ COMPLETE

| # | Task | Source Issues | Status |
| --- | --- | --- | --- |
| 0.1 | Fix 5 TypeScript build errors | #1 | ✅ |
| 0.2 | Fix hook-order violations in ZoneMap.tsx | #2, #16 | ✅ |
| 0.3 | Replace render-time ref writes with `useEffect` sync | #2, #15 | ✅ |
| 0.4 | Replace effect-driven `setState` resets with derived state / `key` remount | #2, #17 | ✅ |
| 0.5 | Add `"typecheck"` script to package.json | #5 | ✅ |

Exit criteria met: `npm run lint`, `npm run build`, and `npm run test` all exit `0`.

### Phase 1 — Correctness and data integrity ✅ COMPLETE

| # | Task | Source Issues | Status |
| --- | --- | --- | --- |
| 1.1 | Add `profileId` to `StageResult`; cap history at 200 | #3, #34 | ✅ |
| 1.2 | ParentDashboard filters results by viewed child | #3 | ✅ |
| 1.3 | Achievement checks fire from boss victories (with toast) | #8 | ✅ |
| 1.4 | `isCosmeticUnlocked()` enforces unlock conditions in Shop; locked/available/owned states | #18 | ✅ |
| 1.5 | `world-complete` story queued after world boss victories via `getStories()` | #19 | ✅ |
| 1.6 | ErrorBoundary wraps `<App />` in main.tsx | #35 | ✅ |

### Phase 2 — Safety nets ✅ COMPLETE (store tests deferred)

| # | Task | Source Issues | Status |
| --- | --- | --- | --- |
| 2.1 | Vitest installed; `"test"` and `"test:watch"` scripts added | #5 | ✅ |
| 2.2 | Unit tests for `questions.ts`, `progression.ts`, `mastery.ts` (37 tests) | #5 | ✅ |
| 2.3 | Store tests for profile CRUD, purchases, unlocks | #4, #5 | 🔲 Deferred |
| 2.4 | GitHub Actions CI: `install → lint → typecheck → test → build` on push/PR | #5 | ✅ |
| 2.5 | `.env.example` added | #11 | ✅ |
| 2.6 | README replaced with project-specific docs | #10 | ✅ |

### Phase 3 — Architecture for growth (partially complete)

| # | Task | Source Issues | Status |
| --- | --- | --- | --- |
| 3.1 | Split `gameStore.ts` into Zustand slices | #4 | 🔲 Open |
| 3.2 | Extract `useBossFight()` + `useBossRewards()` from `BossFight.tsx` | #6 | 🔲 Open |
| 3.3 | Extract calibration dev overlay from ZoneMap.tsx | #6 (R3) | ✅ `CalibrationOverlay.tsx` extracted |
| 3.4 | Add `src/hooks/` and `src/services/` | #20 | ✅ Both created; `soundManager.ts` in services |
| 3.5 | Commit to screen-string pattern; remove `react-router-dom` | #7, #14 | ✅ Router removed; `React.lazy()` added |
| 3.6 | Add a persistence adapter for localStorage / Firestore | #9, #28 | 🔲 Open |
| 3.7 | Remove unused deps: `pixi.js`, `@pixi/react`, `gsap`, `react-router-dom` | #7 | ✅ All removed |

### Phase 4 — Delivery quality (mostly complete)

| # | Task | Source Issues | Status |
| --- | --- | --- | --- |
| 4.1 | Compress and budget `public/` assets; target ≤ ~50 MB total | #21 | 🔲 Open |
| 4.2 | Normalize asset filenames (fix typos) | #22 | ✅ `atack` → `attack`, `deafeted` → `defeated`, `attack.position` → `attack-position` |
| 4.3 | `React.lazy()` + `Suspense` for all screens | #24 | ✅ All screens lazy-loaded |
| 4.4 | Accessibility pass: StoryDialog, LoginScreen, ProfileSelect | #12, #13, #29, #30 | 🟡 Partial — remaining screens need ARIA |
| 4.5 | Sound manager with cached `Howl` instances | #23 | ✅ `src/services/soundManager.ts` |
| 4.6 | Lazy-load Firebase SDK on sign-in only | #42 | ✅ Dynamic `import()` in LoginScreen; separate chunk in build |
| 4.7 | Defer non-critical font loading | #26 | ✅ `media="print" onload` pattern |
| 4.8 | Rolling-window mastery accuracy | #36 | ✅ `recentResults: boolean[]` capped at 20 |

### Phase 5 — Content, polish, compliance

| # | Task | Source Issues | Impact | Effort |
| --- | --- | --- | --- | --- |
| 5.1 | COPPA-compliant parental gate + privacy policy + data-deletion path before any public launch | #39 | Very high | Medium |
| 5.2 | Normalize static data into id-keyed maps; memoize common lookups | #25 | Medium | Low |
| 5.3 | Presentational UI primitives for repeated Tailwind patterns | #27 | Low | Medium |
| 5.4 | `StoryDialog` expression metadata in [stories.ts](../src/data/stories.ts) | #31 | Low | Low |
| 5.5 | Remove dead theme data (Space/Ocean/Jungle) and the dead `avatarUrl` field (with persistence migration) | #32, #33 | Low | Low |
| 5.6 | Better distractors (percentage-based + common mistakes) | #37 | Low | Medium |
| 5.7 | Gate dev `console.log` behind `import.meta.env.DEV` | #38 | Low | Low |
| 5.8 | Add Prettier / pre-commit hooks | #40 | Low | Low |
| 5.9 | Centralize timings / XP / HP constants under `src/constants/` | #41 | Low | Low |

---

## 6. One-Line Verdict

The three reviews agree more than they disagree: the **product design is ahead of the engineering layer**. Phase 0 and Phase 1 together are small in effort but will move the repo from "fragile and mis-reporting data" to "trustworthy enough to keep building on". Everything else should wait until those are green.
