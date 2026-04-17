# MathQuest: Adventure Math — Project TODO

## Current Status
- **Phase 1 (MVP Core)**: ~95% complete
- **Phase 2 (Visuals & Curriculum)**: ~60% complete
- **Phase 3 (Polish)**: ~20% complete

---

## Sprint 1 — Core Cleanup & Map Infrastructure

- [x] Remove non-Fantasy theme options (hide Space/Ocean/Jungle, simplify profile creation)
- [x] Interactive world map — full-screen Fantasy map with 8 clickable tier locations on a path
- [x] Stage map inside each world — zone map with 8 nodes (fallback list + image support ready)
- [x] Story text system — intro per world, boss dialogue, victory text (Guide Owl narrator)
- [x] Shop node on overworld map — unlocks after Mystic Meadows
- [x] Calibration tool for map node positioning (extracted to utils)

## Sprint 2 — Avatar & Economy

- [ ] Avatar creation screen — pick base character when creating profile
- [ ] Avatar customization parts — head, body, accessory layers composited together
- [ ] Coin shop — browse/buy cosmetic items with earned coins, owned vs locked display

## Sprint 3 — Game Feel & Feedback

- [ ] Level-up animation — celebratory VFX when player levels up
- [ ] Streak effects — fire/lightning visuals on 5+ and 10+ streaks
- [x] Achievement badges — 19 achievements defined, checker + toast notifications
- [x] Sound mute toggle — visible button in world map header
- [ ] Hint system — free hints in practice stages (visual aids, reduce choices), disabled during boss fights

## Sprint 4 — Engagement & Retention

- [ ] Onboarding tutorial — first-time flow explaining map, stages, boss fights
- [ ] Daily challenges — 5 bonus problems per day for extra coins

## Sprint 5 — Infrastructure & Data

- [ ] PWA manifest & service worker — installable on tablets/phones, offline play
- [ ] Firebase cloud sync — persist profiles/progress to Firestore (currently localStorage only)
- [ ] Configure Firebase security rules — COPPA-compliant, parent-scoped data access
- [ ] Detailed parent analytics — per-skill breakdown, time graphs, mastery visualization

## UI Polish

- [ ] ProfileSelect crystal layout — move crystals to bottom of player card instead of circling around it (looks odd)

## Housekeeping

- [ ] Restore GAME_PLAN.md — updated plan reflecting current 8-tier structure
- [ ] Accessibility audit — screen reader labels, keyboard nav, WCAG AA contrast

---

## Completed

- [x] Project scaffolding (React + TypeScript + Vite + Tailwind)
- [x] Firebase Auth + Firestore config
- [x] GitHub repo + CI push
- [x] Parent auth flow (email/Google + offline mode)
- [x] Child profile management (create, select, multiple profiles)
- [x] Math question engine — all 4 operations, 8 tiers, 5 question formats
- [x] Procedural question generation (random every time)
- [x] 8-tier curriculum: add → sub → add+sub → mul → div → mul+div → all4 → super challenge
- [x] Intra-tier difficulty scaling (0.15 → 1.0 per stage)
- [x] Stage gameplay loop — questions, accuracy tracking, star ratings
- [x] Boss fight system — 9 bosses (cute/cool/final × 3 subjects), HP hearts, SFX
- [x] Boss damage fixed to 1 HP per correct answer
- [x] Boss fight init race condition fixed
- [x] Stage progress persistence to profile (survives reload)
- [x] Mini-boss + world boss victory persistence
- [x] XP + leveling system with stat boosts (HP, attack, shield)
- [x] Streak XP multiplier (×2 at 5, ×3 at 10)
- [x] Mastery tracking per skill with spaced repetition scheduling
- [x] Word problem templates for all 4 operations
- [x] Fill-in-blank auto-focus on input
- [x] Background images on WorldMap, Stage, BossFight screens
- [x] Parent dashboard with basic stats
- [x] Boss assets copied (36 sprites + 9 SFX + 5 backgrounds)
- [x] Multiplication/division capped at 10s tables for K-5 scope
- [x] Interactive overworld map with calibrated node positions
- [x] Zone map component with image support + calibration tool
- [x] Shop node on overworld (unlocks after world 3)
- [x] Story system — 8 worlds of narrative (Guide Owl, boss intros, victory text)
- [x] Achievement system — 19 definitions, checker, toast notifications
- [x] Sound mute toggle
- [x] Removed non-Fantasy theme options

---

## Map Implementation Notes

**Approach**: HTML/CSS overlays on generated map images (no PixiJS needed)
- User generates Fantasy world map art (parchment style, ~1920×1080)
- Clickable nodes positioned via absolute CSS coordinates or SVG overlay
- Nodes show locked 🔒 / unlocked / completed ⭐ states
- Same approach for zone maps inside each world
- Each zone map has 8 nodes connected by a drawn path

**Map art needed**:
1. Overworld map — 8 locations on a winding path (1 image)
2. 8 zone maps — each with 8 stage nodes on a path (8 images)
3. Total: 9 map images to generate

---

*Last updated: April 12, 2026*
