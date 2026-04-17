# MathQuest Codebase Review 2

Date: April 16, 2026  
Reviewer: GitHub Copilot  
Review type: Independent repository review

## Scope

This review was performed independently from the existing review documents in `docs/`. I read the source, configuration, and documentation files across the repository and inventoried the shipped asset tree in `public/`.

Two notes on scope:

- All text-based project files were read directly.
- Binary assets in `public/` were reviewed by path, naming, organization, and file-size footprint rather than pixel-by-pixel visual inspection.

Verified repo state during review:

- `npm run build` fails with 5 TypeScript errors.
- `npm run lint` fails with 13 errors and 3 warnings.
- `public/` currently contains 204 files totaling 357.65 MB.
- The single largest shipped asset is `public/assets/backgrounds/night-sky.jpg` at 15.76 MB.

---

## 1. Executive Summary

MathQuest has a strong product core. The curriculum progression is thoughtfully structured, the world/boss/crystal loop is cohesive, and the data-driven content layer is already richer than most projects at this stage. The repo clearly reflects serious creative work.

The main problem is that the engineering layer has not caught up with the amount of content and feature surface area. The project is feature-rich, but it is now fragile. Several correctness issues are verified by the failing build and lint runs, large components are carrying too much game logic, analytics data is modeled too loosely, and there are no automated tests or CI protections.

### Critical issues

1. The repository fails basic quality gates right now: `npm run build` and `npm run lint` both fail.
2. Parent analytics are not trustworthy because stage results are global and not tied to a child profile.
3. The state layer is over-centralized in `src/store/gameStore.ts`, which now acts as a catch-all for unrelated concerns.
4. There is no automated testing, no test script, and no CI workflow to protect progression logic.
5. Asset delivery is too heavy for a child-focused web game, with a `public/` footprint of 357.65 MB.

### Moderate issues

1. Several gameplay systems are only partially wired, including achievements, unlock conditions, and final world-completion flow.
2. Accessibility support is minimal: no ARIA usage was found, there is no keyboard dialog handling, and several forms rely on placeholders instead of labels.
3. Multiple installed dependencies appear unused.
4. Asset naming is inconsistent, and some runtime asset filenames appear misspelled.
5. The README and contributor setup story are still near-template quality.

### Minor issues

1. Template leftovers and legacy fields still exist.
2. Several UI files repeat large blocks of Tailwind classes and lookup logic.
3. Design docs and runtime assets are both present, but the repo organization will get harder to manage as content grows.

---

## 2. Grade Summary

| Category | Grade | Reason |
| --- | --- | --- |
| Functionality | C | Good breadth, but verified build/lint failures and data-model gaps block confidence |
| Readability | C | Mostly understandable, but large files mix rendering, flow, and domain logic |
| File management | C- | Asset sprawl, heavy media footprint, inconsistent naming |
| Code management | D+ | Store and feature logic are too centralized |
| Structure and layout | C | Current layout is workable, but feature boundaries are weak |
| Dependencies | D | Several installed packages appear unused |
| Testing | F | No tests, no test command, no CI safety net |
| Accessibility | D | Minimal semantic support, no ARIA usage found, weak keyboard support |
| Performance | C- | Heavy assets, no code splitting, repeated runtime work |
| Developer experience | D | Boilerplate README, broken quality checks, limited scripts, no env template |

---

## 3. Detailed Findings By Topic

### 3.1 Functionality

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| `src/components/game/BossFight.tsx`, `src/components/game/Stage.tsx`, `src/components/game/ZoneMap.tsx`, `src/components/game/QuestionCard.tsx`, `src/components/game/StageResultScreen.tsx`, `src/components/ui/CrystalTracker.tsx`, `src/components/game/Inventory.tsx` | The project currently fails both build and lint. The build is blocked by unused variables and an invalid `title` prop on `svg`. Lint also reports hook-order violations, render-time ref mutation, and effect misuse. | Make “clean lint + clean build” the immediate gate before any new feature work. Fix these before expanding scope. |
| `src/components/auth/ParentDashboard.tsx`, `src/types/index.ts` | Parent analytics are not real per-child analytics. `ParentDashboard` uses `filter(() => true)` instead of actual child scoping, and `StageResult` has no `profileId`. | Add `profileId` to stage results, store results per child or keyed by child, and rebuild dashboard metrics on top of that model. |
| `src/engine/achievements.ts`, `src/components/game/StageResultScreen.tsx`, `src/components/game/BossFight.tsx` | Achievement evaluation is stage-result-centric, but boss wins and world wins are major game events. That creates gaps between actual play events and achievement updates. | Move achievement checks behind a small event-based API that can run after stage completion, boss victory, world unlock, and level-up. |
| `src/data/cosmetics.ts`, `src/components/game/Shop.tsx` | Cosmetic items define `unlockCondition`, but shop logic does not enforce those conditions. Unlock metadata exists without an actual rule engine. | Implement a single unlock helper and make the shop render `locked`, `available`, and `owned` as separate states. |
| `src/data/stories.ts`, `src/components/ui/StoryDialog.tsx` | `world-complete` story content exists, but no usage was found outside sprite-selection logic. The ending content appears authored but not actually wired into the gameplay flow. | Add an explicit world-complete transition, especially after the final boss, and trigger the authored end sequence intentionally. |
| `src/firebase/config.ts`, `src/components/auth/LoginScreen.tsx` | Firebase auth is present, but Firestore sync is not actually used anywhere. The UI suggests saved progress, while persistence is still local-only. | Either fully wire sync or clearly label cloud sync as not yet implemented. Avoid half-promising account-backed persistence. |

### 3.2 Readability

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| `src/store/gameStore.ts` | One file manages auth, navigation, profiles, session state, stage state, boss state, achievements, mastery, and audio. This is now too much to read and too risky to change casually. | Split the store into domain slices: auth, profiles, progression/session, combat, achievements, audio. |
| `src/components/game/BossFight.tsx` | This file mixes combat flow, story flow, rewards, unlocks, audio, rendering, and post-fight transitions. It is the highest-maintenance component in the repo. | Extract `useBossFightFlow`, `useBossRewards`, and small presentation components for boss HUD and end-state panels. |
| `src/components/game/Stage.tsx`, `src/components/game/ZoneMap.tsx`, `src/components/game/Inventory.tsx` | These components also mix domain decisions and rendering, which makes behavior harder to trace. | Move progression and unlock logic into pure helpers or hooks so the component body is mostly UI. |
| Most files in `src/components/` | Large repeated Tailwind class strings and repeated lookup patterns reduce scanability. | Introduce small UI primitives or helper class patterns for repeated panel, card, and button variants. |
| `src/components/ui/StoryDialog.tsx` | Character-expression selection is clever, but string-matching story text to infer sprite state is brittle and will become hard to reason about as the script expands. | Convert to explicit expression metadata in `stories.ts` instead of inferring mood from freeform dialog text. |

### 3.3 File Management

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| `public/` | The shipped asset tree is large: 204 files and 357.65 MB. That is a serious operational concern for a browser game that may run on tablets and school hardware. | Set a target asset budget, compress images, and avoid shipping oversized backgrounds and boss sprites unoptimized. |
| `public/assets/backgrounds/night-sky.jpg` and many large boss/map PNGs | Several files are individually very large. The largest single background is 15.76 MB, and many boss and map PNGs are between roughly 2.5 MB and 3.7 MB. | Convert large imagery to optimized formats, add resolution variants, and load only what the current screen needs. |
| `public/assets/mini-bosses/zephyr/deafeted-position.png`, `public/assets/mini-bosses/glimmer/attack.position.png`, `public/assets/bosses/riddle-sphinx/atack-position.png` | Some runtime asset filenames are misspelled or inconsistent. The code expects `defeated-position.png` and `attack-position.png`, so these mismatches are likely to create missing-image bugs. | Normalize sprite filenames and add a verification script that checks expected asset names against actual files. |
| `public/assets/...` | Many runtime asset filenames include spaces. This is manageable in small projects, but it complicates automation, refactors, and consistency. | Rename shipped runtime assets to kebab-case. Keep prompt docs and art notes human-friendly if needed. |
| `docs/`, `public/`, `src/assets/` | The repo contains runtime assets, design prompts, story docs, and starter assets together. It is understandable now, but will get harder to navigate as content grows. | Separate design/source docs more clearly from shipped runtime assets. |
| `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png` | These appear to be template or legacy leftovers rather than active runtime content. | Remove or document them if they still have a purpose. |

### 3.4 Code Management

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| `src/store/gameStore.ts` | The app’s state architecture is strongly coupled to UI flow. As the game grows, this store will become a bottleneck for maintenance, debugging, and testing. | Split by responsibility and keep persistence and mutation APIs narrow. |
| `src/App.tsx` | Screen navigation is a switch on a string enum. This is acceptable for a tiny prototype, but it is now limiting deep-linking, browser navigation semantics, and screen-level code splitting. | Either remove `react-router-dom` and commit to a lightweight custom router pattern, or adopt actual route-based navigation for top-level screens. |
| `src/components/game/Shop.tsx`, `src/components/game/Inventory.tsx` | Both components call `setScreen('profile-select')` during render when there is no profile. That is a render-time side effect. | Move these redirects into an effect or better, prevent rendering these screens without valid route/state preconditions. |
| `src/components/game/Stage.tsx`, `src/components/game/BossFight.tsx` | Both mutate refs during render (`profileRef.current = ...`), which is exactly what lint is flagging. | Replace render-time ref mutation with effect-driven synchronization or restructure the completion logic so it does not depend on mutable refs. |
| `src/components/game/QuestionCard.tsx`, `src/components/game/StageResultScreen.tsx` | Both are using effects primarily to trigger state updates, which is flagged by the current React lint rules. | Derive state directly from props where possible, or use a reducer/keyed reset pattern instead of effect-driven state resets. |

### 3.5 Structure And Layout

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| `src/components/`, `src/engine/`, `src/data/`, `src/store/` | The current folder layout is workable, but feature boundaries are still weak. Business logic is spread between components, store, and engine files without a clear “owner” per feature. | Move toward feature-first modules or at least introduce `hooks/` and `services/` so behavior is not trapped in screen components. |
| `src/firebase/config.ts`, `src/store/gameStore.ts` | Persistence and auth do not have a stable abstraction boundary. Local storage is embedded in the store, while Firebase exists beside it without an integration contract. | Add a persistence adapter layer so local and remote persistence can be swapped or combined safely. |
| `src/data/stories.ts`, `src/data/worlds.ts`, `src/data/bosses.ts`, `src/data/crystals.ts` | The content model is mostly good, but extra authored content and extra asset folders indicate some drift between shipped gameplay scope and content ambition. | Add a lightweight content schema checklist so every authored world, boss, story, and asset set can be verified for completeness. |

### 3.6 Dependencies

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| `package.json`, `package-lock.json` | `react-router-dom`, `gsap`, `pixi.js`, and `@pixi/react` are installed, but no usage was found in `src/`. That is extra install/update burden and extra confusion for contributors. | Remove unused packages until they are actually part of the implementation. |
| `package.json` | Script coverage is minimal. There is no `test`, no dedicated `typecheck`, no formatting command, and no audit script for assets or content validation. | Add `typecheck`, `test`, and optionally `format` and `verify:assets` scripts. |
| `package.json` | The app imports from the Firebase meta-package and currently uses only a subset of Firebase modules. | Keep modular imports, but document exactly which Firebase services are actually in use today. |

### 3.7 Testing

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| Entire repo | No test files were found, and there is no test script. | Add Vitest and Testing Library, starting with engine-level tests. |
| `src/engine/questions.ts` | Question generation is core gameplay logic and should be protected first. | Test range limits, clean division generation, duplicate avoidance, and format selection by difficulty. |
| `src/engine/progression.ts` | XP and leveling directly affect player trust and balancing. | Test XP growth, stat unlock thresholds, and star calculations. |
| `src/engine/mastery.ts` | Mastery is already marked as simplified in comments. Without tests, future tuning is risky. | Add tests for transitions between `learning`, `practicing`, and `mastered`. |
| `src/store/gameStore.ts` | Profile creation, purchasing, unlocks, and progression are stateful and easy to regress. | Add store tests around purchases, unlock gating, stage advancement, and profile deletion. |

### 3.8 Accessibility

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| `src/components/**` | No `aria-` usage was found in component files, and no `role="dialog"`, `tabIndex`, or `onKeyDown` usage was found for modal/overlay interaction. | Add a baseline accessibility pass: labels, dialog roles, keyboard handling, and focus management. |
| `src/components/auth/LoginScreen.tsx`, `src/components/auth/ProfileSelect.tsx`, `src/components/game/QuestionCard.tsx` | Inputs rely heavily on placeholder text rather than explicit labels, which weakens screen-reader support and form clarity. | Add labels or visually-hidden labels and announce validation errors via live regions. |
| `src/components/ui/StoryDialog.tsx` | The story dialog is click-anywhere and modal-like, but lacks dialog semantics, focus trapping, and keyboard progression. | Turn it into a proper dialog with focus management and explicit next/close actions. |
| `src/components/auth/ProfileSelect.tsx` | A delete button is nested inside a larger clickable profile button. That is a semantic and accessibility anti-pattern. | Refactor the profile card so the primary selection action and delete action are separate controls. |
| `src/components/game/WorldMap.tsx`, `src/components/game/ZoneMap.tsx` | Icon-only buttons and map nodes are visually clear, but accessible names and keyboard support are incomplete. | Add `aria-label` values and keyboard-selectable map controls. |

### 3.9 Performance

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| `public/`, `src/App.tsx` | The app imports all main screens eagerly and ships a very heavy asset tree. Even before bundle analysis, this combination is a performance risk. | Add route- or screen-level lazy loading and reduce initial asset load aggressively. |
| `src/components/game/BossFight.tsx` | A new `Howl` instance is created per sound trigger. That increases allocation churn during combat. | Cache or pool audio instances via a small sound manager. |
| `src/components/ui/AvatarDisplay.tsx`, `src/components/ui/CrystalTracker.tsx`, multiple UI components | Many lookups are repeated in render using array searches, especially for cosmetics, crystals, and sidekicks. | Normalize static data into maps keyed by id, or memoize common lookups. |
| `index.html`, `src/index.css` | Six Google font families are loaded up front, while the base body font still uses the system stack. | Reduce initial font payload and load specialized fonts only where they are actually needed. |
| Entire repo | A proper bundle-size review is blocked because `npm run build` is currently failing. | Fix the build first, then measure the output bundle and set a budget. |

### 3.10 Developer Experience

| Files | What is wrong | Recommendation |
| --- | --- | --- |
| `README.md` | The README is still the default Vite template and does not describe setup, architecture, asset workflow, or project goals. | Replace it with a real project README immediately. |
| `package.json` | There is no `test` or `typecheck` script, so contributors do not have a clear daily validation workflow. | Add a standard contributor command set. |
| Repo root | No `.env.example` was found, even though Firebase config expects multiple `VITE_FIREBASE_*` variables. | Add `.env.example` and document required vs optional values. |
| Repo-wide | No CI configuration was found to enforce build/lint/test health. | Add a GitHub Actions workflow that runs lint, typecheck/build, and tests on every PR. |
| `TODO.md` | The TODO file is useful and specific, but it mixes product roadmap, technical debt, and asset work. | Split roadmap, technical debt, and launch-readiness checklists so the engineering priorities stay visible. |

---

## 4. Prioritized Action Plan

### Phase 0: Stabilize The Repository

Goal: make the current repo safe to change again.

| Order | Task | Impact | Effort |
| --- | --- | --- | --- |
| 1 | Fix all current `build` failures | Very high | Low |
| 2 | Fix all current `lint` failures, especially hook-order and render-time ref issues | Very high | Low |
| 3 | Remove unused imports, dead state variables, and invalid `svg` prop usage | High | Low |
| 4 | Fix asset filename mismatches that can cause missing battle sprites | High | Low |
| 5 | Add a `typecheck` script so TS failures are easier to run directly | High | Low |

### Phase 1: Fix Data Integrity And Gameplay Wiring

Goal: ensure the game records and reports correct player state.

| Order | Task | Impact | Effort |
| --- | --- | --- | --- |
| 1 | Add `profileId` to stage results | Very high | Low |
| 2 | Rebuild parent dashboard analytics using per-child results | Very high | Medium |
| 3 | Wire achievements to boss wins, world wins, and level events | High | Medium |
| 4 | Enforce `unlockCondition` logic in the shop and inventory flows | High | Medium |
| 5 | Add an explicit final world-completion / ending flow | Medium | Medium |

### Phase 2: Add Safety Nets

Goal: reduce regression risk for progression-heavy logic.

| Order | Task | Impact | Effort |
| --- | --- | --- | --- |
| 1 | Add Vitest and a `test` script | Very high | Low |
| 2 | Cover `questions.ts`, `progression.ts`, and `mastery.ts` with unit tests | Very high | Medium |
| 3 | Add store tests for purchases, unlocks, and progression | High | Medium |
| 4 | Add GitHub Actions for lint, build, and tests | High | Low |
| 5 | Add `.env.example` and contributor setup docs | Medium | Low |

### Phase 3: Refactor For Growth

Goal: make the project easier to extend without creating more fragile screens.

| Order | Task | Impact | Effort |
| --- | --- | --- | --- |
| 1 | Split `gameStore.ts` into domain slices | Very high | Medium |
| 2 | Extract boss, stage, and reward logic into hooks/services | High | Medium |
| 3 | Introduce feature-level boundaries or a `hooks/` + `services/` layer | High | Medium |
| 4 | Decide on routing direction: proper router or intentionally simple custom navigation | Medium | Medium |
| 5 | Add a persistence abstraction for local vs Firebase state | Medium | Medium |

### Phase 4: Improve Delivery Quality

Goal: make the app more usable on real devices and more inclusive for players.

| Order | Task | Impact | Effort |
| --- | --- | --- | --- |
| 1 | Compress and budget large assets, starting with backgrounds and boss sprites | Very high | Medium |
| 2 | Add code splitting / lazy loading for top-level screens | High | Medium |
| 3 | Add keyboard and dialog accessibility support | High | Medium |
| 4 | Add ARIA labeling and focus styles to map, dialog, shop, and auth flows | High | Medium |
| 5 | Cache combat audio and reduce repeated render-time lookups | Medium | Low |

---

## 5. Closing Assessment

MathQuest is closer to a shippable game design than it is to a shippable codebase. The educational and creative foundation is already strong. The next high-value move is not adding more content. It is stabilizing the engineering layer so the existing game can be trusted, maintained, and extended safely.

If I had to summarize the project in one sentence, it would be this:

> The game design is ahead of the codebase maturity.

That is a good problem to have, but it needs to be addressed now before the next wave of content makes the current architecture harder to recover.