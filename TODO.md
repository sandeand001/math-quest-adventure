# MathQuest: Adventure Math — Project TODO

## Current Status
- **Phase 1 (MVP Core)**: ✅ Complete
- **Phase 2 (Visuals & Curriculum)**: ~85% complete
- **Phase 3 (Polish)**: ~70% complete

---

## Sprint 1 — Core Cleanup & Map Infrastructure

- [x] Remove non-Fantasy theme options (hide Space/Ocean/Jungle, simplify profile creation)
- [x] Interactive world map — full-screen Fantasy map with 8 clickable tier locations on a path
- [x] Stage map inside each world — zone map with 8 nodes (fallback list + image support ready)
- [x] Story text system — intro per world, boss dialogue, victory text (Guide Owl narrator)
- [x] Shop node on overworld map — unlocks after Mystic Meadows
- [x] Calibration tool for map node positioning (extracted to utils)

## Sprint 2 — Avatar & Economy

- [x] Avatar creation screen — pick base character when creating profile
- [ ] Avatar customization parts — head, body, accessory layers composited together
- [x] Coin shop — browse/buy cosmetic items with earned coins, owned vs locked display

## Sprint 3 — Game Feel & Feedback

- [x] Level-up animation — celebratory VFX + SFX on stage result screen
- [x] Streak effects — screen border glow on 5+, golden burst on 10+
- [x] Achievement badges — 19 achievements defined, checker + toast notifications
- [x] Sound mute toggle — visible button in world map header
- [x] Hint system — free hints in practice stages (eliminates 2 wrong choices or shows range)
- [x] SFX on correct/wrong answers — synthesized audio chime/buzz via Web Audio API
- [x] Pip commentary — persistent Pip on stages with randomized reactions
- [x] Question slide transitions — cards slide out/in between questions

## Sprint 4 — Engagement & Retention

- [x] Onboarding tutorial — first-time flow on world map explaining map, stages, boss fights
- [x] Daily challenges — 5 bonus problems per day for extra coins, accessible from world map
- [x] Remedial training — Prof Hoot lessons with visual strategies + practice after stage failures

## Sprint 5 — Infrastructure & Data

- [x] PWA manifest & service worker — installable on tablets/phones, offline-capable
- [x] Firebase cloud sync — persist profiles/progress to Firestore
- [x] Firebase security rules — parent-scoped data access
- [x] Detailed parent analytics — per-skill mastery breakdown, recent stage history

## UI Polish

- [x] ProfileSelect layout — wider cards, centered avatar, visible sidekick
- [x] Boss sprite scaling — final boss (Archimedes) much larger than other bosses

## Housekeeping

- [x] Codebase review — 34+ of 42 issues resolved
- [x] Accessibility audit — ARIA labels, keyboard nav, focus management on key screens
- [ ] Asset compression — ~358 MB of PNGs needs optimization

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
