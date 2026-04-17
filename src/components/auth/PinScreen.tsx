import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export function PinScreen() {
  const { pin, setPin, setScreen } = useGameStore();
  const isSetup = pin === null;

  const [entered, setEntered] = useState('');
  const [confirm, setConfirm] = useState('');
  const [phase, setPhase] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleDigit = (d: string) => {
    setError('');
    if (phase === 'enter') {
      if (entered.length < 4) {
        const next = entered + d;
        setEntered(next);
        if (next.length === 4) {
          if (isSetup) {
            // Move to confirm phase
            setTimeout(() => {
              setPhase('confirm');
              setEntered(next); // keep for comparison
            }, 200);
          } else {
            // Verify PIN
            if (next === pin) {
              setScreen('profile-select');
            } else {
              triggerShake();
              setError('Wrong PIN');
              setTimeout(() => setEntered(''), 300);
            }
          }
        }
      }
    } else {
      // Confirm phase (setup only)
      if (confirm.length < 4) {
        const next = confirm + d;
        setConfirm(next);
        if (next.length === 4) {
          if (next === entered) {
            setPin(next);
            setScreen('profile-select');
          } else {
            triggerShake();
            setError('PINs don\u2019t match \u2014 try again');
            setTimeout(() => {
              setConfirm('');
              setPhase('enter');
              setEntered('');
            }, 600);
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    setError('');
    if (phase === 'confirm') {
      setConfirm((prev) => prev.slice(0, -1));
    } else {
      setEntered((prev) => prev.slice(0, -1));
    }
  };

  const currentValue = phase === 'confirm' ? confirm : entered;
  const title = isSetup
    ? phase === 'confirm'
      ? 'Confirm Your PIN'
      : 'Create a 4-Digit PIN'
    : 'Enter PIN';
  const subtitle = isSetup
    ? phase === 'confirm'
      ? 'Enter the same PIN again'
      : 'This keeps your profiles safe'
    : 'Enter your PIN to continue';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-xs w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
            MathQuest
          </h1>
          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>

        {/* PIN dots */}
        <div
          className={`flex justify-center gap-4 ${shake ? 'animate-shake' : ''}`}
          role="status"
          aria-label={`${currentValue.length} of 4 digits entered`}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`
                w-5 h-5 rounded-full border-2 transition-all duration-200
                ${i < currentValue.length
                  ? 'bg-indigo-400 border-indigo-400 scale-110'
                  : 'bg-transparent border-gray-600'}
              `}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-center text-sm text-red-400 font-medium" role="alert">
            {error}
          </p>
        )}

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key) => {
            if (key === '') return <div key="empty" />;
            if (key === 'del') {
              return (
                <button
                  key="del"
                  onClick={handleBackspace}
                  className="
                    aspect-square rounded-2xl text-xl font-bold
                    bg-gray-800/50 border border-gray-700/40 text-gray-400
                    hover:bg-gray-700/50 hover:text-white
                    active:scale-95 transition-all
                    flex items-center justify-center
                  "
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
                className="
                  aspect-square rounded-2xl text-2xl font-bold
                  bg-indigo-950/60 border border-indigo-800/40 text-white
                  hover:bg-indigo-900/60 hover:border-indigo-600
                  active:scale-95 transition-all
                "
                aria-label={`Digit ${key}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
