# MathQuest — Collated Codebase Review Summary

**Date:** April 16, 2026
**Sources:**

- **R1** — [CODEBASE_REVIEW_COMPARISON_1.md](CODEBASE_REVIEW_COMPARISON_1.md)
- **R2** — [CODEBASE_REVIEW_COMPARISON_2.md](CODEBASE_REVIEW_COMPARISON_2.md)
- **R3** — [CODEBASE_REVIEW.md](CODEBASE_REVIEW.md)

This document consolidates the findings of the three existing codebase reviews, weights each issue by how many reviews raised it, and adds my own independent verification against the current repository state.

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

| Check | Result |
| --- | --- |
| `npm run build` | ❌ Fails with 5 TypeScript errors |
| `npm run lint` | ❌ Fails with 13 errors + 3 warnings |
| `pixi.js` / `@pixi/react` / `gsap` / `react-router-dom` references in `src/` | 0 matches — confirmed unused |
| `aria-*` / `role=` / `onKeyDown` in `src/` `.tsx` files | 0 matches — accessibility primitives absent |
| `StageResult.profileId` | Not defined in [src/types/index.ts](../src/types/index.ts#L224) |
| [src/components/auth/ParentDashboard.tsx](../src/components/auth/ParentDashboard.tsx#L23) | Still uses `stageResults.filter(() => true)` |
| `public/` asset tree | 204 files / 357.65 MB |
| `src/store/gameStore.ts` | 332 lines |
| `src/components/game/BossFight.tsx` | 441 lines |
| `src/components/game/ZoneMap.tsx` | 303 lines |
| `src/components/game/Stage.tsx` | 192 lines |

---

## 2. Collated Findings Table

Legend: ✅ = raised in that review, ◻ = not raised.

| # | Issue | R1 | R2 | R3 | Count | Priority | My Assessment |
| --- | --- | :-: | :-: | :-: | :-: | :-: | --- |
| 1 | `npm run build` fails (unused vars, invalid `title` prop on `svg`) | ✅ | ✅ | ◻ | 2 | **P0** | Confirmed. 5 TS errors in [BossFight.tsx](../src/components/game/BossFight.tsx), [Inventory.tsx](../src/components/game/Inventory.tsx), [CrystalTracker.tsx](../src/components/ui/CrystalTracker.tsx). R3 did not flag this, which is a gap in R3. Must be fixed first — nothing else is trustworthy until the build passes. |
| 2 | `npm run lint` fails (hook-order, ref mutation in render, setState in effect) | ✅ | ✅ | ◻ | 2 | **P0** | Confirmed. 13 errors across [ZoneMap.tsx](../src/components/game/ZoneMap.tsx), [Stage.tsx](../src/components/game/Stage.tsx), [BossFight.tsx](../src/components/game/BossFight.tsx), [QuestionCard.tsx](../src/components/game/QuestionCard.tsx), [StageResultScreen.tsx](../src/components/game/StageResultScreen.tsx). Hook-order violations in ZoneMap are genuine runtime risks, not style nits. |
| 3 | `StageResult` has no `profileId` → parent analytics are not per-child | ✅ | ✅ | ✅ | 3 | **P0** | Confirmed by reading [src/types/index.ts](../src/types/index.ts#L224) and [ParentDashboard.tsx](../src/components/auth/ParentDashboard.tsx#L23) (`filter(() => true)` with a self-admitted "In production…" comment). This is a correctness bug — the dashboard currently misleads parents. Low effort, very high value. |
| 4 | `gameStore.ts` is monolithic (auth + profiles + session + combat + audio + mastery + achievements) | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed at 332 lines. Not as bloated as R3's "400+ lines" claim, but already too many unrelated concerns in one module. Slice split (`auth` / `profiles` / `session` / `combat` / `mastery` / `achievements` / `audio`) is the right next step. |
| 5 | No automated tests, no `test` script, no CI | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed — no test files and `package.json` has no `test` script. Given the amount of progression/XP/mastery/unlock logic already shipped, this is the largest regression risk in the repo. Start with Vitest on `src/engine/**`. |
| 6 | `BossFight.tsx` is too large and mixes combat / story / rewards / audio / rendering | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed at 441 lines. This is the single highest-maintenance file. Extract `useBossFight()` + `useBossRewards()` + a presentational arena component. |
| 7 | Unused npm dependencies: `pixi.js`, `@pixi/react`, `gsap`, `react-router-dom` | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed — 0 import references in `src/`. Remove immediately. 10-minute task, meaningful install-size win, and removes ambiguity about intended rendering/routing direction. |
| 8 | Achievements are only checked from stage completion; miss boss/world/level events | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed — `checkAchievements()` lives only in [StageResultScreen.tsx](../src/components/game/StageResultScreen.tsx). Boss victories, world completion, and level-ups don't trigger checks. Move behind a small event API. |
| 9 | Firebase Auth is wired but Firestore/cloud sync is not — UI implies saved progress | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed. Storage is localStorage-only. Either label auth as "local only" or finish sync. Leaving this ambiguous risks data-loss complaints from parents. |
| 10 | README is still the Vite template | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed. Blocking issue for contributors and for anyone evaluating the project. Cheap fix with outsized DX impact. |
| 11 | No `.env.example` for `VITE_FIREBASE_*` | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed. Firebase config falls back to empty strings silently, which will produce confusing auth failures on fresh clones. |
| 12 | No ARIA labels anywhere in the UI | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed — zero `aria-` matches in any `.tsx` file. For a kids' education product, accessibility is not optional. Full keyboard + screen-reader pass is needed before any public launch. |
| 13 | No keyboard navigation / dialog semantics / focus management | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed — zero `onKeyDown`, `role=`, or `tabIndex` usage. [StoryDialog.tsx](../src/components/ui/StoryDialog.tsx) is the most visible offender. |
| 14 | App uses a manual screen-string `switch` in [App.tsx](../src/App.tsx); router is installed but unused | ✅ | ✅ | ✅ | 3 | **P2** | Confirmed. Acceptable for an MVP, but either commit to the custom pattern (and remove `react-router-dom`) or adopt real routes. R3's suggestion to add `React.lazy()` with the existing switch is the lowest-risk win. |
| 15 | `Stage.tsx` / `BossFight.tsx` mutate refs during render (`profileRef.current = profile`) | ✅ | ✅ | ◻ | 2 | **P0** | Confirmed in [Stage.tsx:39](../src/components/game/Stage.tsx#L39) and [BossFight.tsx:65](../src/components/game/BossFight.tsx#L65). This is part of the P0 lint-fix bundle above. |
| 16 | `ZoneMap.tsx` calls hooks conditionally (rules-of-hooks violation) | ✅ | ✅ | ◻ | 2 | **P0** | Confirmed — 5 rules-of-hooks errors in [ZoneMap.tsx](../src/components/game/ZoneMap.tsx). Real correctness risk, not cosmetic. |
| 17 | `QuestionCard.tsx` / `StageResultScreen.tsx` call `setState` inside effects to reset state | ✅ | ✅ | ◻ | 2 | **P1** | Confirmed. Replace with derived state or a `key`-based reset. R3 missed this class of bug entirely. |
| 18 | Cosmetic `unlockCondition` defined in data but not enforced by the shop | ✅ | ✅ | ◻ | 2 | **P1** | Confirmed by inspection of [cosmetics.ts](../src/data/cosmetics.ts) and [Shop.tsx](../src/components/game/Shop.tsx). Add a single unlock helper and render `locked` / `available` / `owned` as distinct states. |
| 19 | `world-complete` story content exists but there is no explicit final-world flow | ✅ | ✅ | ◻ | 2 | **P2** | Confirmed against [stories.ts](../src/data/stories.ts). Authored content is effectively orphaned — either wire it or remove it. |
| 20 | Feature boundaries are weak (no `hooks/`, no `services/`, domain logic stuck in screen components) | ✅ | ✅ | ✅ | 3 | **P2** | Confirmed. `src/hooks/` does not exist and engine logic leaks into components. Adding a `hooks/` + `services/` layer is a prerequisite for splitting the store and large screens cleanly. |
| 21 | Heavy `public/` asset footprint (204 files / 357.65 MB; individual PNGs 2.5–15.76 MB) | ✅ | ✅ | ◻ | 2 | **P1** | Confirmed. For a browser-first kids' game that may run on tablets / school hardware, this is a serious delivery risk. Set an asset budget and compress aggressively. |
| 22 | Asset filename inconsistencies (spaces, misspellings like `atack-position`, `deafeted-position`) | ✅ | ✅ | ✅ | 3 | **P1** | Confirmed in prior asset tree sweep. These cause silent missing-image bugs in battle. Normalize to kebab-case and add a verification script that checks expected vs actual asset names. |
| 23 | `Howl` instances are created per sound trigger in `BossFight.tsx` | ✅ | ✅ | ◻ | 2 | **P2** | Confirmed. Introduce a tiny sound manager / cache. Low effort, noticeable combat-smoothness win. |
| 24 | No code splitting / `React.lazy()` for top-level screens | ✅ | ✅ | ✅ | 3 | **P2** | Confirmed. Lowest-risk performance improvement once build is fixed. |
| 25 | Render-time repeated lookups (array `find` over cosmetics / crystals / sidekicks) | ✅ | ✅ | ◻ | 2 | **P2** | Confirmed by inspection of UI components. Normalize static data into id-keyed maps or memoize. |
| 26 | 6 Google font families loaded synchronously from [index.html](../index.html) | ◻ | ✅ | ✅ | 2 | **P2** | Confirmed. `display=swap` is already present (R3 noted) but the full payload is heavy. Reduce to the fonts actually rendered on the first screen. |
| 27 | Large repeated Tailwind class strings reduce scanability | ✅ | ✅ | ◻ | 2 | **P3** | Confirmed. Extract small presentational primitives (card/panel/button variants). |
| 28 | No persistence abstraction between localStorage and Firebase | ✅ | ✅ | ◻ | 2 | **P2** | Confirmed. Needed before cloud sync can be implemented safely. |
| 29 | Form inputs rely on placeholders instead of labels | ✅ | ✅ | ◻ | 2 | **P2** | Confirmed in [LoginScreen.tsx](../src/components/auth/LoginScreen.tsx), [ProfileSelect.tsx](../src/components/auth/ProfileSelect.tsx), [QuestionCard.tsx](../src/components/game/QuestionCard.tsx). Part of the P1 accessibility bundle (#12/#13) in practice. |
| 30 | Nested `<button>` inside a `<button>` in profile card (delete inside a clickable profile tile) | ✅ | ✅ | ◻ | 2 | **P2** | Confirmed in [ProfileSelect.tsx](../src/components/auth/ProfileSelect.tsx). Both an accessibility and an HTML-validity bug. |
| 31 | `StoryDialog` infers character mood by pattern-matching dialog text | ◻ | ✅ | ◻ | 1 | **P3** | Valid. Brittle as the script grows. Move expression into authored metadata in [stories.ts](../src/data/stories.ts). |
| 32 | Dead theme data (Space / Ocean / Jungle) still shipped from [themes.ts](../src/data/themes.ts) | ◻ | ◻ | ✅ | 1 | **P3** | Confirmed. Remove until actually planned. Reversible via git history. |
| 33 | Dead field `ChildProfile.avatarUrl` always set to `''` | ◻ | ◻ | ✅ | 1 | **P3** | Confirmed. Remove from type + add a persistence migration to strip it from existing saves. |
| 34 | `stageResults` persisted array grows unbounded | ◻ | ◻ | ✅ | 1 | **P2** | Confirmed — no cap, no cleanup, no per-profile scoping. Should be fixed as part of the `profileId` work (#3). |
| 35 | No top-level React error boundary | ◻ | ◻ | ✅ | 1 | **P2** | Confirmed — any thrown error today produces a white screen. Quick win. |
| 36 | Mastery uses lifetime accuracy, not a rolling window | ◻ | ✅ | ✅ | 2 | **P2** | Confirmed against [src/engine/mastery.ts](../src/engine/mastery.ts). Hurts recovery for kids who improved after a rough start. Add `recentResults: boolean[]` capped at ~20. |
| 37 | Distractor generation uses fixed offsets (`±1, ±2, ±3, ±5, ±10`) | ◻ | ◻ | ✅ | 1 | **P3** | Valid. Add percentage-based and common-mistake distractors to prevent exploitable patterns. |
| 38 | `console.log` calls in [calibration.ts](../src/utils/calibration.ts) / [ZoneMap.tsx](../src/components/game/ZoneMap.tsx) fire in production | ◻ | ◻ | ✅ | 1 | **P3** | Valid. Gate behind `import.meta.env.DEV`. |
| 39 | No COPPA / parental gate for an age 5-11 product | ◻ | ◻ | ✅ | 1 | **P1** | R3 is alone on this but it is legally critical for a US launch. Must be planned before any public release even if not the first technical fix. |
| 40 | No formatter (Prettier) or pre-commit hooks | ✅ | ◻ | ◻ | 1 | **P3** | Valid. After lint/build/tests are green, add formatting to lock in consistency. |
| 41 | Magic numbers (timings, XP, HP) are not centralized in `src/constants/` | ◻ | ◻ | ✅ | 1 | **P3** | Valid, and a natural follow-up to splitting the store. |
| 42 | Firebase SDK loads eagerly even in "continue without account" flow | ◻ | ◻ | ✅ | 1 | **P2** | Valid. Dynamic `import()` on sign-in is the right fix. |

---

## 3. Priority Buckets At A Glance

### P0 — Must fix before any more feature work (5)

1. **#1** Build is failing — 5 TypeScript errors.
2. **#2** Lint is failing — 13 errors / 3 warnings.
3. **#3** `StageResult.profileId` missing → parent dashboard is lying about per-child stats.
4. **#15** Ref mutation during render in `Stage` and `BossFight`.
5. **#16** Conditional hooks in `ZoneMap`.

`#15` and `#16` are technically subsets of `#2`, but they are called out separately because they are correctness bugs, not stylistic lint nits.

### P1 — High priority (15)

Store monolith (#4), no tests/CI (#5), `BossFight.tsx` size (#6), dead deps (#7), achievement wiring (#8), Firebase half-promise (#9), README (#10), `.env.example` (#11), ARIA (#12), keyboard/dialog semantics (#13), `setState`-in-effect (#17), shop unlock enforcement (#18), asset footprint (#21), asset filename mismatches (#22), COPPA gate (#39).

### P2 — Medium priority (12)

Routing strategy (#14), final-world flow (#19), feature boundaries (#20), `Howl` pooling (#23), code splitting (#24), render-time lookups (#25), font payload (#26), persistence abstraction (#28), form labels (#29), nested buttons (#30), unbounded `stageResults` (#34), error boundary (#35), rolling-window mastery (#36), lazy Firebase (#42).

### P3 — Low priority / hygiene (6)

Tailwind primitives (#27), `StoryDialog` expression metadata (#31), dead themes (#32), `avatarUrl` (#33), distractor variety (#37), production `console.log` (#38), Prettier (#40), `src/constants/` (#41).

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

### Phase 0 — Unblock the repo (must be completed first)

| # | Task | Source Issues | Impact | Effort |
| --- | --- | --- | --- | --- |
| 0.1 | Fix 5 TypeScript build errors (unused vars in `BossFight.tsx` / `Inventory.tsx`, invalid `title` prop on `svg` in `CrystalTracker.tsx`) | #1 | Very high | Low |
| 0.2 | Fix hook-order violations in [ZoneMap.tsx](../src/components/game/ZoneMap.tsx) (move hooks above the conditional return) | #2, #16 | Very high | Low |
| 0.3 | Replace render-time `profileRef.current = profile` writes in [Stage.tsx](../src/components/game/Stage.tsx) and [BossFight.tsx](../src/components/game/BossFight.tsx) with `useEffect` sync or restructured completion flow | #2, #15 | Very high | Low |
| 0.4 | Replace effect-driven `setState` resets in [QuestionCard.tsx](../src/components/game/QuestionCard.tsx) and [StageResultScreen.tsx](../src/components/game/StageResultScreen.tsx) with derived state or `key`-based remount | #2, #17 | High | Low |
| 0.5 | Add `"typecheck": "tsc -b --noEmit"` to [package.json](../package.json) so type failures are runnable on their own | #5 (supporting) | Medium | Low |

Exit criteria: `npm run lint` and `npm run build` both exit `0`.

### Phase 1 — Correctness and data integrity

| # | Task | Source Issues | Impact | Effort |
| --- | --- | --- | --- | --- |
| 1.1 | Add `profileId` to `StageResult`; persist results per-profile (or on the profile object) and cap history (e.g. last 200 / last 30 per stage) | #3, #34 | Very high | Low |
| 1.2 | Rebuild [ParentDashboard.tsx](../src/components/auth/ParentDashboard.tsx) to filter results by the viewed child | #3 | Very high | Medium |
| 1.3 | Move achievement checks into a shared event hook fired from stage completion, boss victory, world unlock, and level-up | #8 | High | Medium |
| 1.4 | Enforce `unlockCondition` in [Shop.tsx](../src/components/game/Shop.tsx) and [Inventory.tsx](../src/components/game/Inventory.tsx) with a shared unlock helper; render `locked` / `available` / `owned` | #18 | High | Medium |
| 1.5 | Add an explicit final-world completion flow that invokes the authored `world-complete` story | #19 | Medium | Medium |
| 1.6 | Add a top-level error boundary around `<App />` with a friendly fallback | #35 | Medium | Low |

### Phase 2 — Safety nets

| # | Task | Source Issues | Impact | Effort |
| --- | --- | --- | --- | --- |
| 2.1 | Install Vitest + Testing Library; add `"test"` script | #5 | Very high | Low |
| 2.2 | Unit-test `src/engine/questions.ts`, `progression.ts`, `mastery.ts`, `achievements.ts` | #5 | Very high | Medium |
| 2.3 | Store tests for profile CRUD, purchases, unlocks, stage advancement | #4, #5 | High | Medium |
| 2.4 | GitHub Actions workflow: `install → lint → typecheck → build → test` on every PR | #5 | High | Low |
| 2.5 | Add [.env.example](../.env.example) with every `VITE_FIREBASE_*` key | #11 | Medium | Low |
| 2.6 | Replace [README.md](../README.md) with project-specific setup / architecture / contribution docs | #10 | Medium | Low |

### Phase 3 — Architecture for growth

| # | Task | Source Issues | Impact | Effort |
| --- | --- | --- | --- | --- |
| 3.1 | Split [src/store/gameStore.ts](../src/store/gameStore.ts) into Zustand slices (`auth`, `profiles`, `session`, `combat`, `mastery`, `achievements`, `audio`) | #4 | Very high | Medium |
| 3.2 | Extract `useBossFight()` + `useBossRewards()` + `BossBattleArena` from [BossFight.tsx](../src/components/game/BossFight.tsx) | #6 | High | Medium |
| 3.3 | Extract calibration dev overlay from [ZoneMap.tsx](../src/components/game/ZoneMap.tsx) | #6 (R3) | Medium | Low |
| 3.4 | Add `src/hooks/` and `src/services/`; move engine-invoking logic out of screens | #20 | High | Medium |
| 3.5 | Decide routing direction: commit to the screen-string pattern (remove `react-router-dom`) or adopt routes | #7, #14 | Medium | Medium |
| 3.6 | Add a persistence adapter so localStorage and Firestore can share one API | #9, #28 | Medium | Medium |
| 3.7 | Remove unused deps: `pixi.js`, `@pixi/react`, `gsap`, `react-router-dom` (if #3.5 chooses the non-router path) | #7 | Medium | Low |

### Phase 4 — Delivery quality

| # | Task | Source Issues | Impact | Effort |
| --- | --- | --- | --- | --- |
| 4.1 | Compress and budget `public/` assets; target ≤ ~50 MB total and ≤ ~500 KB per background | #21 | Very high | Medium |
| 4.2 | Normalize asset filenames (kebab-case, fix `atack-position` / `deafeted-position`) and add a verification script | #22 | High | Low |
| 4.3 | `React.lazy()` + `Suspense` for all top-level screens in [App.tsx](../src/App.tsx) | #24 | High | Low |
| 4.4 | Accessibility pass: labels, `role="dialog"` + focus trap for [StoryDialog.tsx](../src/components/ui/StoryDialog.tsx), ARIA on map/shop/auth, keyboard operability | #12, #13, #29, #30 | High | Medium |
| 4.5 | Sound manager with cached `Howl` instances in combat | #23 | Medium | Low |
| 4.6 | Lazy-load Firebase SDK only on email/Google sign-in | #42 | Medium | Low |
| 4.7 | Reduce initial font payload; load non-critical fonts on demand | #26 | Medium | Low |
| 4.8 | Rolling-window mastery accuracy | #36 | Medium | Medium |

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
