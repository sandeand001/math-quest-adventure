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
