import { describe, it, expect } from 'vitest';
import { generateQuestion, generateStageQuestions } from './questions';
import { TIERS } from '../data/tiers';

function checkEquationConsistency(q: ReturnType<typeof generateQuestion>): void {
  const { operandA: a, operandB: b, operation, blankPosition, answer } = q;
  switch (operation) {
    case 'addition':
      if (blankPosition === 'result') expect(answer).toBe(a + b);
      if (blankPosition === 'left') expect(answer + b).toBe(a + b);
      break;
    case 'subtraction':
      if (blankPosition === 'result') expect(answer).toBe(a - b);
      break;
    case 'multiplication':
      if (blankPosition === 'result') expect(answer).toBe(a * b);
      break;
    case 'division':
      // In division questions we generate dividend/divisor so a/b is always clean
      if (blankPosition === 'result') expect(answer).toBe(a / b);
      break;
  }
}

describe('generateQuestion', () => {
  it('throws on an invalid tier', () => {
    expect(() => generateQuestion(999)).toThrow();
  });

  it('produces valid questions for each tier', () => {
    for (let tier = 1; tier <= TIERS.length; tier++) {
      for (let i = 0; i < 20; i++) {
        const q = generateQuestion(tier);
        expect(q.tier).toBe(tier);
        expect(q.id).toBeTruthy();
        expect(q.operandA).toBeTypeOf('number');
        expect(q.operandB).toBeTypeOf('number');
        expect(q.answer).toBeTypeOf('number');
        expect(q.displayEquation).toBeTruthy();
        checkEquationConsistency(q);
      }
    }
  });

  it('produces non-negative subtraction results (no negative answers for kids)', () => {
    // Tier 1 has subtraction. Generate many and check.
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion(1);
      if (q.operation === 'subtraction' && q.blankPosition === 'result') {
        expect(q.answer).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('generates clean-division questions (integer quotients only)', () => {
    // Find a tier that has division.
    const divisionTier = TIERS.find((t) => t.operations.includes('division'));
    if (!divisionTier) return; // skip if no division tier exists yet
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion(divisionTier.tier);
      if (q.operation === 'division') {
        expect(q.operandA % q.operandB).toBe(0);
        expect(Number.isInteger(q.answer)).toBe(true);
      }
    }
  });

  it('multiple-choice questions include the correct answer among choices', () => {
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion(1);
      if (q.format === 'multiple-choice') {
        expect(q.choices).toBeDefined();
        expect(q.choices!.length).toBeGreaterThanOrEqual(2);
        expect(q.choices).toContain(q.answer);
      }
    }
  });

  it('multiple-choice distractors are unique and non-negative', () => {
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion(1);
      if (q.format === 'multiple-choice' && q.choices) {
        const unique = new Set(q.choices);
        expect(unique.size).toBe(q.choices.length);
        for (const c of q.choices) expect(c).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('honors the tier numberRange at full difficulty', () => {
    for (let tier = 1; tier <= TIERS.length; tier++) {
      const t = TIERS[tier - 1];
      for (let i = 0; i < 30; i++) {
        const q = generateQuestion(tier, 1.0);
        if (q.operation === 'addition' || q.operation === 'subtraction') {
          expect(q.operandA).toBeGreaterThanOrEqual(t.numberRange.min);
          expect(q.operandA).toBeLessThanOrEqual(t.numberRange.max);
        }
      }
    }
  });
});

describe('generateStageQuestions', () => {
  it('generates the requested question count', () => {
    const qs = generateStageQuestions(1, 5, 1.0);
    expect(qs).toHaveLength(5);
  });

  it('question IDs are unique within a stage', () => {
    const qs = generateStageQuestions(1, 10, 1.0);
    const ids = new Set(qs.map((q) => q.id));
    expect(ids.size).toBe(qs.length);
  });
});
