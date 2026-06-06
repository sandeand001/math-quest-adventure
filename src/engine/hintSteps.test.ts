import { describe, it, expect } from 'vitest';
import { generateHintSteps, generatePracticeQuestion } from './hintSteps';
import type { Question } from '../types';

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'test-q',
    operation: 'addition',
    format: 'fill-result',
    blankPosition: 'result',
    operandA: 27,
    operandB: 15,
    answer: 42,
    displayEquation: '27 + 15 = ___',
    tier: 3,
    ...overrides,
  };
}

describe('generatePracticeQuestion', () => {
  it('generates a practice problem with the same operation', () => {
    const original = makeQuestion();
    const practice = generatePracticeQuestion(original);
    expect(practice.operation).toBe('addition');
    expect(practice.a + ' ' + practice.b).not.toBe('27 15'); // different numbers (usually)
    expect(practice.answer).toBe(practice.a + practice.b);
  });

  it('generates valid subtraction practice', () => {
    const original = makeQuestion({ operation: 'subtraction', operandA: 43, operandB: 18, answer: 25 });
    const practice = generatePracticeQuestion(original);
    expect(practice.operation).toBe('subtraction');
    expect(practice.answer).toBe(practice.a - practice.b);
    expect(practice.a).toBeGreaterThanOrEqual(practice.b);
  });

  it('generates valid multiplication practice', () => {
    const original = makeQuestion({ operation: 'multiplication', operandA: 6, operandB: 7, answer: 42, tier: 4 });
    const practice = generatePracticeQuestion(original);
    expect(practice.operation).toBe('multiplication');
    expect(practice.answer).toBe(practice.a * practice.b);
  });

  it('generates valid division practice', () => {
    const original = makeQuestion({ operation: 'division', operandA: 48, operandB: 6, answer: 8, tier: 5 });
    const practice = generatePracticeQuestion(original);
    expect(practice.operation).toBe('division');
    expect(practice.a).toBe(practice.b * practice.answer); // clean division
  });
});

describe('generateHintSteps', () => {
  it('generates steps for simple addition (counting)', () => {
    const q = makeQuestion({ operandA: 3, operandB: 5, answer: 8, tier: 1 });
    const steps = generateHintSteps(q);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.type === 'interactive')).toBe(true);
    const interactiveStep = steps.find((s) => s.type === 'interactive');
    expect(interactiveStep?.intermediateAnswer).toBe(8);
  });

  it('generates column method steps for two-digit addition', () => {
    const q = makeQuestion({ operandA: 34, operandB: 28, answer: 62, tier: 3 });
    const steps = generateHintSteps(q);
    expect(steps.length).toBeGreaterThanOrEqual(4);
    // Should ask for ones sum (4+8=12)
    const onesStep = steps.find((s) => s.type === 'interactive' && s.intermediateAnswer === 12);
    expect(onesStep).toBeDefined();
  });

  it('generates counting back steps for small subtraction', () => {
    const q = makeQuestion({ operation: 'subtraction', operandA: 8, operandB: 3, answer: 5, tier: 2 });
    const steps = generateHintSteps(q);
    expect(steps.length).toBeGreaterThan(0);
    const interactiveStep = steps.find((s) => s.type === 'interactive');
    expect(interactiveStep?.intermediateAnswer).toBe(5);
  });

  it('generates repeated addition steps for multiplication', () => {
    const q = makeQuestion({ operation: 'multiplication', operandA: 3, operandB: 4, answer: 12, tier: 4 });
    const steps = generateHintSteps(q);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.type === 'interactive')).toBe(true);
  });

  it('generates division steps', () => {
    const q = makeQuestion({ operation: 'division', operandA: 12, operandB: 4, answer: 3, tier: 5 });
    const steps = generateHintSteps(q);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1].character).toBe('celebrating');
  });

  it('handles fill-operand with inverse operation', () => {
    const q = makeQuestion({
      operation: 'addition',
      operandA: 7,
      operandB: 5,
      answer: 12,
      blankPosition: 'right',
      format: 'fill-operand',
      tier: 2,
    });
    const steps = generateHintSteps(q);
    expect(steps.length).toBeGreaterThan(0);
    // Should mention inverse operation
    expect(steps[0].text).toContain('−');
  });

  it('handles word problems', () => {
    const q = makeQuestion({
      format: 'word-problem',
      wordProblem: 'Sam has 14 apples. Mia gives him 9 more. How many apples does Sam have now?',
      operandA: 14,
      operandB: 9,
      answer: 23,
      tier: 3,
    });
    const steps = generateHintSteps(q);
    expect(steps.length).toBeGreaterThan(3);
    // Should mention finding the numbers
    expect(steps[0].text).toContain('numbers');
  });
});
