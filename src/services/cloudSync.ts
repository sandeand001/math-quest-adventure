import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useGameStore } from '../store/gameStore';

/** Check if Firebase Auth has a valid session (not just a persisted uid). */
function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

/** The shape of data we sync to Firestore (matches the partialize config). */
interface SyncPayload {
  uid: string;
  profiles: unknown[];
  activeProfileId: string | null;
  stageResults: unknown[];
  masteryMap: Record<string, unknown>;
  unlockedAchievements: string[];
  muted: boolean;
}

function getDocRef(uid: string) {
  return doc(db, 'users', uid);
}

/** Pull cloud data and merge into the store. Cloud wins on conflict. */
export async function pullFromCloud(uid: string): Promise<void> {
  if (!isAuthenticated()) return;
  try {
    const snap = await getDoc(getDocRef(uid));
    if (snap.exists()) {
      const data = snap.data() as Partial<SyncPayload>;
      const store = useGameStore.getState();

      // Merge profiles: cloud profiles override local ones with the same id,
      // local-only profiles are kept.
      const cloudProfiles = (data.profiles ?? []) as typeof store.profiles;
      const cloudIds = new Set(cloudProfiles.map((p) => p.id));
      const localOnly = store.profiles.filter((p) => !cloudIds.has(p.id));
      const mergedProfiles = [...cloudProfiles, ...localOnly];

      useGameStore.setState({
        profiles: mergedProfiles,
        activeProfileId: data.activeProfileId ?? store.activeProfileId,
        stageResults: (data.stageResults ?? store.stageResults) as typeof store.stageResults,
        masteryMap: (data.masteryMap ?? store.masteryMap) as typeof store.masteryMap,
        unlockedAchievements: data.unlockedAchievements ?? store.unlockedAchievements,
        muted: data.muted ?? store.muted,
      });
    }
  } catch (err) {
    // Offline or permission error — silently continue with local data
    if (import.meta.env.DEV) console.warn('Cloud pull failed:', err);
  }
}

/** Push current store state to Firestore. */
export async function pushToCloud(uid: string): Promise<void> {
  if (!isAuthenticated()) return;
  try {
    const state = useGameStore.getState();
    const payload: SyncPayload = {
      uid,
      profiles: state.profiles,
      activeProfileId: state.activeProfileId,
      stageResults: state.stageResults,
      masteryMap: state.masteryMap,
      unlockedAchievements: state.unlockedAchievements,
      muted: state.muted,
    };
    await setDoc(getDocRef(uid), payload, { merge: true });
  } catch (err) {
    if (import.meta.env.DEV) console.warn('Cloud push failed:', err);
  }
}
