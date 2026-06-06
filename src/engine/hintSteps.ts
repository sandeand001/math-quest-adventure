import type { Question, Operation } from '../types';

// ── Types ────────────────────────────────────────────────────────────

export interface HintStep {
  text: string;
  character: 'wise' | 'proud' | 'concerned' | 'celebrating';
  type: 'info' | 'interactive';
  intermediateAnswer?: number;
}

// ── Practice question generator ──────────────────────────────────────

/** Inclusive random integer in [min, max]. */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a similar-but-different practice problem for the walkthrough.
 * Same operation, similar difficulty, different numbers.
 * Preserves structural properties (e.g. carrying for addition).
 */
export function generatePracticeQuestion(original: Question): {
  a: number;
  b: number;
  answer: number;
  operation: Operation;
} {
  const { operandA, operandB, operation } = original;
  const maxAttempts = 30;

  for (let i = 0; i < maxAttempts; i++) {
    const practice = generateSimilar(operandA, operandB, operation);
    // Must have different operands from the original
    if (practice.a !== operandA || practice.b !== operandB) {
      return practice;
    }
  }

  // Fallback — just shift numbers slightly
  const fallback = generateSimilar(operandA, operandB, operation);
  return fallback;
}

function generateSimilar(
  origA: number,
  origB: number,
  operation: Operation,
): { a: number; b: number; answer: number; operation: Operation } {
  switch (operation) {
    case 'addition': {
      const a = nearbyNumber(origA);
      const b = nearbyNumber(origB);
      return { a, b, answer: a + b, operation };
    }
    case 'subtraction': {
      let a = nearbyNumber(origA);
      let b = nearbyNumber(origB);
      if (b > a) [a, b] = [b, a]; // ensure non-negative result
      if (a === b) a += 1; // avoid zero result always
      return { a, b, answer: a - b, operation };
    }
    case 'multiplication': {
      const a = Math.max(1, nearbySmall(origA));
      const b = Math.max(1, nearbySmall(origB));
      return { a, b, answer: a * b, operation };
    }
    case 'division': {
      // origA = dividend, origB = divisor
      const divisor = Math.max(1, nearbySmall(origB));
      const quotient = Math.max(1, nearbySmall(Math.round(origA / Math.max(origB, 1))));
      return { a: divisor * quotient, b: divisor, answer: quotient, operation };
    }
  }
}

/** Generate a number near the original, staying in a similar magnitude range. */
function nearbyNumber(n: number): number {
  if (n <= 10) return Math.max(0, n + randInt(-3, 3));
  if (n <= 100) return Math.max(1, n + randInt(-15, 15));
  return Math.max(1, n + randInt(-50, 50));
}

function nearbySmall(n: number): number {
  if (n <= 5) return Math.max(1, n + randInt(-2, 2));
  return Math.max(1, n + randInt(-3, 3));
}

// ── Step generators per operation ────────────────────────────────────

function additionSteps(a: number, b: number, answer: number, tier: number): HintStep[] {
  // Tier 1-2: counting up
  if (tier <= 2 || (a < 10 && b < 10)) {
    return countingUpSteps(a, b, answer);
  }
  // Tier 3+: column method
  return columnAdditionSteps(a, b, answer);
}

function countingUpSteps(a: number, b: number, answer: number): HintStep[] {
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  const steps: HintStep[] = [];

  steps.push({
    text: `Let's add! Start with the bigger number: **${bigger}**`,
    character: 'wise',
    type: 'info',
  });

  // Show counting sequence
  const counts: string[] = [];
  for (let i = 1; i <= smaller; i++) {
    counts.push(`**${bigger + i}**`);
  }
  steps.push({
    text: `Now count up ${smaller} more: ${counts.join('... ')} ✓`,
    character: 'wise',
    type: 'info',
  });

  steps.push({
    text: `So ${bigger} + ${smaller} = ?`,
    character: 'proud',
    type: 'interactive',
    intermediateAnswer: answer,
  });

  return steps;
}

function columnAdditionSteps(a: number, b: number, answer: number): HintStep[] {
  const steps: HintStep[] = [];
  const onesA = a % 10;
  const onesB = b % 10;
  const onesSum = onesA + onesB;
  const carry = onesSum >= 10 ? 1 : 0;
  const onesResult = onesSum % 10;

  const tensA = Math.floor(a / 10);
  const tensB = Math.floor(b / 10);
  const tensSum = tensA + tensB + carry;

  steps.push({
    text: `Let's solve this step by step! First, the **ones place**.`,
    character: 'wise',
    type: 'info',
  });

  steps.push({
    text: `Look at the ones: **${onesA}** and **${onesB}**. What is ${onesA} + ${onesB}?`,
    character: 'wise',
    type: 'interactive',
    intermediateAnswer: onesSum,
  });

  if (carry) {
    steps.push({
      text: `${onesSum} is more than 9! Write the **${onesResult}** in the ones place and carry the **1** to the tens place.`,
      character: 'wise',
      type: 'info',
    });

    steps.push({
      text: `Now the tens: **${tensA}** + **${tensB}** + **1** (carried). What is ${tensA} + ${tensB} + 1?`,
      character: 'wise',
      type: 'interactive',
      intermediateAnswer: tensSum,
    });
  } else {
    steps.push({
      text: `Write **${onesResult}** in the ones place. No carrying needed!`,
      character: 'wise',
      type: 'info',
    });

    steps.push({
      text: `Now the tens: **${tensA}** and **${tensB}**. What is ${tensA} + ${tensB}?`,
      character: 'wise',
      type: 'interactive',
      intermediateAnswer: tensSum,
    });
  }

  steps.push({
    text: `Place **${tensSum}** in the tens place. The answer is **${answer}**!`,
    character: 'celebrating',
    type: 'info',
  });

  return steps;
}

function subtractionSteps(a: number, b: number, answer: number, tier: number): HintStep[] {
  if (tier <= 2 || (a <= 20 && b <= 20)) {
    return countingBackSteps(a, b, answer);
  }
  return columnSubtractionSteps(a, b, answer);
}

function countingBackSteps(a: number, b: number, answer: number): HintStep[] {
  const steps: HintStep[] = [];

  steps.push({
    text: `Let's take away! Start at **${a}**.`,
    character: 'wise',
    type: 'info',
  });

  const counts: string[] = [];
  for (let i = 1; i <= b; i++) {
    counts.push(`**${a - i}**`);
  }
  steps.push({
    text: `Count back ${b}: ${counts.join('... ')} ✓`,
    character: 'wise',
    type: 'info',
  });

  steps.push({
    text: `So ${a} − ${b} = ?`,
    character: 'proud',
    type: 'interactive',
    intermediateAnswer: answer,
  });

  return steps;
}

function columnSubtractionSteps(a: number, b: number, answer: number): HintStep[] {
  const steps: HintStep[] = [];
  let onesA = a % 10;
  let tensA = Math.floor(a / 10);
  const onesB = b % 10;
  const tensB = Math.floor(b / 10);
  const needsBorrow = onesA < onesB;

  steps.push({
    text: `Let's solve this step by step! First, the **ones place**.`,
    character: 'wise',
    type: 'info',
  });

  if (needsBorrow) {
    steps.push({
      text: `The ones: **${onesA}** − **${onesB}**. But ${onesA} is smaller than ${onesB}! We need to **borrow**.`,
      character: 'concerned',
      type: 'info',
    });

    tensA -= 1;
    onesA += 10;

    steps.push({
      text: `Borrow 1 from the tens → the ${a % 10} becomes **${onesA}**, and the tens digit becomes **${tensA}**.`,
      character: 'wise',
      type: 'info',
    });

    steps.push({
      text: `Now what is ${onesA} − ${onesB}?`,
      character: 'wise',
      type: 'interactive',
      intermediateAnswer: onesA - onesB,
    });
  } else {
    steps.push({
      text: `The ones: **${onesA}** and **${onesB}**. What is ${onesA} − ${onesB}?`,
      character: 'wise',
      type: 'interactive',
      intermediateAnswer: onesA - onesB,
    });
  }

  steps.push({
    text: `Write **${onesA - onesB}** in the ones place. Now the tens: **${tensA}** − **${tensB}**.`,
    character: 'wise',
    type: 'info',
  });

  steps.push({
    text: `What is ${tensA} − ${tensB}?`,
    character: 'wise',
    type: 'interactive',
    intermediateAnswer: tensA - tensB,
  });

  steps.push({
    text: `Place **${tensA - tensB}** in the tens place. The answer is **${answer}**!`,
    character: 'celebrating',
    type: 'info',
  });

  return steps;
}

function multiplicationSteps(a: number, b: number, answer: number, tier: number): HintStep[] {
  // Use the smaller number as the group count for fewer steps
  const groups = Math.min(a, b);
  const perGroup = Math.max(a, b);

  if (tier <= 5 && groups <= 5) {
    return repeatedAdditionSteps(groups, perGroup, answer);
  }
  return skipCountingSteps(groups, perGroup, answer);
}

function repeatedAdditionSteps(groups: number, perGroup: number, answer: number): HintStep[] {
  const steps: HintStep[] = [];

  steps.push({
    text: `${groups} × ${perGroup} means **${groups} groups of ${perGroup}**. Let's count them!`,
    character: 'wise',
    type: 'info',
  });

  steps.push({
    text: `Group 1 = **${perGroup}**`,
    character: 'wise',
    type: 'info',
  });

  let runningTotal = perGroup;
  for (let i = 2; i <= groups; i++) {
    steps.push({
      text: `Group ${i}: ${runningTotal} + ${perGroup} = ?`,
      character: 'wise',
      type: 'interactive',
      intermediateAnswer: runningTotal + perGroup,
    });
    runningTotal += perGroup;
  }

  steps.push({
    text: `${groups} groups of ${perGroup} = **${answer}**!`,
    character: 'celebrating',
    type: 'info',
  });

  return steps;
}

function skipCountingSteps(groups: number, perGroup: number, answer: number): HintStep[] {
  const steps: HintStep[] = [];

  steps.push({
    text: `${groups} × ${perGroup} means skip-count by **${perGroup}**, **${groups}** times!`,
    character: 'wise',
    type: 'info',
  });

  steps.push({
    text: `**${perGroup}**... (1)`,
    character: 'wise',
    type: 'info',
  });

  let runningTotal = perGroup;
  for (let i = 2; i <= groups; i++) {
    steps.push({
      text: `${runningTotal} + ${perGroup} = ? (${i})`,
      character: 'wise',
      type: 'interactive',
      intermediateAnswer: runningTotal + perGroup,
    });
    runningTotal += perGroup;
  }

  steps.push({
    text: `We counted ${groups} × ${perGroup} = **${answer}**!`,
    character: 'celebrating',
    type: 'info',
  });

  return steps;
}

function divisionSteps(a: number, b: number, answer: number, tier: number): HintStep[] {
  // a ÷ b = answer  →  how many groups of b fit in a?
  if (tier <= 5 && answer <= 5) {
    return repeatedSubtractionSteps(a, b, answer);
  }
  return divisionSkipCountSteps(a, b, answer);
}

function repeatedSubtractionSteps(dividend: number, divisor: number, quotient: number): HintStep[] {
  const steps: HintStep[] = [];

  steps.push({
    text: `${dividend} ÷ ${divisor} means: how many groups of **${divisor}** can we make from **${dividend}**?`,
    character: 'wise',
    type: 'info',
  });

  let remaining = dividend;
  for (let group = 1; group <= quotient; group++) {
    if (group === 1) {
      steps.push({
        text: `Take out a group of ${divisor}: ${remaining} − ${divisor} = **${remaining - divisor}**. That's **1 group**.`,
        character: 'wise',
        type: 'info',
      });
    } else {
      steps.push({
        text: `Take out another group: ${remaining} − ${divisor} = ?`,
        character: 'wise',
        type: 'interactive',
        intermediateAnswer: remaining - divisor,
      });
    }
    remaining -= divisor;
  }

  steps.push({
    text: `We made **${quotient} groups**! So ${dividend} ÷ ${divisor} = **${quotient}**!`,
    character: 'celebrating',
    type: 'info',
  });

  return steps;
}

function divisionSkipCountSteps(dividend: number, divisor: number, quotient: number): HintStep[] {
  const steps: HintStep[] = [];

  steps.push({
    text: `${dividend} ÷ ${divisor} means: how many ${divisor}s fit in ${dividend}? Let's count by **${divisor}**!`,
    character: 'wise',
    type: 'info',
  });

  steps.push({
    text: `**${divisor}**... (1)`,
    character: 'wise',
    type: 'info',
  });

  let runningTotal = divisor;
  for (let i = 2; i <= quotient; i++) {
    steps.push({
      text: `${runningTotal} + ${divisor} = ? (${i})`,
      character: 'wise',
      type: 'interactive',
      intermediateAnswer: runningTotal + divisor,
    });
    runningTotal += divisor;
  }

  steps.push({
    text: `We counted **${quotient}** groups of ${divisor} = ${dividend}! So ${dividend} ÷ ${divisor} = **${quotient}**!`,
    character: 'celebrating',
    type: 'info',
  });

  return steps;
}

// ── Fill-operand handling ────────────────────────────────────────────

function fillOperandSteps(question: Question): HintStep[] {
  const { operandA, operandB, operation, blankPosition, answer, tier } = question;

  const steps: HintStep[] = [];

  if (blankPosition === 'left') {
    // ___ op b = result  →  inverse operation
    if (operation === 'addition') {
      // ___ + b = result  →  result - b
      steps.push({
        text: `We need to find: **?** + ${operandB} = ${answer}. This is the same as ${answer} − ${operandB}!`,
        character: 'wise',
        type: 'info',
      });
      steps.push(...subtractionSteps(answer, operandB, operandA, tier));
    } else if (operation === 'subtraction') {
      // ___ - b = result  →  result + b
      steps.push({
        text: `We need: **?** − ${operandB} = ${answer}. This is the same as ${answer} + ${operandB}!`,
        character: 'wise',
        type: 'info',
      });
      steps.push(...additionSteps(answer, operandB, operandA, tier));
    }
  } else if (blankPosition === 'right') {
    // a op ___ = result  →  inverse
    if (operation === 'addition') {
      // a + ___ = result  →  result - a
      steps.push({
        text: `We need: ${operandA} + **?** = ${answer}. This is the same as ${answer} − ${operandA}!`,
        character: 'wise',
        type: 'info',
      });
      steps.push(...subtractionSteps(answer, operandA, operandB, tier));
    } else if (operation === 'subtraction') {
      // a - ___ = result  →  a - result
      steps.push({
        text: `We need: ${operandA} − **?** = ${answer}. This is the same as ${operandA} − ${answer}!`,
        character: 'wise',
        type: 'info',
      });
      steps.push(...subtractionSteps(operandA, answer, operandB, tier));
    }
  }

  return steps;
}

// ── Word problem handling ────────────────────────────────────────────

const OPERATION_KEYWORDS: Record<Operation, string> = {
  addition: 'add',
  subtraction: 'subtract',
  multiplication: 'multiply',
  division: 'divide',
};

function wordProblemSteps(question: Question): HintStep[] {
  const { operandA, operandB, answer, operation, tier } = question;
  const opWord = OPERATION_KEYWORDS[operation];
  const steps: HintStep[] = [];

  steps.push({
    text: `Let's break down this word problem! First, find the important numbers.`,
    character: 'wise',
    type: 'info',
  });

  steps.push({
    text: `The numbers are **${operandA}** and **${operandB}**. The problem is asking us to **${opWord}**!`,
    character: 'wise',
    type: 'info',
  });

  const OP_SYMBOLS: Record<Operation, string> = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷',
  };

  steps.push({
    text: `So the equation is: **${operandA} ${OP_SYMBOLS[operation]} ${operandB} = ?**`,
    character: 'proud',
    type: 'info',
  });

  // Now walk through the operation itself
  switch (operation) {
    case 'addition':
      steps.push(...additionSteps(operandA, operandB, answer, tier));
      break;
    case 'subtraction':
      steps.push(...subtractionSteps(operandA, operandB, answer, tier));
      break;
    case 'multiplication':
      steps.push(...multiplicationSteps(operandA, operandB, answer, tier));
      break;
    case 'division':
      steps.push(...divisionSteps(operandA, operandB, answer, tier));
      break;
  }

  return steps;
}

// ── Main entry point ─────────────────────────────────────────────────

/**
 * Generate walkthrough hint steps for a practice question.
 * The practice question should be generated via `generatePracticeQuestion()` —
 * a similar but different problem from the one the user failed.
 */
export function generateHintSteps(question: Question): HintStep[] {
  const { operandA, operandB, answer, operation, tier, format, blankPosition } = question;

  // Word problems get special handling
  if (format === 'word-problem') {
    return wordProblemSteps(question);
  }

  // Fill-operand (missing left or right number) uses inverse operation
  if (blankPosition === 'left' || blankPosition === 'right') {
    const fillSteps = fillOperandSteps(question);
    if (fillSteps.length > 0) return fillSteps;
  }

  // Standard result-position problems
  switch (operation) {
    case 'addition':
      return additionSteps(operandA, operandB, answer, tier);
    case 'subtraction':
      return subtractionSteps(operandA, operandB, answer, tier);
    case 'multiplication':
      return multiplicationSteps(operandA, operandB, answer, tier);
    case 'division':
      return divisionSteps(operandA, operandB, answer, tier);
  }
}
