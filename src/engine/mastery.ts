import type { SkillMastery, MasteryLevel } from '../types';

const WINDOW_SIZE = 20;
const MASTER_THRESHOLD = 0.9;
const PRACTICE_THRESHOLD = 0.7;
const REGRESSION_THRESHOLD = 0.75;
const REGRESSION_WINDOW = 10;

/** Create a new mastery record for a skill. */
export function newSkillMastery(skillId: string): SkillMastery {
  return {
    skillId,
    correct: 0,
    attempts: 0,
    streak: 0,
    bestStreak: 0,
    level: 'learning',
    lastSeen: Date.now(),
    nextReview: 0,
  };
}

/** Update mastery after answering a question. */
export function updateMastery(
  mastery: SkillMastery,
  isCorrect: boolean,
): SkillMastery {
  const updated = { ...mastery };
  updated.attempts += 1;
  updated.lastSeen = Date.now();

  if (isCorrect) {
    updated.correct += 1;
    updated.streak += 1;
    if (updated.streak > updated.bestStreak) {
      updated.bestStreak = updated.streak;
    }
  } else {
    updated.streak = 0;
  }

  // Recalculate level
  updated.level = calculateLevel(updated);

  // Schedule next review if mastered
  if (updated.level === 'mastered') {
    updated.nextReview = calculateNextReview(updated);
  }

  return updated;
}

function calculateLevel(mastery: SkillMastery): MasteryLevel {
  if (mastery.attempts < 5) return 'learning';

  const recentWindow = Math.min(mastery.attempts, WINDOW_SIZE);
  // Approximate recent accuracy from overall stats
  // (In production, we'd track a rolling window — this is a simplification)
  const accuracy = mastery.correct / mastery.attempts;

  if (mastery.level === 'mastered') {
    // Check for regression using a smaller window
    const regressionWindow = Math.min(mastery.attempts, REGRESSION_WINDOW);
    const recentAccuracy = mastery.correct / mastery.attempts;
    if (regressionWindow >= REGRESSION_WINDOW && recentAccuracy < REGRESSION_THRESHOLD) {
      return 'practicing';
    }
    return 'mastered';
  }

  if (
    accuracy >= MASTER_THRESHOLD &&
    recentWindow >= WINDOW_SIZE &&
    mastery.bestStreak >= 5
  ) {
    return 'mastered';
  }

  if (accuracy >= PRACTICE_THRESHOLD && mastery.attempts >= 10) {
    return 'practicing';
  }

  return 'learning';
}

/** Spaced repetition intervals (simplified Leitner). */
function calculateNextReview(mastery: SkillMastery): number {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Each time the item stays mastered through a review, double the interval
  // Start at 1 day, then 3, 7, 14, 30
  const intervals = [1, 3, 7, 14, 30];
  const reviewCount = Math.min(
    Math.floor(mastery.bestStreak / 5),
    intervals.length - 1,
  );

  return now + intervals[reviewCount] * dayMs;
}

/** Build a skill ID string from operation and tier. */
export function skillId(operation: string, tier: number): string {
  return `${operation}-tier${tier}`;
}
