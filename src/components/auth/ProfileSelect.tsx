import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { AvatarId } from '../../types';
import { AvatarDisplay } from '../ui/AvatarDisplay';
import { getCosmetic } from '../../data/cosmetics';
import { STARTER_AVATARS } from '../../data/avatars';

export function ProfileSelect() {
  const { profiles, setActiveProfile, setScreen, addProfile, updateProfile, deleteProfile, createTestProfile, setUid, uid } = useGameStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [step, setStep] = useState<'name' | 'avatar'>('name');
  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (import.meta.env.DEV) console.log('ProfileSelect uid:', uid);

  const handleSelectProfile = (id: string) => {
    // Retroactively grant world background cosmetics for completed worlds
    const profile = profiles.find((p) => p.id === id);
    if (profile) {
      const owned = new Set(profile.purchasedCosmetics ?? []);
      const toGrant: string[] = [];
      for (let w = 0; w < profile.currentWorld; w++) {
        const bgId = `bg-world-${w}`;
        if (!owned.has(bgId)) toGrant.push(bgId);
      }
      if (toGrant.length > 0) {
        updateProfile(id, {
          purchasedCosmetics: [...(profile.purchasedCosmetics ?? []), ...toGrant],
        });
      }
    }
    setActiveProfile(id);
    setScreen('world-map');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setStep('avatar');
  };

  const handleCreateProfile = () => {
    if (!newName.trim() || !selectedAvatarId) return;
    const profile = addProfile(newName.trim(), 'fantasy', selectedAvatarId);
    setActiveProfile(profile.id);
    setNewName('');
    setSelectedAvatarId(null);
    setShowCreate(false);
    setStep('name');
    setScreen('world-map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full space-y-6" style={{ maxWidth: 700 }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">MathQuest</h1>
          <p className="text-gray-400">Who's playing today?</p>
        </div>

        {/* Existing profiles */}
        <div className="space-y-3">
          {profiles.map((profile) => {
            const profileBg = profile.equippedCosmetics?.background ? getCosmetic(profile.equippedCosmetics.background) : null;
            const profileBgIsWorld = profileBg?.cssClass?.startsWith('avatar-bg-world-');
            const profileBgImage = profileBgIsWorld ? profileBg?.preview : null;
            const profileBgClass = !profileBgIsWorld ? profileBg?.cssClass : null;

            return (
              <div
                key={profile.id}
                className={`
                  w-full relative rounded-2xl border border-indigo-800/40
                  ${profileBgClass ? '' : 'bg-indigo-950/60'}
                  hover:border-indigo-600 transition-all
                `}
              >
                {/* Background fill — world image */}
                {profileBgImage && (
                  <img
                    src={profileBgImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none rounded-2xl"
                  />
                )}
                {/* Background fill — gradient */}
                {profileBgClass && !profileBgImage && (
                  <div className={`absolute inset-0 ${profileBgClass} opacity-50 pointer-events-none rounded-2xl`} />
                )}

                {/* Primary action: select this profile */}
                <button
                  type="button"
                  onClick={() => handleSelectProfile(profile.id)}
                  aria-label={`Play as ${profile.name}`}
                  className="
                    w-full flex flex-col items-center gap-3 pt-10 px-8 pb-10 text-center
                    hover:bg-indigo-900/40 transition-all active:scale-[0.98]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
                    rounded-2xl relative z-10
                  "
                >
                  <AvatarDisplay
                    avatarId={profile.avatarId ?? null}
                    name={profile.name}
                    equippedCosmetics={profile.equippedCosmetics ?? null}
                    sidekick={profile.activeSidekick ?? null}
                    collectedCrystals={profile.collectedCrystals ?? []}
                  />
                  <div>
                    <p className="font-bold text-white text-lg">{profile.name}</p>
                    <p className="text-sm text-gray-400">
                      Level {profile.stats.level} · World {profile.currentWorld + 1}
                    </p>
                  </div>
                </button>

                {/* Secondary action: delete (sibling, not nested) */}
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(profile.id)}
                  aria-label={`Delete ${profile.name}'s profile`}
                  className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full
                    bg-red-900/60 border border-red-700/40 text-red-300
                    hover:bg-red-700/80 hover:text-white
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400
                    flex items-center justify-center text-xs transition-all"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Create new profile */}
        {showCreate ? (
          <div className="bg-indigo-950/60 border border-indigo-800/40 rounded-2xl p-5 space-y-4">
            {step === 'name' ? (
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <h3 className="font-bold text-white">New Adventurer</h3>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name"
                  maxLength={20}
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-indigo-900/40 border border-indigo-700/40 text-white
                    placeholder:text-gray-500 focus:outline-none focus:border-indigo-400
                  "
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setStep('name'); setNewName(''); }}
                    className="flex-1 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newName.trim()}
                    className="
                      flex-1 py-2 rounded-xl font-bold
                      bg-gradient-to-r from-indigo-600 to-blue-600 text-white
                      disabled:opacity-40 disabled:cursor-not-allowed
                      hover:from-indigo-500 hover:to-blue-500 transition-all
                    "
                  >
                    Next →
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-white">Choose Your Hero</h3>
                <p className="text-xs text-gray-400">
                  Pick a starting character for <span className="text-indigo-300">{newName.trim()}</span>
                </p>

                {/* Starter avatar selection — two large side-by-side options */}
                <div className="grid grid-cols-2 gap-4">
                  {STARTER_AVATARS.map((avatar) => {
                    const isSelected = selectedAvatarId === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatarId(avatar.id)}
                        className={`
                          relative rounded-xl overflow-hidden transition-all p-3 flex flex-col items-center gap-2
                          ${isSelected
                            ? 'ring-2 ring-yellow-400 scale-105 bg-indigo-800/60'
                            : 'bg-indigo-900/40 hover:bg-indigo-800/60 hover:scale-102'}
                        `}
                      >
                        <div className="aspect-square w-full rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={avatar.spritePath}
                            alt={avatar.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `<span class="text-5xl">🧑‍⚔️</span>`;
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-300 font-medium">{avatar.name}</p>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] text-gray-500 text-center">
                  More heroes unlock as you adventure!
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep('name'); setSelectedAvatarId(null); }}
                    className="flex-1 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateProfile}
                    disabled={!selectedAvatarId}
                    className="
                      flex-1 py-2 rounded-xl font-bold
                      bg-gradient-to-r from-indigo-600 to-blue-600 text-white
                      disabled:opacity-40 disabled:cursor-not-allowed
                      hover:from-indigo-500 hover:to-blue-500 transition-all
                    "
                  >
                    Start Adventure!
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="
              w-full py-3 rounded-2xl border-2 border-dashed border-indigo-700/40
              text-indigo-400 hover:text-indigo-300 hover:border-indigo-600
              transition-all text-sm font-medium
            "
          >
            + Add Player
          </button>
        )}

        {/* Parent dashboard link */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setScreen('parent-dashboard')}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            📊 Parent Dashboard
          </button>
          {uid === 'Qz0v7i8ds7MvH5QDF3z76sQTZq83' && !profiles.some((p) => p.name === '🧪 Test User') && (
            <button
              onClick={createTestProfile}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              🧪 Add Test User
            </button>
          )}
          <button
            onClick={async () => {
              const { auth } = await import('../../firebase/config');
              const { signOut } = await import('firebase/auth');
              await signOut(auth);
              setUid(null);
              setScreen('login');
            }}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
          <div className="bg-indigo-950 border border-red-800/50 rounded-2xl p-6 max-w-xs w-full text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Profile?</h3>
            <p className="text-sm text-gray-400">
              This will permanently delete <span className="text-red-300 font-medium">{profiles.find((p) => p.id === confirmDeleteId)?.name}</span> and all their progress. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProfile(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2 rounded-xl font-bold bg-red-700 hover:bg-red-600 text-white transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
