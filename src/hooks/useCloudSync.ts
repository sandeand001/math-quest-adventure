import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { pullFromCloud, pushToCloud } from '../services/cloudSync';

/**
 * Syncs game state with Firestore when a user is signed in.
 * - Pulls cloud data once after login.
 * - Pushes changes to the cloud whenever persisted state changes.
 */
export function useCloudSync() {
  const uid = useGameStore((s) => s.uid);
  const profiles = useGameStore((s) => s.profiles);
  const stageResults = useGameStore((s) => s.stageResults);
  const masteryMap = useGameStore((s) => s.masteryMap);
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const hasPulled = useRef(false);

  // Pull from cloud on first login
  useEffect(() => {
    if (!uid || hasPulled.current) return;
    hasPulled.current = true;
    pullFromCloud(uid);
  }, [uid]);

  // Push to cloud when game state changes (debounced)
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!uid) return;
    // Skip the initial render (pull hasn't happened yet)
    if (!hasPulled.current) return;

    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      pushToCloud(uid);
    }, 2000); // 2-second debounce

    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [uid, profiles, stageResults, masteryMap, unlockedAchievements]);
}
