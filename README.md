# MathQuest

A kid-friendly math RPG for ages 5–11. Players journey through eight worlds, answering
math questions to defeat monsters, collect crystals, earn sidekicks, and unlock
cosmetics. Curriculum scales from basic addition up to multi-digit multiplication and
division across mastery-aware difficulty tiers.

Status: MVP in active development.

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** (dev server + production build)
- **Tailwind CSS 4**
- **Zustand 5** with `persist` middleware (local-first progression)
- **Firebase** (Auth scaffolded; Firestore sync not yet wired — see _Firebase_ below)
- **Howler** for sound effects
- **ESLint 9** (flat config) + **TypeScript 6** strict

---

## Getting started

Prerequisites: **Node 20+** and **npm 10+**.

```powershell
git clone <repo-url>
cd "Math Game"
npm install
cp .env.example .env.local   # fill in Firebase values (optional)
npm run dev
```

The dev server runs at http://localhost:5173.

### Scripts

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR                    |
| `npm run build`     | Type-check + production build to `dist/`              |
| `npm run typecheck` | Type-check only (no emit)                             |
| `npm run lint`      | Run ESLint across the workspace                       |
| `npm run preview`   | Preview the production build locally                  |

---

## Project layout

```
src/
  App.tsx                  // top-level screen switch
  main.tsx                 // Root render + ErrorBoundary
  components/
    auth/                  // LoginScreen, ProfileSelect, ParentDashboard
    game/                  // WorldMap, ZoneMap, Stage, BossFight, Shop, Inventory, …
    ui/                    // AvatarDisplay, HeartsBar, CrystalTracker, StoryDialog, …
  data/                    // Static content: worlds, bosses, crystals, avatars, stories, …
  engine/                  // Pure logic: question generation, progression/XP, mastery, achievements
  store/gameStore.ts       // Zustand store (profiles, session, combat, mastery, achievements)
  types/index.ts           // Shared TypeScript types
  firebase/config.ts       // Firebase app initialization
  utils/                   // calibration helpers, etc.
public/
  assets/                  // Shipped runtime art (avatars, bosses, maps, backgrounds, SFX)
docs/                      // Reviews, story scripts, art prompts, asset docs
```

Guidelines:

- **Pure functions live in `src/engine/`.** Anything that can be unit-tested without
  React or Zustand should go here.
- **Static content lives in `src/data/`.** Worlds, bosses, crystals, avatars, cosmetics,
  stories, and achievement definitions are all data.
- **UI components never call the engine directly.** Screens invoke store actions;
  actions compose engine functions.
- **Avoid side effects during render.** Use `useEffect` for DOM or external side
  effects only. Derive state where possible; prefer lazy `useState` initializers
  over "setState-in-effect on mount" patterns.

---

## Firebase

`src/firebase/config.ts` reads `import.meta.env.VITE_FIREBASE_*`. Copy
`.env.example` to `.env.local` and fill in values from your Firebase project console.

Current state:

- **Auth** — wired (email/Google sign-in, plus a "continue without account" path).
- **Firestore** — initialized but **not yet used**. All persistence today is
  localStorage via Zustand's `persist` middleware. Progress is device-bound.

If you leave the env values blank, the app still runs in local-only mode.

---

## Contributing

Before opening a PR, make sure the baseline gates pass locally:

```powershell
npm run lint
npm run typecheck
npm run build
```

Keep changes scoped: don't introduce unrelated refactors in the same PR as a feature
or bug fix. See [docs/CODEBASE_REVIEW_SUMMARY.md](docs/CODEBASE_REVIEW_SUMMARY.md) for
the prioritized improvement plan; pick tasks from there if you're looking for
something to work on.

---

## License

TBD.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
