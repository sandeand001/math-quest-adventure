# Independent Codebase Review — MathQuest

Date: April 16, 2026  
Scope: Full repository review of source, configuration, documentation, and asset organization. This document was created independently and does not rely on the existing review file.

---

## Executive Summary

MathQuest has a strong core concept: a polished kid-friendly math RPG with thoughtful curriculum progression, a clear content pipeline, and a surprising amount of gameplay already implemented. The content depth is the biggest strength of the project.

However, the project is not yet in a stable or production-ready engineering state. The most important concerns are not visual polish but correctness, maintainability, and developer safety nets.

### Critical issues

1. **The project does not currently pass the baseline quality gate.**  
   Verified locally: the build fails and lint fails. The current repository cannot be considered release-ready until this is fixed.

2. **Some core progress and analytics data is modeled too loosely.**  
   Stage results do not track which child profile produced them, which breaks meaningful parent reporting and muddies achievement logic.

3. **A few feature systems are only partially wired.**  
   Achievements, unlock conditions, and end-of-world flow contain gaps or placeholder logic.

4. **There is no automated test coverage or CI safety net.**  
   This makes future changes risky, especially with the amount of progression and state logic already present.

### Moderate issues

- State and game flow logic are concentrated in a small number of very large files.
- Several installed dependencies are unused.
- Accessibility is limited for keyboard users and assistive technology.
- Documentation for setup and contribution is underdeveloped.
- Asset naming and repo organization will become harder to manage as content grows.

### Minor issues

- Template leftovers and unused files remain in the repo.
- Some naming and data conventions are inconsistent.
- A few comments explicitly note “production” placeholders that should now be formalized.

---

## Category Grades

| Category | Grade | Notes |
|---|---:|---|
| Functionality | C | Strong feature breadth, but several correctness gaps remain |
| Readability | C | Mostly understandable, but large files mix many concerns |
| File management | C- | Asset sprawl and inconsistent naming make scaling harder |
| Code management | D+ | Store and gameplay logic are too centralized |
| Structure and layout | C- | Feature flow works, but architecture is tightly coupled |
| Dependencies | D | Multiple dependencies are installed but not used |
| Testing | F | No test files and no test script |
| Accessibility | D | Keyboard, labeling, and dialog support are incomplete |
| Performance | C- | Likely acceptable for MVP, but heavy assets and repeated work will hurt on lower-end devices |
| Developer experience | D | Default README, failing checks, and no CI reduce confidence |

---

## Strengths Worth Keeping

Before listing problems, a few strengths are worth protecting during refactors:

- **Good educational content design** in [../src/data/tiers.ts](../src/data/tiers.ts), [../src/data/worlds.ts](../src/data/worlds.ts), and [../src/data/stories.ts](../src/data/stories.ts)
- **A clear progression fantasy** with worlds, bosses, sidekicks, crystals, and unlock loops
- **Reasonable TypeScript coverage** across the app
- **Useful data-driven definitions** for bosses, cosmetics, avatars, and worlds
- **A practical offline-first MVP mindset** using Zustand persistence in [../src/store/gameStore.ts](../src/store/gameStore.ts)

These are solid foundations. The project should improve around them, not replace them.

---

## 1. Functionality Review

### What is working well

- The main game loop is understandable and already playable in concept.
- Stage progression, boss encounters, unlockables, and story beats are all present.
- Curriculum scaling is thoughtfully staged across eight worlds.

### Issues found

#### 1.1 Build and lint are currently broken

- [../src/components/game/BossFight.tsx](../src/components/game/BossFight.tsx)
- [../src/components/game/Stage.tsx](../src/components/game/Stage.tsx)
- [../src/components/game/ZoneMap.tsx](../src/components/game/ZoneMap.tsx)
- [../src/components/ui/CrystalTracker.tsx](../src/components/ui/CrystalTracker.tsx)
- [../src/components/game/Inventory.tsx](../src/components/game/Inventory.tsx)

**What is wrong**
- Local verification shows the production build fails with TypeScript errors.
- ESLint also reports hook order violations, ref misuse during render, and effect misuse.

**Recommendation**
- Treat “clean build + clean lint” as the first blocking milestone.
- Fix hook ordering in ZoneMap, remove render-time ref writes in Stage and BossFight, and clean unused imports/variables.

#### 1.2 Parent dashboard statistics are not trustworthy per child

- [../src/components/auth/ParentDashboard.tsx](../src/components/auth/ParentDashboard.tsx)
- [../src/types/index.ts](../src/types/index.ts)

**What is wrong**
- The dashboard currently uses a placeholder filter:
  “filter(() => true)”
- The StageResult model does not include a profile identifier, so results cannot be attributed to individual players.

**Recommendation**
- Add profileId to each stage result.
- Filter dashboard metrics by the active child profile rather than the global result array.
- Consider storing world, tier, operation, and pass/fail metadata for stronger analytics.

#### 1.3 Achievement flow is only partially connected

- [../src/engine/achievements.ts](../src/engine/achievements.ts)
- [../src/components/game/StageResultScreen.tsx](../src/components/game/StageResultScreen.tsx)
- [../src/components/game/BossFight.tsx](../src/components/game/BossFight.tsx)

**What is wrong**
- Achievement evaluation is only called from the stage result screen.
- Boss-only milestones such as world completion or first boss victory are not wired at the point where those events actually happen.

**Recommendation**
- Move achievement checks into a shared game-event pipeline.
- Trigger checks after stage completion, boss victory, world unlock, and level-up events.

#### 1.4 Unlock conditions exist in data but are not enforced in the UI

- [../src/data/cosmetics.ts](../src/data/cosmetics.ts)
- [../src/components/game/Shop.tsx](../src/components/game/Shop.tsx)

**What is wrong**
- Many cosmetics define unlockCondition values, but shop logic does not enforce them.
- Several world backgrounds have zero cost, which means they can effectively be acquired early.

**Recommendation**
- Implement a single unlock-check helper.
- Make the shop render locked, unlocked, and owned as distinct states.
- Never rely on cost alone to gate progression content.

#### 1.5 Final world completion story content exists but is not clearly triggered

- [../src/data/stories.ts](../src/data/stories.ts)
- [../src/components/ui/StoryDialog.tsx](../src/components/ui/StoryDialog.tsx)

**What is wrong**
- Story entries for world-complete exist, but there is no clear game-flow code invoking them.

**Recommendation**
- Add an explicit post-final-boss sequence with a world-complete state and ending credits flow.

#### 1.6 Firebase login promise exceeds actual persistence behavior

- [../src/firebase/config.ts](../src/firebase/config.ts)
- [../src/components/auth/LoginScreen.tsx](../src/components/auth/LoginScreen.tsx)

**What is wrong**
- Firebase Auth and Firestore are configured, but Firestore is not used anywhere in the app.
- The actual saved state is local persistence only.

**Recommendation**
- Either fully wire cloud sync or clearly label auth as optional and sync as “coming soon.”

---

## 2. Readability Review

### Issues found

#### 2.1 Several files are doing too much

The following files are carrying both UI and business logic:

- [../src/store/gameStore.ts](../src/store/gameStore.ts)
- [../src/components/game/BossFight.tsx](../src/components/game/BossFight.tsx)
- [../src/components/game/Stage.tsx](../src/components/game/Stage.tsx)
- [../src/components/game/ZoneMap.tsx](../src/components/game/ZoneMap.tsx)
- [../src/components/game/Inventory.tsx](../src/components/game/Inventory.tsx)

**What is wrong**
- Rendering, state mutation, progression logic, and unlock logic are interleaved.
- This makes bugs harder to isolate and future changes riskier.

**Recommendation**
- Extract reusable hooks and domain services such as:
  - useStageFlow
  - useBossFightFlow
  - progressionService
  - unlockService
  - analyticsService

#### 2.2 Comments are helpful, but some signal unfinished design

- [../src/components/auth/ParentDashboard.tsx](../src/components/auth/ParentDashboard.tsx)
- [../src/engine/mastery.ts](../src/engine/mastery.ts)

**What is wrong**
- Comments such as “In production…” indicate key behavior is still provisional.

**Recommendation**
- Turn temporary assumptions into tracked issues or TODO items with owners and acceptance criteria.

#### 2.3 Long inline Tailwind strings reduce scanability

This appears across most UI files.

**Recommendation**
- Create small presentational primitives for repeated card, button, panel, and header patterns.
- Consider a component-level styling convention rather than repeating long class blocks.

---

## 3. File Management Review

### Issues found

#### 3.1 Asset organization will become difficult to maintain

- [../public](../public)
- [../docs](../docs)

**What is wrong**
- The repo mixes gameplay code, production assets, design prompts, and narrative source material in a single tree.
- This is workable now, but will get harder as more content is added.

**Recommendation**
- Separate runtime assets from design-source docs more clearly, for example:
  - public/assets for shipped game assets
  - docs/design for prompt and art-generation material
  - docs/gameplay for curriculum and narrative docs

#### 3.2 Filenames with spaces will cause friction

Examples appear throughout backgrounds and map assets under the public folder.

**What is wrong**
- Space-based filenames are harder to script, grep, refactor, and reference consistently.

**Recommendation**
- Rename runtime asset files to kebab-case, such as emerald-forest.png rather than emerald forest.png.

#### 3.3 Template leftovers should be removed

- [../src/assets/react.svg](../src/assets/react.svg)
- [../src/assets/vite.svg](../src/assets/vite.svg)

**What is wrong**
- These appear to be unused starter assets from the initial Vite scaffold.

**Recommendation**
- Remove unused template files to reduce repo noise.

---

## 4. Code Management Review

### Issues found

#### 4.1 The Zustand store has become a catch-all

- [../src/store/gameStore.ts](../src/store/gameStore.ts)

**What is wrong**
- Auth, navigation, profile management, combat state, achievements, audio, and mastery are all in one store.
- This makes it difficult to reason about dependencies and side effects.

**Recommendation**
- Split state into domain slices:
  - auth slice
  - profile slice
  - progression slice
  - ui/navigation slice
  - combat/session slice

#### 4.2 Business logic lives inside components instead of engine modules

- [../src/components/game/Stage.tsx](../src/components/game/Stage.tsx)
- [../src/components/game/BossFight.tsx](../src/components/game/BossFight.tsx)

**What is wrong**
- XP calculation, unlock behavior, reward flow, and stage completion are mostly component-owned.

**Recommendation**
- Move these decisions into pure functions or services and keep components focused on display and event wiring.

#### 4.3 App navigation is manual despite router dependency being installed

- [../src/App.tsx](../src/App.tsx)

**What is wrong**
- The app uses a screen string switch instead of actual routes.
- Browser navigation, deep linking, and developer debugging are limited.

**Recommendation**
- Either remove the router dependency or adopt it properly for top-level screens.

---

## 5. Structure and Layout Review

### What is good

- The current foldering is understandable for a solo or early-stage project.
- Data is already separated from rendering in a number of places.

### Issues found

#### 5.1 Feature boundaries are still too soft

- [../src/components/game](../src/components/game)
- [../src/engine](../src/engine)
- [../src/data](../src/data)

**What is wrong**
- Game UI, domain rules, and content definitions are separated somewhat, but not rigorously.

**Recommendation**
- Move toward feature-oriented modules such as:
  - features/auth
  - features/profiles
  - features/stage-play
  - features/boss-fight
  - features/inventory
  - features/analytics

#### 5.2 There is no clear persistence boundary

- [../src/store/gameStore.ts](../src/store/gameStore.ts)
- [../src/firebase/config.ts](../src/firebase/config.ts)

**What is wrong**
- Storage is effectively embedded in state management, and cloud sync is not abstracted.

**Recommendation**
- Introduce a persistence adapter layer so local and Firebase persistence can share the same API.

---

## 6. Dependency Review

### Issues found

#### 6.1 Several dependencies appear unused

Installed but not referenced in the app source:

- react-router-dom
- gsap
- pixi.js
- @pixi/react

**What is wrong**
- Unused packages increase install time, upgrade surface area, and mental overhead.

**Recommendation**
- Remove them until they are actively used.
- If there is a near-term plan for them, document that plan in the README or TODO file.

#### 6.2 Tooling is incomplete for a TypeScript React project

**Missing or weak areas**
- no formatter setup
- no test runner
- no CI workflow
- no pre-commit checks

**Recommendation**
- Add Prettier or a consistent formatting strategy.
- Add Vitest and Testing Library.
- Add a GitHub workflow to run build and tests on each push.

---

## 7. Testing Review

### Current state

- No test files were found.
- No test script exists in [../package.json](../package.json).

### Risk

This repo already contains non-trivial logic for:

- question generation
- difficulty scaling
- XP progression
- mastery tracking
- unlock systems
- boss progression

Without tests, regressions are highly likely.

### Recommendation

Start with a pragmatic test pyramid:

#### High priority unit tests
- [../src/engine/questions.ts](../src/engine/questions.ts)
- [../src/engine/progression.ts](../src/engine/progression.ts)
- [../src/engine/mastery.ts](../src/engine/mastery.ts)
- [../src/engine/achievements.ts](../src/engine/achievements.ts)

#### High priority component tests
- [../src/components/game/QuestionCard.tsx](../src/components/game/QuestionCard.tsx)
- [../src/components/auth/ProfileSelect.tsx](../src/components/auth/ProfileSelect.tsx)

#### Recommended first scenarios
- question generation stays within the configured ranges
- division problems always divide cleanly
- stars are awarded correctly
- XP and level-up rewards are correct
- profile creation and deletion flows work
- boss victory advances the correct world and stage

---

## 8. Accessibility Review

### Issues found

#### 8.1 Keyboard and screen-reader support are incomplete

- [../src/components/game/WorldMap.tsx](../src/components/game/WorldMap.tsx)
- [../src/components/game/ZoneMap.tsx](../src/components/game/ZoneMap.tsx)
- [../src/components/ui/StoryDialog.tsx](../src/components/ui/StoryDialog.tsx)

**What is wrong**
- Many interactions are icon-only or click-anywhere overlays.
- Story dialog progression is mouse/tap oriented and lacks a clear keyboard affordance.
- There is no visible focus management for modal-style overlays.

**Recommendation**
- Add proper dialog semantics, focus trapping, Escape handling, and keyboard progression.
- Add visible focus states and aria labels for icon buttons.

#### 8.2 Form fields do not have robust accessible labeling

- [../src/components/auth/LoginScreen.tsx](../src/components/auth/LoginScreen.tsx)
- [../src/components/auth/ProfileSelect.tsx](../src/components/auth/ProfileSelect.tsx)
- [../src/components/game/QuestionCard.tsx](../src/components/game/QuestionCard.tsx)

**What is wrong**
- Inputs rely primarily on placeholder text instead of explicit labels.
- Error states are visual, but not announced.

**Recommendation**
- Add label elements or visually-hidden labels and aria-live for feedback messages.

#### 8.3 There is at least one invalid interactive nesting pattern

- [../src/components/auth/ProfileSelect.tsx](../src/components/auth/ProfileSelect.tsx)

**What is wrong**
- A delete button is rendered inside a larger clickable profile button.
- This is a semantic and accessibility anti-pattern.

**Recommendation**
- Refactor the profile card into a non-button container with separate action buttons, or separate the main action from the delete control.

---

## 9. Performance Review

### Issues found

#### 9.1 Audio objects are recreated on demand

- [../src/components/game/BossFight.tsx](../src/components/game/BossFight.tsx)

**What is wrong**
- A new Howl instance is created on each sound trigger.

**Recommendation**
- Create and reuse a small sound manager so frequently played effects are pooled or cached.

#### 9.2 Heavy visual assets may stress low-end devices

- [../public/assets](../public/assets)
- [../src/components/ui/AvatarDisplay.tsx](../src/components/ui/AvatarDisplay.tsx)
- [../src/index.css](../src/index.css)

**What is wrong**
- The app relies on many large background images, layered character art, and animated CSS effects.
- This is likely fine on a strong desktop, but may lag on older tablets and school hardware.

**Recommendation**
- Add image compression, responsive sizing, and lazy loading where possible.
- Audit the largest PNG files and consider WebP for shipped assets.

#### 9.3 Render-time lookup work repeats often

Examples include repeated array searches in display components and render branches.

**Recommendation**
- Memoize lookups or normalize frequently used data into maps keyed by id.

---

## 10. Developer Experience Review

### Issues found

#### 10.1 Onboarding docs are not project-specific yet

- [../README.md](../README.md)

**What is wrong**
- The README is still the default Vite template, so new contributors do not get setup instructions, architecture context, or gameplay overview.

**Recommendation**
- Replace it with a real project README containing:
  - purpose of the game
  - setup steps
  - environment variables
  - commands
  - architecture notes
  - asset/content workflow

#### 10.2 Build confidence is low on first checkout

**Verified state**
- Dev server starts successfully.
- Production build fails.
- Lint fails.

**Recommendation**
- Make “fresh clone → install → dev → build → test” reliable before adding more scope.

#### 10.3 CI and contribution guardrails are missing

**Recommendation**
- Add a simple GitHub Actions workflow that runs:
  - install
  - lint
  - build
  - tests

---

## Prioritized Action Plan

### Phase 0 — Stabilize the repo now

Goal: make the project safe to change again.

1. Fix all current build and lint failures
2. Repair hook-order issues in ZoneMap
3. Remove ref mutations during render in Stage and BossFight
4. Remove unused imports, variables, and template leftovers
5. Fix the SVG typing issue in CrystalTracker

**Expected impact:** very high  
**Effort:** low to medium

---

### Phase 1 — Repair correctness and data modeling

Goal: fix the most important user-facing logic flaws.

1. Add profileId to stage results
2. Fix Parent Dashboard to show real child-specific analytics
3. Wire achievements to boss wins, world wins, and level-up events
4. Enforce cosmetic and avatar unlock conditions consistently
5. Add a proper final world-completion sequence

**Expected impact:** very high  
**Effort:** medium

---

### Phase 2 — Add quality safeguards

Goal: reduce regression risk.

1. Add a test script and Vitest
2. Add unit tests for engine modules
3. Add smoke tests for major flows
4. Add CI for build and tests
5. Add formatting and pre-commit checks

**Expected impact:** high  
**Effort:** medium

---

### Phase 3 — Refactor architecture for growth

Goal: make the game easier to extend.

1. Split the global store into domain slices
2. Move progression and reward logic out of UI components
3. Adopt a cleaner routing/navigation strategy
4. Add a persistence abstraction for local and Firebase storage
5. Normalize data access with helper maps and selectors

**Expected impact:** high  
**Effort:** medium to high

---

### Phase 4 — Accessibility and performance polish

Goal: prepare for broader child and parent usage.

1. Add labels, focus handling, and keyboard support
2. Refactor modal/dialog behavior for accessibility
3. Optimize large images and effect-heavy screens
4. Cache audio and reduce repeated render work
5. Add a tablet-focused performance pass

**Expected impact:** medium to high  
**Effort:** medium

---

## Final Verdict

This project has **strong product potential** and a noticeably creative educational core. The content, progression structure, and visual ambition are already ahead of many hobby-stage projects.

From an engineering perspective, though, the repo is best described as **feature-rich but fragile**. The next step should not be adding more worlds or polish. The next step should be stabilizing the current architecture, fixing correctness gaps, and establishing a testing baseline.

If those areas are addressed, MathQuest can move from an impressive prototype into a maintainable and shippable game.
