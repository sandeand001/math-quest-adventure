# Guided Solve — Step-by-Step Problem Walkthrough

## Current State

When a user answers wrong, they see *"The answer was X"* for 800ms, Pip says something encouraging, and the stage moves on. Teaching only happens in the separate Remedial Screen after 2+ consecutive stage failures. There's no in-the-moment explanation of *how* to solve the problem.

## Concept

After a wrong answer on a practice/challenge stage, offer a **"Need help?"** button. If tapped, an overlay walks the user through the solving process step-by-step with animated speech bubbles from Professor Hoot. The walkthrough breaks the problem into intermediate steps — some are visual explanations, some ask the user to compute a smaller piece. The final answer is **never revealed**; instead, the user retries the original question after completing the walkthrough.

## When It Triggers

- **Practice and challenge stages only** — boss/mini-boss stages are unassisted
- After a wrong answer, a "Need help?" button appears alongside Pip's reaction
- Tapping it opens the guided overlay; ignoring it moves to the next question normally
- Available on every wrong answer — since it never reveals the answer and the user must re-do the question, unlimited use is fine

## Step Generation by Operation

The walkthrough generates a **different problem** of the same operation and similar difficulty. It walks through that problem completely, teaching the method. Then the user is presented with their original failed question to retry on their own.

### Addition

**Tier 1–2 (single-digit, 0–20): Counting up**

> Failed question: `3 + 5 = ?`
> Walkthrough uses a similar problem: `4 + 3 = ?`

1. **info** — "Let's learn how to add! Start with the bigger number: **4**"
2. **info** — "Now count up 3 more: **5**... **6**... **7** ✓" (dots appear one at a time)
3. **interactive** — "So 4 + 3 = ?" → user answers **7** → "That's right!"
4. **info** — "Now try your question again!"
5. → Original question `3 + 5 = ?` re-presented

**Tier 3+ (two-digit, 10–100+): Column method — ones first, then tens**

> Failed question: `27 + 15 = ?`
> Walkthrough uses a similar problem: `34 + 28 = ?`

1. **info** — "Let's solve this step by step! We start with the ones place."
2. **info** — Visual: show `34` and `28` stacked vertically, highlight the ones column (`4` and `8`)
3. **interactive** — "What is 4 + 8?" → user answers **12**
4. **info** — "12 is more than 9, so we write the **2** in the ones place and carry the **1** to the tens place." (animated: 2 drops down, 1 floats up to tens column)
5. **info** — Highlight the tens column (`3`, `2`, and the carried `1`)
6. **interactive** — "What is 3 + 2 + 1?" → user answers **6**
7. **info** — "Place the **6** in the tens place. The answer is **62**!" (digits assemble)
8. **info** — "Now try your question again!"
9. → Original question `27 + 15 = ?` re-presented

### Subtraction

**Tier 2 (single-digit, 0–20): Counting back**

> Failed question: `9 - 4 = ?`
> Walkthrough: `8 - 3 = ?`

1. **info** — "Let's take away! Start at **8**."
2. **info** — "Count back 3: **7**... **6**... **5** ✓" (number line hops animated)
3. **interactive** — "So 8 - 3 = ?" → user answers **5**
4. → Original question re-presented

**Tier 3+ (two-digit, 10–100+): Column method with borrowing**

> Failed question: `52 - 27 = ?`
> Walkthrough: `43 - 18 = ?`

1. **info** — "Let's solve this step by step! Start with the ones place."
2. **info** — Show `43` and `18` stacked, highlight ones (`3` and `8`)
3. **info** — "We can't take 8 from 3 — 3 is smaller! We need to borrow from the tens place."
4. **info** — Animated: the `4` becomes `3`, and the `3` becomes `13`. "Borrow 1 ten → the 3 becomes **13**."
5. **interactive** — "Now what is 13 - 8?" → user answers **5**
6. **info** — "Write **5** in the ones place. Now the tens: we have **3** (after borrowing) minus **1**."
7. **interactive** — "What is 3 - 1?" → user answers **2**
8. **info** — "Place the **2** in the tens place. The answer is **25**!" (digits assemble)
9. → Original question re-presented

### Multiplication

**Tier 4 (tables 1–5): Repeated addition with visual groups**

> Failed question: `4 × 3 = ?`
> Walkthrough: `3 × 4 = ?`

1. **info** — "3 × 4 means **3 groups of 4**. Let's count them!"
2. **info** — Show Group 1: 4 dots appear. "Group 1 = **4**"
3. **interactive** — Show Group 2: 4 more dots. "4 + 4 = ?" → user answers **8**
4. **interactive** — Show Group 3: 4 more dots. "8 + 4 = ?" → user answers **12**
5. **info** — "3 groups of 4 = **12**!" (all dots visible)
6. → Original question re-presented

**Tier 6+ (tables 1–10): Skip counting**

> Failed question: `7 × 6 = ?`
> Walkthrough: `6 × 7 = ?`

1. **info** — "6 × 7 means we skip-count by 7, six times!"
2. **info** — "7..." (hop 1 on number line)
3. **interactive** — "7 + 7 = ?" → user answers **14** (hop 2)
4. **interactive** — "14 + 7 = ?" → user answers **21** (hop 3)
5. **interactive** — "21 + 7 = ?" → user answers **28** (hop 4)
6. **interactive** — "28 + 7 = ?" → user answers **35** (hop 5)
7. **interactive** — "35 + 7 = ?" → user answers **42** (hop 6)
8. **info** — "We counted 6 sevens = **42**!"
9. → Original question re-presented

### Division

**Tier 5 (tables 1–5): Fair sharing / skip counting**

> Failed question: `15 ÷ 3 = ?`
> Walkthrough: `12 ÷ 4 = ?`

1. **info** — "12 ÷ 4 means: how many groups of 4 can we make from 12?"
2. **info** — "Take out a group of 4: 12 - 4 = 8. That's **1 group**." (4 dots removed)
3. **interactive** — "Take out another group: 8 - 4 = ?" → user answers **4**. "That's **2 groups**."
4. **interactive** — "Take out another group: 4 - 4 = ?" → user answers **0**. "That's **3 groups**."
5. **info** — "We made **3 groups** of 4 from 12. So 12 ÷ 4 = **3**!"
6. → Original question re-presented

**Tier 6+ (tables 1–10): Same repeated-subtraction approach, scaled**

> Failed question: `56 ÷ 8 = ?`
> Walkthrough: `48 ÷ 6 = ?`

1. **info** — "48 ÷ 6 means: how many 6s fit in 48? Let's count by 6!"
2. **info** — "6..." (1 group)
3. **interactive** — "6 + 6 = ?" → **12** (2 groups)
4. **interactive** — "12 + 6 = ?" → **18** (3 groups)
5. **interactive** — "18 + 6 = ?" → **24** (4 groups)
6. **interactive** — "24 + 6 = ?" → **30** (5 groups)
7. **interactive** — "30 + 6 = ?" → **36** (6 groups)
8. **interactive** — "36 + 6 = ?" → **42** (7 groups)
9. **interactive** — "42 + 6 = ?" → **48** ✓ (8 groups)
10. **info** — "We counted **8 groups** of 6 = 48. So 48 ÷ 6 = **8**!"
11. → Original question re-presented

### Fill-Operand (missing number)

The walkthrough rewrites the problem as its inverse, then walks through that operation:

> Failed question: `___ + 7 = 15`
> Walkthrough: "When something + 7 = 15, we can flip it: 15 - 7 = ?"
> Then walks through `15 - 7` using the appropriate subtraction method for the tier.
> → Original question re-presented

### Word Problems

1. **info** — Highlight the key numbers in the story text
2. **info** — Identify the operation: "The word 'altogether' tells us to **add**!"
3. **info** — "So the equation is: 14 + 9 = ?"
4. Then walks through that equation using the appropriate operation method above
5. → Original question re-presented

### Visual Elements

Each step slides in with a short animation. `info` steps advance on tap. `interactive` steps wait for the user to answer via number input (same style as the main question card).

Visual aids used across walkthroughs:
- **Dot groups** — for multiplication/division at lower tiers
- **Number line hops** — for counting up/back at lower tiers
- **Stacked column layout** — for multi-digit addition/subtraction
- **Carry/borrow animations** — digits float between columns
- **Progressive reveal** — each step builds on the visible result of the previous step

### Generating the "Similar" Problem

The walkthrough problem is generated with these rules:
- Same operation and format as the failed question
- Same tier (same number range)
- Different operands (so the user can't just memorize the answer)
- For column-method problems: similar structure (e.g. if the original required carrying, the walkthrough also requires carrying)

## Architecture — 3 New Pieces

### 1. `src/engine/hintSteps.ts` — Step Generator

Two functions:

- `generatePracticeQuestion(original: Question): Question` — generates a similar but different problem (same operation, tier, and structural properties like carrying/borrowing)
- `generateHintSteps(practice: Question): HintStep[]` — takes the practice question, returns an ordered array of steps

Each `HintStep` has:
  - `text: string` — the instruction/explanation
  - `character: string` — Professor Hoot sprite pose (e.g. `wise`, `proud`)
  - `type: 'info' | 'interactive'`
  - `intermediateAnswer?: number` — for interactive steps, the expected answer
  - `visual?: 'column' | 'dots' | 'number-line' | 'groups'` — which visual aid to render
  - `visualData?: object` — data for the visual (digits, dot counts, positions, etc.)
- Strategy selection based on operation and tier (counting for low tiers, column method for multi-digit, groups for multiplication)

### 2. `src/components/game/GuidedSolve.tsx` — The Overlay

- Full-screen overlay on top of the stage
- Professor Hoot character with speech bubble showing current step
- Step counter ("Step 2 of 5")
- For interactive steps: a small number input that validates the intermediate answer
- Correct intermediate → green flash + advance
- Wrong intermediate → gentle shake + "Try again"
- After all steps complete: "Now try the question again!" → dismiss overlay → the **same question** is re-presented (doesn't count as a new question)

### 3. Integration into `Stage.tsx`

- After a wrong answer on a practice/challenge stage, show "Need help?" button (in the feedback phase, before advancing)
- If guided solve completes, re-serve the same question (rewind `currentQuestionIndex`)
- The retry answer counts toward accuracy whether right or wrong

## What It Doesn't Do

- Never reveals the final answer directly
- Never available on mini-boss or world-boss stages
- Doesn't replace the existing hint system (eliminate-choices / range-hint) — those are quick aids, this is a deeper walkthrough
- Doesn't replace the Remedial Screen — that's still the escalation path for repeated failures

## UX Flow Diagram

```
Wrong answer on practice/challenge stage
  │
  ├─ "Need help?" button appears
  │     │
  │     ├─ User taps "Need help?"
  │     │     │
  │     │     └─ GuidedSolve overlay opens
  │     │           │
  │     │           ├─ Step 1: info (tap to continue)
  │     │           ├─ Step 2: interactive (user answers intermediate)
  │     │           ├─ Step 3: interactive (user answers intermediate)
  │     │           ├─ ...
  │     │           └─ "Now try again!"
  │     │                 │
  │     │                 └─ Same question re-presented
  │     │                       │
  │     │                       ├─ Correct → normal flow continues
  │     │                       └─ Wrong → normal flow (no second walkthrough)
  │     │
  │     └─ User ignores / taps elsewhere
  │           │
  │           └─ Normal flow: next question
```

## Complexity Estimate

- `hintSteps.ts` is the most work — needs per-operation, per-tier strategy templates with number substitution
- `GuidedSolve.tsx` is a self-contained overlay, similar in scope to the existing `StoryDialog` component
- `Stage.tsx` changes are small — add a button, a state flag, and conditional rendering
