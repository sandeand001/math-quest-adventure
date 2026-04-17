import { describe, it, expect } from 'vitest';
import { newSkillMastery, updateMastery, skillId } from './mastery';

describe('skillId', () => {
  it('composes operation and tier into a stable id', () => {
    expect(skillId('addition', 1)).toBe('addition-tier1');
    expect(skillId('division', 4)).toBe('division-tier4');
  });
});

describe('newSkillMastery', () => {
  it('starts in the learning level with zeroed counters', () => {
    const m = newSkillMastery('addition-tier1');
    expect(m.level).toBe('learning');
    expect(m.correct).toBe(0);
    expect(m.attempts).toBe(0);
    expect(m.streak).toBe(0);
    expect(m.bestStreak).toBe(0);
  });
});

describe('updateMastery', () => {
  it('increments attempts on every call', () => {
    let m = newSkillMastery('s');
    m = updateMastery(m, true);
    m = updateMastery(m, false);
    expect(m.attempts).toBe(2);
  });

  it('only increments correct on correct answers', () => {
    let m = newSkillMastery('s');
    m = updateMastery(m, true);
    m = updateMastery(m, false);
    m = updateMastery(m, true);
    expect(m.correct).toBe(2);
  });

  it('resets streak to 0 on a wrong answer', () => {
    let m = newSkillMastery('s');
    for (let i = 0; i < 4; i++) m = updateMastery(m, true);
    expect(m.streak).toBe(4);
    m = updateMastery(m, false);
    expect(m.streak).toBe(0);
  });

  it('tracks bestStreak across resets', () => {
    let m = newSkillMastery('s');
    for (let i = 0; i < 6; i++) m = updateMastery(m, true);
    m = updateMastery(m, false);
    for (let i = 0; i < 3; i++) m = updateMastery(m, true);
    expect(m.bestStreak).toBe(6);
  });

  it('stays "learning" before 5 attempts', () => {
    let m = newSkillMastery('s');
    for (let i = 0; i < 4; i++) m = updateMastery(m, true);
    expect(m.level).toBe('learning');
  });

  it('promotes to "practicing" after enough attempts at >=70% accuracy', () => {
    let m = newSkillMastery('s');
    // 8 correct out of 10 = 80%
    for (let i = 0; i < 8; i++) m = updateMastery(m, true);
    for (let i = 0; i < 2; i++) m = updateMastery(m, false);
    expect(m.level).toBe('practicing');
  });

  it('promotes to "mastered" at high accuracy + long window + streak', () => {
    let m = newSkillMastery('s');
    // 20 correct in a row at tier 1 → 100% accuracy, streak 20
    for (let i = 0; i < 20; i++) m = updateMastery(m, true);
    expect(m.level).toBe('mastered');
  });

  it('does not mutate the input mastery record', () => {
    const m = newSkillMastery('s');
    const snapshot = { ...m };
    updateMastery(m, true);
    expect(m).toEqual(snapshot);
  });
});
