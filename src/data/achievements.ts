export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-stage', name: 'First Steps', description: 'Complete your first stage', icon: '🌱' },
  { id: 'first-boss', name: 'Boss Slayer', description: 'Defeat your first boss', icon: '⚔️' },
  { id: 'streak-5', name: 'On Fire', description: 'Get a 5-answer streak', icon: '🔥' },
  { id: 'streak-10', name: 'Unstoppable', description: 'Get a 10-answer streak', icon: '⚡' },
  { id: 'perfect-stage', name: 'Perfect Score', description: 'Complete a stage with 100% accuracy', icon: '💎' },
  { id: 'world-1', name: 'Forest Explorer', description: 'Complete Emerald Forest', icon: '🌲' },
  { id: 'world-2', name: 'Cave Diver', description: 'Complete Crystal Caves', icon: '💎' },
  { id: 'world-3', name: 'Meadow Master', description: 'Complete Mystic Meadows', icon: '🌸' },
  { id: 'world-4', name: 'Mountain Climber', description: 'Complete Ironforge Mountains', icon: '⛰️' },
  { id: 'world-5', name: 'Swamp Survivor', description: 'Complete Shadow Swamp', icon: '🐸' },
  { id: 'world-6', name: 'Ruin Raider', description: 'Complete Enchanted Ruins', icon: '🏛️' },
  { id: 'world-7', name: 'Sky Champion', description: 'Complete Sky Citadel', icon: '☁️' },
  { id: 'world-8', name: 'Dragon Slayer', description: 'Complete Dragon\'s Peak', icon: '🐉' },
  { id: 'multiply-master', name: 'Times Table Hero', description: 'Master multiplication (90%+ accuracy in tier 4)', icon: '✖️' },
  { id: 'divide-master', name: 'Division Dynamo', description: 'Master division (90%+ accuracy in tier 5)', icon: '➗' },
  { id: 'level-5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐' },
  { id: 'coins-100', name: 'Coin Collector', description: 'Earn 100 coins', icon: '🪙' },
  { id: 'coins-500', name: 'Treasure Hunter', description: 'Earn 500 coins', icon: '💰' },
  { id: 'stages-50', name: 'Marathon Runner', description: 'Complete 50 stages', icon: '🏃' },
];

export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
