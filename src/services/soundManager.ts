import { Howl } from 'howler';

const cache = new Map<string, Howl>();

/** Play a sound effect, reusing a cached Howl instance if available. */
export function playSfx(src: string, volume = 0.5): void {
  let howl = cache.get(src);
  if (!howl) {
    howl = new Howl({ src: [src], volume });
    cache.set(src, howl);
  }
  howl.volume(volume);
  howl.play();
}

// ── Synthesized stage SFX (no files needed) ──

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/** Short cheerful chime for correct answers. */
export function playCorrectSfx(): void {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, ctx.currentTime);       // C5
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.08); // E5
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.16); // G5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch { /* audio not available */ }
}

/** Gentle low buzz for wrong answers. */
export function playWrongSfx(): void {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch { /* audio not available */ }
}
