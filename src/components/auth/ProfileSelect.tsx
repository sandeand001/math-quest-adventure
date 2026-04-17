import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { AvatarId } from '../../types';
import { AvatarDisplay } from '../ui/AvatarDisplay';
import { getCosmetic } from '../../data/cosmetics';
import { STARTER_AVATARS } from '../../data/avatars';

function PinPad({
  title,
  subtitle,
  onComplete,
  onBack,
}: {
  title: string;
  subtitle: string;
  onComplete: (pin: string) => void;
  onBack?: () => void;
}) {
  const [entered, setEntered] = useState('');
  const [error, setError] = useState('');

  const handleDigit = (d: string) => {
    setError('');
    if (entered.length < 4) {
      const next = entered + d;
      setEntered(next);
      if (next.length === 4) {
        onComplete(next);
      }
    }
  };

  const handleBackspace = () => {
    setError('');
    setEntered((prev) => prev.slice(0, -1));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <p className="text-lg font-semibold text-white">{title}</p>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>

      {/* PIN dots */}
      <div
        className="flex justify-center gap-4"
        role="status"
        aria-label={`${entered.length} of 4 digits entered`}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`
              w-5 h-5 rounded-full border-2 transition-all duration-200
              ${i < entered.length
                ? 'bg-indigo-400 border-indigo-400 scale-110'
                : 'bg-transparent border-gray-600'}
            `}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-red-400 font-medium" role="alert">{error}</p>
      )}

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key) => {
          if (key === '') return <div key="empty" />;
          if (key === 'del') {
            return (
              <button
                key="del"
                onClick={handleBackspace}
                className="aspect-square rounded-2xl text-xl font-bold
                  bg-gray-800/50 border border-gray-700/40 text-gray-400
                  hover:bg-gray-700/50 hover:text-white active:scale-95 transition-all
                  flex items-center justify-center"
                aria-label="Delete last digit"
              >
                ⌫
              </button>
            );
          }
          return (
            <button
              key={key}
              onClick={() => handleDigit(key)}
              className="aspect-square rounded-2xl text-2xl font-bold
                bg-indigo-950/60 border border-indigo-800/40 text-white
                hover:bg-indigo-900/60 hover:border-indigo-600 active:scale-95 transition-all"
              aria-label={`Digit ${key}`}
            >
              {key}
            </button>
          );
        })}
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="block mx-auto text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
}

export function ProfileSelect() {
  const { profiles, setActiveProfile, setScreen, addProfile, updateProfile, deleteProfile, createTestProfile } = useGameStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [step, setStep] = useState<'name' | 'avatar' | 'pin-create' | 'pin-confirm'>('name');
  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newPin, setNewPin] = useState('');

  // Per-profile PIN entry state
  const [pinPromptId, setPinPromptId] = useState<string | null>(null);
  const [pinMode, setPinMode] = useState<'enter' | 'setup' | 'setup-confirm'>('enter');
  const [setupPin, setSetupPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinKey, setPinKey] = useState(0); // key to force PinPad remount on error

  const handleSelectProfile = (id: string) => {
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;
    setPinPromptId(id);
    // If profile has no PIN (legacy profile), prompt to create one
    if (!profile.pin) {
      setPinMode('setup');
    } else {
      setPinMode('enter');
    }
    setPinError('');
    setSetupPin('');
    setPinKey((k) => k + 1);
  };

  const handlePinSubmit = (pin: string) => {
    const profile = profiles.find((p) => p.id === pinPromptId);
    if (!profile) return;

    if (pinMode === 'setup') {
      // First entry — save and ask to confirm
      setSetupPin(pin);
      setPinMode('setup-confirm');
      setPinKey((k) => k + 1);
      return;
    }

    if (pinMode === 'setup-confirm') {
      if (pin === setupPin) {
        // Save PIN to profile and enter
        updateProfile(profile.id, { pin });
        setPinPromptId(null);
        setActiveProfile(profile.id);
        setScreen('world-map');
      } else {
        setPinError('PINs don\u2019t match \u2014 try again');
        setSetupPin('');
        setPinMode('setup');
        setPinKey((k) => k + 1);
      }
      return;
    }

    // Normal PIN entry
    if (pin === profile.pin) {
      setPinPromptId(null);
      setActiveProfile(profile.id);
      setScreen('world-map');
    } else {
      setPinError('Wrong PIN');
      setPinKey((k) => k + 1);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setStep('avatar');
  };

  const handleAvatarNext = () => {
    if (!selectedAvatarId) return;
    setStep('pin-create');
  };

  const handlePinCreate = (pin: string) => {
    setNewPin(pin);
    setStep('pin-confirm');
  };

  const handlePinConfirm = (pin: string) => {
    if (pin === newPin) {
      const profile = addProfile(newName.trim(), 'fantasy', selectedAvatarId!, newPin);
      setActiveProfile(profile.id);
      resetCreateForm();
      setScreen('world-map');
    } else {
      // Mismatch — restart PIN setup
      setNewPin('');
      setStep('pin-create');
    }
  };

  const resetCreateForm = () => {
    setNewName('');
    setSelectedAvatarId(null);
    setNewPin('');
    setShowCreate(false);
    setStep('name');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
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
                  w-full relative overflow-hidden rounded-2xl border border-indigo-800/40
                  ${profileBgClass ? '' : 'bg-indigo-950/60'}
                  hover:border-indigo-600 transition-all
                `}
              >
                {/* Background fill — world image */}
                {profileBgImage && (
                  <img
                    src={profileBgImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
                  />
                )}
                {/* Background fill — gradient */}
                {profileBgClass && !profileBgImage && (
                  <div className={`absolute inset-0 ${profileBgClass} opacity-50 pointer-events-none`} />
                )}

                {/* Primary action: select this profile */}
                <button
                  type="button"
                  onClick={() => handleSelectProfile(profile.id)}
                  aria-label={`Play as ${profile.name}`}
                  className="
                    w-full flex flex-col items-center gap-2 p-6 text-center
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
                    onClick={handleAvatarNext}
                    disabled={!selectedAvatarId}
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
              </div>
            )}

            {step === 'pin-create' && (
              <PinPad
                key="create"
                title="Create a 4-Digit PIN"
                subtitle={`This keeps ${newName.trim()}'s profile safe`}
                onComplete={handlePinCreate}
                onBack={() => setStep('avatar')}
              />
            )}

            {step === 'pin-confirm' && (
              <PinPad
                key="confirm"
                title="Confirm Your PIN"
                subtitle="Enter the same PIN again"
                onComplete={handlePinConfirm}
                onBack={() => { setNewPin(''); setStep('pin-create'); }}
              />
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
          {!profiles.some((p) => p.name === '🧪 Test User') && (
            <button
              onClick={createTestProfile}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              🧪 Add Test User
            </button>
          )}
        </div>
      </div>

      {/* PIN prompt modal */}
      {pinPromptId && (() => {
        const promptName = profiles.find((p) => p.id === pinPromptId)?.name ?? 'Player';
        const pinTitle =
          pinMode === 'setup' ? `Create a PIN for ${promptName}`
          : pinMode === 'setup-confirm' ? 'Confirm Your PIN'
          : `Enter PIN for ${promptName}`;
        const pinSubtitle =
          pinError
          || (pinMode === 'setup' ? 'Set a 4-digit PIN to protect this profile'
            : pinMode === 'setup-confirm' ? 'Enter the same PIN again'
            : 'Enter your 4-digit PIN');
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
            <div className="bg-indigo-950 border border-indigo-800/50 rounded-2xl p-6 max-w-xs w-full space-y-4">
              <PinPad
                key={pinKey}
                title={pinTitle}
                subtitle={pinSubtitle}
                onComplete={handlePinSubmit}
                onBack={() => setPinPromptId(null)}
              />
            </div>
          </div>
        );
      })()}

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
