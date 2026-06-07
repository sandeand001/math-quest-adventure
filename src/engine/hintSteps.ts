import type { Question, Operation } from '../types';

// ── Types ────────────────────────────────────────────────────────────

export type VisualType = 'column' | 'number-line' | 'dot-groups';

export interface HintStep {
  text: string;
  type: 'info' | 'interactive';
  intermediateAnswer?: number;
}

export interface GuidedSolveData {
  visual: VisualType;
  steps: HintStep[];
  practiceA: number;
  practiceB: number;
  practiceAnswer: number;
  operation: Operation;
}

// ── Practice question generator ──────────────────────────────────────

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePracticeQuestion(original: Question): {
  a: number; b: number; answer: number; operation: Operation;
} {
  const { operandA, operandB, operation } = original;
  for (let i = 0; i < 30; i++) {
    const p = generateSimilar(operandA, operandB, operation);
    if (p.a !== operandA || p.b !== operandB) return p;
  }
  return generateSimilar(operandA, operandB, operation);
}

function generateSimilar(origA: number, origB: number, op: Operation) {
  switch (op) {
    case 'addition': { const a = nearby(origA); const b = nearby(origB); return { a, b, answer: a + b, operation: op }; }
    case 'subtraction': { let a = nearby(origA); let b = nearby(origB); if (b > a) [a, b] = [b, a]; if (a === b) a++; return { a, b, answer: a - b, operation: op }; }
    case 'multiplication': { const a = Math.max(1, nearbySmall(origA)); const b = Math.max(1, nearbySmall(origB)); return { a, b, answer: a * b, operation: op }; }
    case 'division': { const d = Math.max(1, nearbySmall(origB)); const q = Math.max(1, nearbySmall(Math.round(origA / Math.max(origB, 1)))); return { a: d * q, b: d, answer: q, operation: op }; }
  }
}

function nearby(n: number): number {
  if (n <= 10) return Math.max(0, n + randInt(-3, 3));
  if (n <= 100) return Math.max(1, n + randInt(-15, 15));
  return Math.max(1, n + randInt(-50, 50));
}

function nearbySmall(n: number): number {
  if (n <= 5) return Math.max(1, n + randInt(-2, 2));
  return Math.max(1, n + randInt(-3, 3));
}

// ── Visual type selection ────────────────────────────────────────────

function selectVisual(operation: Operation, tier: number): VisualType {
  if (operation === 'addition' || operation === 'subtraction') {
    return tier <= 2 ? 'number-line' : 'column';
  }
  if (operation === 'multiplication') {
    return tier <= 5 ? 'dot-groups' : 'number-line';
  }
  // division
  return tier <= 5 ? 'dot-groups' : 'number-line';
}

// ── Step generators ──────────────────────────────────────────────────

function columnAddSteps(a: number, b: number, answer: number): HintStep[] {
  const onesA = a % 10, onesB = b % 10;
  const onesSum = onesA + onesB;
  const carry = onesSum >= 10 ? 1 : 0;
  const tensA = Math.floor(a / 10), tensB = Math.floor(b / 10);
  const tensSum = tensA + tensB + carry;
  const steps: HintStep[] = [];

  steps.push({ text: `When we add big numbers, we start with the ones place — the last digit.`, type: 'info' });
  steps.push({ text: `The ones digits are ${onesA} and ${onesB}. What is ${onesA} + ${onesB}?`, type: 'interactive', intermediateAnswer: onesSum });

  if (carry) {
    steps.push({ text: `${onesSum} is bigger than 9, so it won't fit in one place! We write the ${onesSum % 10} in the ones spot and carry the 1 over to the tens place.`, type: 'info' });
    steps.push({ text: `Now we add the tens: ${tensA} + ${tensB}, plus the 1 we carried. What is ${tensA} + ${tensB} + 1?`, type: 'interactive', intermediateAnswer: tensSum });
  } else {
    steps.push({ text: `Great! Write ${onesSum} in the ones place. Now let's move to the tens place.`, type: 'info' });
    steps.push({ text: `The tens digits are ${tensA} and ${tensB}. What is ${tensA} + ${tensB}?`, type: 'interactive', intermediateAnswer: tensSum });
  }

  steps.push({ text: `Put it all together — the answer is ${answer}! 🎉`, type: 'info' });
  return steps;
}

function columnSubSteps(a: number, b: number, answer: number): HintStep[] {
  let onesA = a % 10;
  let tensA = Math.floor(a / 10);
  const onesB = b % 10, tensB = Math.floor(b / 10);
  const borrow = onesA < onesB;
  const steps: HintStep[] = [];

  steps.push({ text: `When we subtract big numbers, we start with the ones place — the last digit.`, type: 'info' });

  if (borrow) {
    steps.push({ text: `We need ${onesA} − ${onesB}, but ${onesA} is smaller than ${onesB}! We need to borrow from the tens place.`, type: 'info' });
    steps.push({ text: `Borrow 1 ten: the ${tensA} in the tens place becomes ${tensA - 1}, and the ${onesA} becomes ${onesA + 10}.`, type: 'info' });
    tensA -= 1;
    onesA += 10;
  }

  steps.push({ text: `Now what is ${onesA} − ${onesB}?`, type: 'interactive', intermediateAnswer: onesA - onesB });
  steps.push({ text: `Write ${onesA - onesB} in the ones place. Now the tens: what is ${tensA} − ${tensB}?`, type: 'interactive', intermediateAnswer: tensA - tensB });
  steps.push({ text: `Put it all together — the answer is ${answer}! 🎉`, type: 'info' });
  return steps;
}

function numberLineAddSteps(a: number, b: number, answer: number): HintStep[] {
  const bigger = Math.max(a, b), smaller = Math.min(a, b);
  const steps: HintStep[] = [];
  steps.push({ text: `To add, we start at the bigger number (${bigger}) and count forward ${smaller} times.`, type: 'info' });
  for (let i = 1; i < smaller; i++) {
    steps.push({ text: `Jump! ${bigger + i}...`, type: 'info' });
  }
  steps.push({ text: `One more jump! Where do we land?`, type: 'interactive', intermediateAnswer: answer });
  return steps;
}

function numberLineSubSteps(a: number, b: number, answer: number): HintStep[] {
  const steps: HintStep[] = [];
  steps.push({ text: `To subtract, we start at ${a} and count backward ${b} times.`, type: 'info' });
  for (let i = 1; i < b; i++) {
    steps.push({ text: `Jump back! ${a - i}...`, type: 'info' });
  }
  steps.push({ text: `One more jump back! Where do we land?`, type: 'interactive', intermediateAnswer: answer });
  return steps;
}

function dotGroupSteps(groups: number, perGroup: number, answer: number, isDivision: boolean): HintStep[] {
  const steps: HintStep[] = [];
  if (isDivision) {
    steps.push({ text: `${answer} ÷ ${perGroup} means: how many groups of ${perGroup} can we make from ${answer} dots?`, type: 'info' });
  } else {
    steps.push({ text: `${groups} × ${perGroup} means ${groups} groups with ${perGroup} in each group. Let's count them up!`, type: 'info' });
  }
  steps.push({ text: `Here's the first group — that's ${perGroup} so far.`, type: 'info' });
  let total = perGroup;
  for (let i = 2; i <= groups; i++) {
    steps.push({ text: `Here comes group ${i}! We had ${total}, now add ${perGroup} more. What's the total?`, type: 'interactive', intermediateAnswer: total + perGroup });
    total += perGroup;
  }
  if (isDivision) {
    steps.push({ text: `We made ${groups} equal groups! So ${answer} ÷ ${perGroup} = ${groups}. 🎉`, type: 'info' });
  } else {
    steps.push({ text: `All ${groups} groups counted! ${groups} × ${perGroup} = ${answer}. 🎉`, type: 'info' });
  }
  return steps;
}

function skipCountSteps(groups: number, perGroup: number, answer: number, isDivision: boolean): HintStep[] {
  const steps: HintStep[] = [];
  if (isDivision) {
    steps.push({ text: `${answer} ÷ ${perGroup}: let's count by ${perGroup}s until we reach ${answer}, and see how many jumps it takes!`, type: 'info' });
  } else {
    steps.push({ text: `${groups} × ${perGroup}: let's skip-count by ${perGroup}, making ${groups} jumps on the number line!`, type: 'info' });
  }
  steps.push({ text: `First jump lands on ${perGroup}.`, type: 'info' });
  let total = perGroup;
  for (let i = 2; i <= groups; i++) {
    steps.push({ text: `Jump ${i}! We're at ${total}, add ${perGroup} more. Where do we land?`, type: 'interactive', intermediateAnswer: total + perGroup });
    total += perGroup;
  }
  if (isDivision) {
    steps.push({ text: `It took ${groups} jumps to reach ${answer}. So ${answer} ÷ ${perGroup} = ${groups}! 🎉`, type: 'info' });
  } else {
    steps.push({ text: `${groups} jumps of ${perGroup} = ${answer}. So ${groups} × ${perGroup} = ${answer}! 🎉`, type: 'info' });
  }
  return steps;
}

// ── Main entry point ─────────────────────────────────────────────────

export function buildGuidedSolve(question: Question): GuidedSolveData {
  const practice = generatePracticeQuestion(question);
  const { a, b, answer, operation } = practice;
  const visual = selectVisual(operation, question.tier);
  let steps: HintStep[];

  switch (visual) {
    case 'column':
      steps = operation === 'subtraction'
        ? columnSubSteps(a, b, answer)
        : columnAddSteps(a, b, answer);
      break;

    case 'number-line':
      if (operation === 'addition') {
        steps = numberLineAddSteps(a, b, answer);
      } else if (operation === 'subtraction') {
        steps = numberLineSubSteps(a, b, answer);
      } else if (operation === 'multiplication') {
        const groups = Math.min(a, b), per = Math.max(a, b);
        steps = skipCountSteps(groups, per, answer, false);
      } else {
        // division — a ÷ b = answer → count by b, answer times
        steps = skipCountSteps(answer, b, a, true);
      }
      break;

    case 'dot-groups':
      if (operation === 'multiplication') {
        const groups = Math.min(a, b), per = Math.max(a, b);
        steps = dotGroupSteps(groups, per, answer, false);
      } else {
        // division: a ÷ b = answer → answer groups of b
        steps = dotGroupSteps(answer, b, a, true);
      }
      break;
  }

  return { visual, steps, practiceA: a, practiceB: b, practiceAnswer: answer, operation };
}
