import { TIERS } from '../data/tiers';
import type {
  Question,
  Operation,
  QuestionFormat,
  BlankPosition,
  TierDefinition,
} from '../types';

let _questionCounter = 0;

function uid(): string {
  return `q-${Date.now()}-${++_questionCounter}`;
}

/** Inclusive random integer in [min, max]. */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a random element from an array. */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Shuffle an array (Fisher-Yates). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Operand generation per operation ────────────────────────────────

interface Operands {
  a: number;
  b: number;
  answer: number;
  operation: Operation;
}

/**
 * Scale a number range based on difficulty (0–1).
 * At difficulty 0.15, use ~15% of the range (the easy end).
 * At difficulty 1.0, use the full range.
 * Always ensures a minimum useful range.
 */
function scaleRange(min: number, max: number, difficulty: number): { min: number; max: number } {
  const range = max - min;
  const scaledMax = Math.max(min + 2, Math.round(min + range * difficulty));
  return { min, max: scaledMax };
}

function generateOperands(tier: TierDefinition, operation: Operation, difficulty: number): Operands {
  const { min, max } = scaleRange(tier.numberRange.min, tier.numberRange.max, difficulty);

  switch (operation) {
    case 'addition': {
      const a = randInt(min, max);
      const cappedB = Math.min(randInt(min, max), max - a);
      const b = Math.max(cappedB, min);
      return { a, b, answer: a + b, operation };
    }

    case 'subtraction': {
      // Ensure a >= b so result is non-negative
      const a = randInt(Math.max(min, 1), max);
      const b = randInt(min, a);
      return { a, b, answer: a - b, operation };
    }

    case 'multiplication': {
      const tableMin = tier.tables?.min ?? 1;
      const fullTableMax = tier.tables?.max ?? 10;
      // Scale which tables are available based on difficulty
      const tableMax = Math.max(tableMin + 1, Math.round(tableMin + (fullTableMax - tableMin) * difficulty));
      const a = randInt(tableMin, tableMax);
      const b = randInt(tableMin, tableMax);
      return { a, b, answer: a * b, operation };
    }

    case 'division': {
      // Generate from multiplication to ensure clean division
      const tableMin = tier.tables?.min ?? 1;
      const fullTableMax = tier.tables?.max ?? 10;
      const tableMax = Math.max(tableMin + 1, Math.round(tableMin + (fullTableMax - tableMin) * difficulty));
      const divisor = randInt(Math.max(tableMin, 1), tableMax);
      const quotient = randInt(tableMin, tableMax);
      const dividend = divisor * quotient;
      return { a: dividend, b: divisor, answer: quotient, operation };
    }
  }
}

// ── Operator symbol ─────────────────────────────────────────────────

const OP_SYMBOLS: Record<Operation, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

// ── Equation display ────────────────────────────────────────────────

function formatEquation(
  a: number,
  b: number,
  answer: number,
  operation: Operation,
  blankPosition: BlankPosition,
): string {
  const sym = OP_SYMBOLS[operation];

  switch (blankPosition) {
    case 'result':
      return `${a} ${sym} ${b} = ___`;
    case 'left':
      return `___ ${sym} ${b} = ${answer}`;
    case 'right':
      return `${a} ${sym} ___ = ${answer}`;
    case 'operator':
      return `${a} ___ ${b} = ${answer}`;
  }
}

// ── Distractor generation for multiple choice ───────────────────────

function generateDistractors(answer: number, count: number): number[] {
  const distractors = new Set<number>();
  const offsets = [1, -1, 2, -2, 10, -10, 5, -5, 3, -3];

  for (const offset of offsets) {
    if (distractors.size >= count) break;
    const d = answer + offset;
    if (d >= 0 && d !== answer) {
      distractors.add(d);
    }
  }

  // Fill remaining with random nearby values
  let attempts = 0;
  while (distractors.size < count && attempts < 50) {
    const d = answer + randInt(-10, 10);
    if (d >= 0 && d !== answer) {
      distractors.add(d);
    }
    attempts++;
  }

  return [...distractors].slice(0, count);
}

// ── Word problem templates ──────────────────────────────────────────

const WORD_PROBLEM_TEMPLATES: Record<Operation, string[]> = {
  addition: [
    '{name} has {a} {item}. {name2} gives {name} {b} more. How many {item} does {name} have now?',
    'There are {a} {item} on the table. {name} puts {b} more {item} on the table. How many {item} are there in total?',
    '{name} found {a} {item} in the morning and {b} {item} in the afternoon. How many {item} did {name} find altogether?',
  ],
  subtraction: [
    '{name} has {a} {item}. {name} gives {b} to {name2}. How many {item} does {name} have left?',
    'There are {a} {item} in the basket. {name} takes out {b}. How many {item} are still in the basket?',
    '{name} had {a} {item} but lost {b} of them. How many {item} does {name} have now?',
  ],
  multiplication: [
    '{name} has {a} bags with {b} {item} in each bag. How many {item} does {name} have in total?',
    'There are {a} rows of {item} with {b} in each row. How many {item} are there altogether?',
    '{name} buys {a} packs of {item}. Each pack has {b} {item}. How many {item} does {name} have?',
  ],
  division: [
    '{name} has {dividend} {item} to share equally among {b} friends. How many {item} does each friend get?',
    'There are {dividend} {item} in {b} equal groups. How many {item} are in each group?',
    '{name} puts {dividend} {item} into bags of {b}. How many bags does {name} fill?',
  ],
};

const NAMES = ['Sam', 'Mia', 'Leo', 'Zoe', 'Kai', 'Ava', 'Max', 'Lily'];
const NAMES2 = ['Alex', 'Emma', 'Noah', 'Ella', 'Liam', 'Gabi'];
const ITEMS = ['apples', 'stickers', 'pencils', 'stars', 'marbles', 'cookies', 'books', 'flowers'];

function generateWordProblem(operands: Operands): string {
  const templates = WORD_PROBLEM_TEMPLATES[operands.operation];
  const template = pick(templates);

  return template
    .replace(/{name}/g, pick(NAMES))
    .replace(/{name2}/g, pick(NAMES2))
    .replace(/{item}/g, pick(ITEMS))
    .replace(/{a}/g, String(operands.a))
    .replace(/{b}/g, String(operands.b))
    .replace(/{dividend}/g, String(operands.a));
}

// ── Blank position selection ────────────────────────────────────────

/** Format complexity ordering (easiest → hardest). */
const FORMAT_COMPLEXITY: QuestionFormat[] = [
  'multiple-choice',
  'fill-result',
  'fill-operand',
  'fill-operator',
  'word-problem',
];

/**
 * Filter available formats based on difficulty.
 * At low difficulty, only use the easiest formats the tier supports.
 * At high difficulty, use all formats the tier supports.
 */
function getFormatsForDifficulty(tierFormats: QuestionFormat[], difficulty: number): QuestionFormat[] {
  // Sort tier formats by complexity order
  const sorted = tierFormats
    .slice()
    .sort((a, b) => FORMAT_COMPLEXITY.indexOf(a) - FORMAT_COMPLEXITY.indexOf(b));

  // At minimum, always include the easiest format
  const count = Math.max(1, Math.ceil(sorted.length * difficulty));
  return sorted.slice(0, count);
}

function selectBlankPosition(format: QuestionFormat): BlankPosition {
  switch (format) {
    case 'multiple-choice':
    case 'fill-result':
    case 'word-problem':
      return 'result';
    case 'fill-operand':
      return pick(['left', 'right']);
    case 'fill-operator':
      return 'operator';
  }
}

// ── Determine the actual answer for the blank position ──────────────

function getAnswerForBlank(
  operands: Operands,
  blankPosition: BlankPosition,
): number {
  switch (blankPosition) {
    case 'result':
      return operands.answer;
    case 'left':
      return operands.a;
    case 'right':
      return operands.b;
    case 'operator':
      // Return an index: 0=+, 1=−, 2=×, 3=÷
      return ['addition', 'subtraction', 'multiplication', 'division'].indexOf(
        operands.operation,
      );
  }
}

// ── Main question generator ─────────────────────────────────────────

export function generateQuestion(tier: number, difficulty: number = 1.0): Question {
  const tierDef = TIERS[tier - 1];
  if (!tierDef) throw new Error(`Invalid tier: ${tier}`);

  const operation = pick(tierDef.operations);

  // Scale format complexity with difficulty:
  // Low difficulty → only use simpler formats available in this tier
  // High difficulty → use all formats including harder ones
  const availableFormats = getFormatsForDifficulty(tierDef.formats, difficulty);
  const format = pick(availableFormats);
  const blankPosition = selectBlankPosition(format);
  const operands = generateOperands(tierDef, operation, difficulty);
  const answer = getAnswerForBlank(operands, blankPosition);

  const question: Question = {
    id: uid(),
    operation,
    format,
    blankPosition,
    operandA: operands.a,
    operandB: operands.b,
    answer,
    displayEquation: formatEquation(
      operands.a,
      operands.b,
      operands.answer,
      operation,
      blankPosition,
    ),
    tier,
  };

  // Add choices for multiple-choice format
  if (format === 'multiple-choice') {
    const distractors = generateDistractors(answer, 3);
    question.choices = shuffle([answer, ...distractors]);
  }

  // Add word problem text
  if (format === 'word-problem') {
    question.wordProblem = generateWordProblem(operands);
  }

  return question;
}

/** Generate a batch of questions for a stage. */
export function generateStageQuestions(tier: number, count: number, difficulty: number = 1.0): Question[] {
  return Array.from({ length: count }, () => generateQuestion(tier, difficulty));
}

/** Check if the given answer is correct. */
export function checkAnswer(question: Question, userAnswer: number): boolean {
  return userAnswer === question.answer;
}
