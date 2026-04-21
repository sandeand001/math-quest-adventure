import { getBossSprite } from '../../data/bosses';
import { getSidekick } from '../../data/sidekicks';
import { QuestionCard } from './QuestionCard';
import { HeartsBar } from '../ui/HeartsBar';
import { CrystalTracker } from '../ui/CrystalTracker';
import { AvatarDisplay } from '../ui/AvatarDisplay';
import { StoryDialog } from '../ui/StoryDialog';
import { AchievementToast } from '../ui/AchievementToast';
import { useBossFight } from '../../hooks/useBossFight';

export function BossFight() {
  const {
    profile,
    world,
    boss,
    isBossFight,
    currentWorldIndex,
    bossHp,
    bossMaxHp,
    playerHp,
    playerMaxHp,
    shieldActive,
    fightOver,
    victory,
    xpEarned,
    currentQuestion,
    crystalReward,
    pose,
    sidekickPose,
    shaking,
    flashVisible,
    bossIntro,
    bossVictoryStory,
    showBossIntro,
    setShowBossIntro,
    showVictoryStory,
    setShowVictoryStory,
    pendingDialogs,
    dismissCurrentDialog,
    bossAchievements,
    toastIndex,
    setToastIndex,
    handleAnswer,
    handleRetreat,
    handlePostFight,
  } = useBossFight();

  const crystalRewardData = crystalReward;

  return (
    <div
      className="h-full relative overflow-hidden"
      style={{ background: '#0f1222' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url("${encodeURI(world?.battleBackground ?? world?.background ?? '')}")` }}
      />

      {/* Boss area — takes full screen, never resizes */}
      <div className="absolute inset-0 z-10 flex flex-col items-center overflow-hidden">
        {/* Retreat button */}
        {!fightOver && (
          <button
            onClick={handleRetreat}
            className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-red-900/60 border border-red-700/40 text-red-300
              hover:bg-red-800/60 hover:text-white transition-all"
          >
            ← Retreat
          </button>
        )}

        {/* Boss name & HP */}
        <div className="absolute top-4 left-0 right-0 flex flex-col items-center gap-2 z-10">
          <h2 className="text-xl font-bold text-white">{boss.name}</h2>
          <HeartsBar current={bossHp} max={bossMaxHp} color="red" size="md" />
        </div>

        {/* Boss image — fixed position, unaffected by question box */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-transform duration-200 ${shaking ? 'animate-shake' : ''}`}
          style={{ bottom: '30%' }}
        >
          <img
            src={getBossSprite(boss, pose)}
            alt={boss.name}
            className={`object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-opacity duration-200 ${
              currentWorldIndex === 7 && isBossFight
                ? 'w-[90vw] h-[70vh] max-w-[1000px] max-h-[750px]'
                : isBossFight
                  ? 'w-[80vw] h-[60vh] max-w-[850px] max-h-[650px]'
                  : 'w-[70vw] h-[55vh] max-w-[700px] max-h-[550px]'
            }`}
          />
          {/* Flash hit overlay */}
          {flashVisible && (
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping pointer-events-none" />
          )}
        </div>

        {/* Player HP — fixed above question area */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 z-10">
          <span className="text-xs text-gray-400 font-medium">Your HP</span>
          <HeartsBar current={playerHp} max={playerMaxHp} color="green" size="md" />
          <CrystalTracker collectedCrystals={profile?.collectedCrystals ?? []} size="sm" />
          {shieldActive && (
            <span className="text-xs text-blue-400">🛡️ Shield ready</span>
          )}
        </div>

        {/* Player avatar — bottom left, above question box */}
        {profile && (
          <div className="absolute left-2 z-30 flex items-end" style={{ bottom: '35%' }}>
            <AvatarDisplay
              avatarId={profile.avatarId ?? null}
              name={profile.name}
              equippedCosmetics={profile.equippedCosmetics ?? null}
              collectedCrystals={profile.collectedCrystals ?? []}
              size={250}
            />
            {/* Sidekick — to the LEFT of the player (away from boss) */}
            {profile.activeSidekick && (() => {
              const sk = getSidekick(profile.activeSidekick);
              if (!sk) return null;
              const skSize = 120;
              const isFlying = sk.placement === 'flying';
              return (
                <img
                  src={`${sk.spritePath}/${sidekickPose}.png`}
                  alt={sk.name}
                  className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-all duration-200 -order-1"
                  style={{
                    width: skSize,
                    height: skSize,
                    objectFit: 'contain',
                    marginRight: -10,
                    alignSelf: isFlying ? 'flex-start' : 'flex-end',
                    marginBottom: isFlying ? undefined : 10,
                    marginTop: isFlying ? 10 : undefined,
                  }}
                />
              );
            })()}
          </div>
        )}
      </div>

      {/* Question area — pinned to bottom, compact */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/70 backdrop-blur-sm border-t border-indigo-800/30 px-4 py-3">
        {fightOver ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {victory ? '🎉 Victory!' : '💀 Defeated...'}
            </h2>
            {victory && crystalRewardData && (
              <div className="flex flex-col items-center gap-2 animate-bounce-slow">
                <img
                  src={crystalRewardData.spritePath}
                  alt={crystalRewardData.name}
                  className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                />
                <p className="text-sm font-semibold" style={{ color: crystalRewardData.color }}>
                  {crystalRewardData.name} obtained!
                </p>
              </div>
            )}
            <p className="text-gray-300">
              {victory
                ? `You defeated ${boss.name}! +${xpEarned} XP`
                : `${boss.name} was too strong. Practice more and try again!`}
            </p>
            <button
              onClick={handlePostFight}
              className="
                px-8 py-3 rounded-xl text-lg font-bold
                bg-gradient-to-r from-indigo-600 to-blue-600
                hover:from-indigo-500 hover:to-blue-500
                text-white transition-all active:scale-95
              "
            >
              {victory ? 'Continue →' : 'Back to Practice'}
            </button>
          </div>
        ) : currentQuestion ? (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
            streak={0}
          />
        ) : null}
      </div>
      {showBossIntro && bossIntro && (
        <StoryDialog story={bossIntro} onComplete={() => setShowBossIntro(false)} />
      )}
      {showVictoryStory && bossVictoryStory && (
        <StoryDialog story={bossVictoryStory} onComplete={() => setShowVictoryStory(false)} />
      )}
      {!showVictoryStory && pendingDialogs.length > 0 && (
        <StoryDialog
          key={pendingDialogs[0].speaker + '-' + pendingDialogs[0].lines[0]?.slice(0, 20)}
          story={pendingDialogs[0]}
          onComplete={dismissCurrentDialog}
        />
      )}
      {bossAchievements.length > 0 && toastIndex < bossAchievements.length && (
        <AchievementToast
          key={bossAchievements[toastIndex]}
          achievementId={bossAchievements[toastIndex]}
          onDone={() => setToastIndex((i) => i + 1)}
        />
      )}
    </div>
  );
}
