# MathQuest — Codebase Review & Improvement Plan

**Date:** April 16, 2026  
**Scope:** Full review of architecture, code quality, functionality, structure, and developer experience  
**Project Status:** MVP ~95%, Visuals ~60%, Polish ~20%

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Dead Dependencies](#2-dead-dependencies)
3. [Store Architecture](#3-store-architecture)
4. [Component Concerns](#4-component-concerns)
5. [File & Folder Structure](#5-file--folder-structure)
6. [Engine & Logic](#6-engine--logic)
7. [Data Layer](#7-data-layer)
8. [Routing & Navigation](#8-routing--navigation)
9. [Styling & CSS](#9-styling--css)
10. [Assets & Resource Management](#10-assets--resource-management)
11. [Firebase & Auth](#11-firebase--auth)
12. [Testing](#12-testing)
13. [Accessibility](#13-accessibility)
14. [Performance](#14-performance)
15. [Developer Experience](#15-developer-experience)
16. [Prioritized Action Plan](#16-prioritized-action-plan)

---

## 1. Executive Summary

The codebase is well-organized for an MVP. Types are comprehensive, the Zustand store is functional, and the game engine (questions, mastery, progression) is solid. However, there are several areas that need attention before the project scales further:

**Critical issues:**
- 4 unused npm dependencies inflating the bundle (~2MB wasted)
- Monolithic game store (400+ lines, 30+ actions in a single file)
- No routing library used despite being installed; screen switching is a manual switch statement
- Zero test coverage
- No `.env.example` for Firebase configuration

**Moderate issues:**
- BossFight.tsx is 400+ lines with complex inline logic that should be extracted
- `stageResults` array grows unbounded (no profile ID, no cleanup)
- Mastery accuracy uses lifetime stats, not rolling window
- Dead theme data (Space/Ocean/Jungle) still ships in the bundle
- `console.log` statements left in calibration/zone components
- No error boundaries or fallback UI

**Minor issues:**
- `avatarUrl` field on `ChildProfile` is always `''` (dead field)
- `README.md` is still the Vite boilerplate
- Inconsistent asset path conventions (some with `/assets/`, some relative)

---

## 2. Dead Dependencies

**Severity: HIGH** — These add ~2MB to install size and confuse contributors.

| Package | In `package.json` | Imported in `src/` | Action |
|---|---|---|---|
| `pixi.js` | ✅ | ❌ Never | Remove |
| `@pixi/react` | ✅ | ❌ Never | Remove |
| `gsap` | ✅ | ❌ Never | Remove |
| `react-router-dom` | ✅ | ❌ Never | Remove |

**Recommendation:** Run `npm uninstall pixi.js @pixi/react gsap react-router-dom` and verify the build still works.

---

## 3. Store Architecture

**File:** `src/store/gameStore.ts` (400+ lines)

### 3a. Monolithic Store
The single store file manages navigation, auth, profiles, session state, stage state, boss fight state, audio, mastery, and achievements. This makes it hard to reason about, test, and maintain.

**Recommendation:** Split into domain slices using Zustand's slice pattern:
```
src/store/
  index.ts            — combines slices, exports useGameStore
  authSlice.ts        — uid, setUid
  profileSlice.ts     — profiles CRUD, cosmetics, sidekicks, crystals
  sessionSlice.ts     — currentWorld/Stage, questions, streak, stage state
  bossFightSlice.ts   — bossHp, playerHp, shield, damage actions
  masterySlice.ts     — masteryMap, recordMastery
  achievementSlice.ts — unlockedAchievements
  audioSlice.ts       — muted, toggleMute
```

### 3b. Unbounded `stageResults` Array
`stageResults` is persisted to localStorage and grows forever. With 64 stages × replays, this can get large. It also lacks a `profileId` field, so results can't be attributed to a specific child.

**Recommendation:**
- Add `profileId` to `StageResult` type
- Cap storage (keep last 200 results or last 30 per stage)
- Or move stage results into each `ChildProfile` object

### 3c. `useActiveProfile()` Re-renders
`useActiveProfile()` reads both `profiles` and `activeProfileId` from the store. Any change to *any* profile triggers a re-render in *every* component using this hook.

**Recommendation:** Use a Zustand selector that returns only the active profile:
```ts
export const useActiveProfile = () =>
  useGameStore((s) => s.profiles.find((p) => p.id === s.activeProfileId) ?? null);
```
(This is already close to what exists, but wrapping it as a proper selector with `shallow` equality would prevent unnecessary re-renders.)

### 3d. Dead Field: `avatarUrl`
`ChildProfile.avatarUrl` is always set to `''` and never read meaningfully. It's been replaced by `avatarId`.

**Recommendation:** Remove `avatarUrl` from the type and all usages. Add a Zustand migration to clean it from persisted data.

---

## 4. Component Concerns

### 4a. BossFight.tsx — Too Large (400+ lines)
This file handles:
- Boss initialization
- Question flow
- Combat logic (damage, shields, poses)
- Sound effects
- Story dialogs (intro, victory, sidekick unlock, avatar unlock)
- Reward calculation
- UI rendering

**Recommendation:** Extract into:
- `useBossFight()` custom hook — state machine for combat flow
- `useBossRewards()` custom hook — reward/unlock logic
- `BossBattleArena` component — visual rendering
- Keep `BossFight.tsx` as the orchestrator

### 4b. ZoneMap.tsx — Also Large (400+ lines)
Mixes calibration dev tooling with production rendering.

**Recommendation:**
- Extract calibration logic into a `DevCalibrationOverlay` component (only rendered when `DEV_MODE && calibrating`)
- The fallback (no-image) layout should be its own component: `ZoneFallbackMap`

### 4c. App.tsx — Manual Screen Switch
```tsx
switch (screen) {
  case 'auth': return <LoginScreen />;
  case 'world-map': return <WorldMap />;
  // ...10 cases
}
```
This works but doesn't support:
- URL-based navigation (deep linking, browser back/forward)
- Route guards
- Lazy loading of screens
- Animated transitions between screens

**Recommendation:** Either:
1. Continue with the switch (simplest, fine for MVP) but add `React.lazy()` for code splitting
2. Or adopt `react-router-dom` (already installed but unused) for proper routing

### 4d. No Error Boundaries
If any component throws, the entire app crashes to a white screen.

**Recommendation:** Add a top-level `ErrorBoundary` component wrapping `<App />` with a friendly "Oops! Something went wrong" UI and a "Go Home" button.

---

## 5. File & Folder Structure

### 5a. Current Structure Assessment
The folder layout is clean and conventional:
```
src/
  components/auth/   ← auth screens
  components/game/   ← game screens
  components/ui/     ← reusable UI
  data/              ← static game data
  engine/            ← game logic
  store/             ← state management
  types/             ← TypeScript types
  utils/             ← utilities
  firebase/          ← Firebase config
```

**What's good:** Clear separation of data, engine, and UI.

### 5b. Missing: `hooks/` Directory
Custom hooks are embedded inside component files or don't exist. As hooks like `useBossFight`, `useStageFlow`, `useMasteryTracking` are extracted, they need a home.

**Recommendation:** Add `src/hooks/` for shared custom hooks.

### 5c. Missing: `constants/` or Config Separation
Magic numbers and dev flags are scattered:
- `DEV_MODE` checks appear inline in components
- Timing constants (500ms, 800ms, 900ms delays) are hardcoded
- XP formulas are in `progression.ts` but game-balance constants aren't centralized

**Recommendation:** Create `src/constants/` with:
- `timing.ts` — animation/delay durations
- `balance.ts` — XP multipliers, coin rewards, HP values
- `dev.ts` — `DEV_MODE` flag, debug helpers

### 5d. `docs/` Folder
Contains art prompts and story scripts — good practice. Should also include:
- `ARCHITECTURE.md` — system overview for new contributors
- `GAME_BALANCE.md` — tuning values and rationale

---

## 6. Engine & Logic

### 6a. Mastery Tracking — Simplified Accuracy
`updateMastery()` uses `correct / attempts` (lifetime) instead of a rolling window. This means a player who struggled early but improved recently may still appear "learning."

**Recommendation:** Track a `recentResults: boolean[]` array (last 20 answers) on `SkillMastery` and use that for level calculation. Keep lifetime stats for analytics.

### 6b. Question Generation — Limited Distractors
Distractor generation uses fixed offsets (`±1, ±2, ±3, ±5, ±10`) which can produce patterns kids learn to exploit (e.g., "the answer is never the one ending in 0").

**Recommendation:** Add percentage-based distractors for larger numbers (e.g., answer ± 10-20%) and common-mistake distractors (e.g., for `7 × 8`, include `7 + 8 = 15` as a distractor).

### 6c. Streak Calculation in Stage.tsx
`avgStreak = correctCount / 2` is a rough approximation that doesn't reflect actual streaks.

**Recommendation:** Track streak history in the store or pass actual max/avg streak from the question flow.

### 6d. Achievement Checking — Limited Scope
`checkAchievements()` only checks stage results, coin totals, and world completion. Missing:
- Mastery milestones (first skill mastered, all skills mastered)
- Time-based (play 3 days in a row)
- Collection (all crystals, all sidekicks)

**Recommendation:** Expand achievement conditions as new content is added. Consider moving to an event-driven model.

---

## 7. Data Layer

### 7a. Dead Theme Data
`themes.ts` defines 4 themes (Fantasy, Space, Ocean, Jungle) but only Fantasy is `available: true`. The other 3 ship in the bundle.

**Recommendation:** If these themes aren't planned for the near term, delete them. They can always be re-added from git history.

### 7b. Story Content Gaps
`stories.ts` has 800+ lines but Worlds 2-7 are mostly scaffolded placeholders. This is fine for MVP but incomplete content will break immersion.

**Impact:** Players reaching World 2+ will see generic placeholder dialogue.

### 7c. `mapConfig.ts` — Duplicated Calibration Logic
Zone calibration output logic exists in both `mapConfig.ts` and `calibration.ts`.

**Recommendation:** Consolidate calibration utilities into `utils/calibration.ts` only.

---

## 8. Routing & Navigation

**Current approach:** Zustand `screen` state + switch statement in `App.tsx`.

**Problems:**
- No URL changes → no browser back/forward support
- No deep linking → can't share a link to a specific screen
- All screens are loaded upfront → larger initial bundle
- No transition animations

**Recommendation (MVP):** Keep the switch statement but add:
1. `React.lazy()` + `Suspense` for each screen component (code splitting)
2. A `useEffect` that syncs `screen` to `window.history` for back button support

**Recommendation (Post-MVP):** Migrate to `react-router-dom` (already installed).

---

## 9. Styling & CSS

### 9a. `index.css` — 400+ Lines
Contains Tailwind imports, animations, and ~200 lines of cosmetic CSS classes (nameplates, backgrounds, effects). This is well-organized but could be modularized.

**Recommendation:** Split into:
- `styles/base.css` — Tailwind import, body defaults, number input fix
- `styles/animations.css` — keyframes, shake, bounce, float
- `styles/cosmetics.css` — all nameplate, background, and effect classes

### 9b. Google Fonts in `index.html`
Six font families are loaded synchronously in `<head>`:
```html
Bangers, Bubblegum Sans, Cinzel Decorative, MedievalSharp, Playfair Display, Press Start 2P
```
This blocks rendering until all fonts are downloaded.

**Recommendation:** Add `display=swap` (already present) and consider loading non-critical fonts asynchronously or using `font-display: optional` for less-used fonts.

---

## 10. Assets & Resource Management

### 10a. Missing Assets
Many asset paths are referenced in code but the actual files aren't in the repository:
- Boss sprites (36 images referenced)
- Avatar sprites (20 images)
- Character emotion sprites (Pip: scared, excited, etc.)
- Map images (9 maps)
- SFX files (attack, hit, victory sounds)

**Impact:** The app renders fallback/placeholder UI. This is acceptable for MVP development but tracked nowhere.

**Recommendation:** Create `docs/ASSET_CHECKLIST.md` listing every referenced asset path, its status (exists/missing), and generation notes.

### 10b. Inconsistent Asset Paths
Some assets use `/assets/bosses/[name]/cool/base-position.png`, others reference patterns like `/assets/avatars/[id].png`. There's no centralized asset manifest.

**Recommendation:** Create a single `src/data/assetPaths.ts` that maps every asset key to its path, with a helper that returns a fallback if the file is missing.

### 10c. No Image Preloading
Map backgrounds and boss sprites load on-demand, causing visible pop-in.

**Recommendation:** Preload key assets (world map, current zone map, upcoming boss sprite) when entering the world map screen.

---

## 11. Firebase & Auth

### 11a. No `.env.example`
`firebaseConfig` reads from `import.meta.env.VITE_FIREBASE_*` with empty-string fallbacks. A new developer has no idea what values to set.

**Recommendation:** Create `.env.example`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 11b. Firebase SDK Always Loaded
Even in "offline mode" (Continue without account), the entire Firebase SDK is initialized. Firebase Auth + Firestore adds ~100KB+ to the bundle.

**Recommendation:** Lazy-load Firebase only when the user chooses email/Google sign-in. Use dynamic `import()`.

### 11c. No Firestore Integration
`db` (Firestore) is exported but never used. All data lives in localStorage.

**Impact:** Data is device-bound. Clearing browser data deletes all progress.

### 11d. COPPA Compliance
The app targets ages 5-11 but has no:
- Parent consent flow
- Age verification
- Data deletion mechanism
- Privacy policy

**Recommendation:** Critical to address before public launch. At minimum, add a parental gate before data collection.

---

## 12. Testing

### 12a. Zero Test Coverage
No test files exist anywhere in the project. No testing framework is configured.

**High-priority test targets:**
1. `engine/questions.ts` — question generation, answer checking, operand validity
2. `engine/progression.ts` — XP calculations, level-up logic
3. `engine/mastery.ts` — mastery level transitions, regression
4. `store/gameStore.ts` — profile CRUD, purchase logic, stage progression
5. `engine/achievements.ts` — achievement condition checking

**Recommendation:**
- Install Vitest (pairs well with Vite): `npm install -D vitest @testing-library/react @testing-library/jest-dom`
- Add `"test": "vitest"` to `package.json` scripts
- Write unit tests for engine/ first (pure functions, easy to test)
- Add component tests for critical flows (stage completion, boss fight)

---

## 13. Accessibility

### 13a. No ARIA Labels
Interactive elements (map nodes, shop items, question choices) have no ARIA labels or roles.

### 13b. No Keyboard Navigation
The game is mouse/touch only. Children using assistive devices cannot play.

### 13c. Color Contrast
Some UI elements (subtle gray text on dark backgrounds) may not meet WCAG AA contrast ratios.

**Recommendation:** This is noted in TODO.md. Prioritize:
1. Add `aria-label` to all interactive elements
2. Add `role="button"` to clickable `<div>` elements (or replace with `<button>`)
3. Ensure focus styles are visible
4. Run a Lighthouse accessibility audit

---

## 14. Performance

### 14a. Profile Re-renders
Zustand's `persist` middleware re-serializes the entire state tree on every write. With many profiles and stage results, this could become slow.

**Recommendation:** Use `immer` middleware for structural sharing, or split persisted state into separate storage keys.

### 14b. No Code Splitting
All 10 screens are bundled together. The initial load includes BossFight, Shop, Inventory, etc. even when showing the login screen.

**Recommendation:** Use `React.lazy()`:
```tsx
const BossFight = React.lazy(() => import('./components/game/BossFight'));
```

### 14c. No Asset Optimization
No image compression, no WebP conversion, no sprite sheets.

**Recommendation:** Add `vite-plugin-imagemin` or manually optimize assets before shipping.

---

## 15. Developer Experience

### 15a. README is Boilerplate
`README.md` is the default Vite template README. It doesn't describe:
- What the project is
- How to set up the dev environment
- How to configure Firebase
- How to run/build/test
- The game's architecture

**Recommendation:** Replace with a proper README covering setup, architecture, and contributing guidelines.

### 15b. No `.gitignore` for Assets
Large generated images (map PNGs, boss sprites) could accidentally be committed.

**Recommendation:** Verify `.gitignore` covers generated assets if they're not meant to be versioned. If they should be versioned, that's fine — but document the decision.

### 15c. `console.log` in Production Code
17 `console.log` calls exist in `calibration.ts` and `ZoneMap.tsx`. These are for dev calibration only but will fire in production if someone enters calibration mode.

**Recommendation:** Gate behind `import.meta.env.DEV` check, or use a custom logger that no-ops in production.

---

## 16. Prioritized Action Plan

### Phase 1 — Quick Wins (1-2 days)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | Remove dead dependencies (`pixi.js`, `@pixi/react`, `gsap`, `react-router-dom`) | Bundle size | 10 min |
| 2 | Create `.env.example` with Firebase variable names | DX | 5 min |
| 3 | Replace `README.md` with real project documentation | DX | 30 min |
| 4 | Remove dead `avatarUrl` field from `ChildProfile` | Code hygiene | 15 min |
| 5 | Add `profileId` to `StageResult` type | Data integrity | 15 min |
| 6 | Add error boundary to `App.tsx` | Stability | 20 min |
| 7 | Remove dead theme data (Space/Ocean/Jungle) | Bundle size | 10 min |

### Phase 2 — Architecture Improvements (3-5 days)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 8 | Split `gameStore.ts` into domain slices | Maintainability | 2 hrs |
| 9 | Extract `useBossFight` and `useBossRewards` hooks from BossFight.tsx | Readability | 2 hrs |
| 10 | Extract calibration dev tools from ZoneMap.tsx | Code separation | 1 hr |
| 11 | Add `React.lazy()` code splitting for all screens | Performance | 1 hr |
| 12 | Create `src/constants/` for timing, balance, and dev config | Maintainability | 1 hr |
| 13 | Split `index.css` into modular stylesheets | Maintainability | 30 min |
| 14 | Cap `stageResults` array and clean up old entries | Storage | 30 min |

### Phase 3 — Quality & Reliability (1-2 weeks)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 15 | Set up Vitest + write engine unit tests | Reliability | 1 day |
| 16 | Add rolling-window accuracy to mastery tracking | Accuracy | 2 hrs |
| 17 | Improve distractor generation (%-based, common mistakes) | Gameplay | 2 hrs |
| 18 | Create `ASSET_CHECKLIST.md` tracking all referenced assets | Organization | 1 hr |
| 19 | Add basic ARIA labels and keyboard navigation | Accessibility | 1 day |
| 20 | Lazy-load Firebase SDK | Performance | 2 hrs |

### Phase 4 — Content & Polish (ongoing)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 21 | Complete story content for Worlds 2-7 | Engagement | 2-3 days |
| 22 | Add onboarding tutorial flow | UX | 1 day |
| 23 | Implement Firestore cloud sync | Data safety | 2-3 days |
| 24 | COPPA compliance (parental gate, privacy policy) | Legal | 2-3 days |
| 25 | PWA manifest + service worker | Distribution | 1 day |

---

## Summary Metrics

| Category | Grade | Notes |
|---|---|---|
| **Type Safety** | A | Comprehensive types, strict TS config |
| **Architecture** | B- | Good separation but store is monolithic |
| **Code Quality** | B | Clean code, but large files need splitting |
| **Testing** | F | Zero tests |
| **Accessibility** | F | No ARIA, no keyboard nav |
| **Performance** | C+ | No code splitting, no lazy loading |
| **Dependencies** | C | 4 unused packages |
| **Documentation** | D | README is template, no architecture docs |
| **Content Completeness** | C | Worlds 0-1 done, 2-7 scaffolded |
| **Game Engine** | A- | Solid math engine, good progression curve |
| **Data Model** | B+ | Well-typed but `stageResults` needs cleanup |

---

*Generated from full codebase review. All file references are relative to project root.*
