import { useState, useEffect } from 'react';
import { getAchievement } from '../../data/achievements';

interface AchievementToastProps {
  achievementId: string;
  onDone: () => void;
}

export function AchievementToast({ achievementId, onDone }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);
  const achievement = getAchievement(achievementId);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 100);
    // Auto dismiss after 3s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300); // wait for fade out
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onDone]);

  if (!achievement) return null;

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[100]
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-900/90 to-amber-900/90 border border-yellow-500/50 rounded-2xl px-5 py-3 shadow-xl">
        <span className="text-2xl">{achievement.icon}</span>
        <div>
          <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider">Achievement Unlocked!</p>
          <p className="text-white font-bold">{achievement.name}</p>
          <p className="text-amber-200/70 text-xs">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}
