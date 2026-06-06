import { BOSSES } from '../data/bosses';
import { AVATARS } from '../data/avatars';
import { SIDEKICKS } from '../data/sidekicks';
import { CRYSTALS } from '../data/crystals';
import { WORLDS } from '../data/worlds';
import { OVERWORLD_MAP_IMAGE, ZONE_MAPS } from '../data/mapConfig';

const BOSS_POSES = ['base-position', 'attack-position', 'hit-position', 'defeated-position'];
const PIP_SPRITES = [
  'happy', 'sad', 'excited', 'scared', 'surprised', 'thinking', 'eating', 'battle-ready',
].map((e) => `/assets/characters/pip/${e}.png`);
const HOOT_SPRITES = [
  'wise', 'proud', 'concerned', 'celebrating',
].map((p) => `/assets/characters/professor-hoot/${p}.png`);
const SFX_FILES = ['dragon', 'owl', 'sphinx'].flatMap((prefix) =>
  ['attack', 'hit', 'victory'].map((action) => `/assets/sfx/${prefix}_${action}.wav`),
);

/** Bump when public/assets contents change to re-warm the cache. */
const ASSET_VERSION = 1;
const VERSION_KEY = 'mathquest-cache-version';

function collectAllAssetUrls(): string[] {
  const urls = new Set<string>();

  // Boss + mini-boss sprites (4 poses each)
  for (const boss of BOSSES) {
    for (const pose of BOSS_POSES) {
      urls.add(`${boss.spritePath}/${pose}.png`);
    }
  }

  // Avatars
  for (const a of AVATARS) urls.add(a.spritePath);

  // Sidekick base poses (paths overlap with mini-bosses, Set dedupes)
  for (const sk of SIDEKICKS) urls.add(`${sk.spritePath}/base-position.png`);

  // Crystals
  for (const c of CRYSTALS) {
    urls.add(c.spritePath);
    if (c.miniSpritePath) urls.add(c.miniSpritePath);
  }

  // Overworld + zone maps
  urls.add(OVERWORLD_MAP_IMAGE);
  for (const zm of ZONE_MAPS) {
    if (zm) urls.add(zm.image);
  }

  // World & battle backgrounds
  for (const w of WORLDS) {
    urls.add(w.background);
    urls.add(w.battleBackground);
  }

  // Character sprites
  for (const s of PIP_SPRITES) urls.add(s);
  for (const s of HOOT_SPRITES) urls.add(s);

  // Sound effects
  for (const s of SFX_FILES) urls.add(s);

  return [...urls];
}

/**
 * Pre-fetches every game asset so the service worker caches them.
 * Runs in small batches to avoid saturating the connection.
 * Skips assets already in the SW cache from a prior warm.
 */
export async function warmAssetCache(): Promise<void> {
  if (!navigator.onLine) return;
  if (!('caches' in window)) return;

  // Already warmed for this version?
  if (localStorage.getItem(VERSION_KEY) === String(ASSET_VERSION)) return;

  const urls = collectAllAssetUrls();

  // Check which URLs are already cached so we don't re-download them
  const imageCache = await caches.open('game-images');
  const audioCache = await caches.open('game-audio');

  const uncached: string[] = [];
  for (const url of urls) {
    const cache = url.match(/\.(wav|mp3|ogg)$/i) ? audioCache : imageCache;
    const hit = await cache.match(url);
    if (!hit) uncached.push(url);
  }

  if (uncached.length === 0) {
    localStorage.setItem(VERSION_KEY, String(ASSET_VERSION));
    return;
  }

  // Fetch in small batches (4 concurrent) to avoid overwhelming the connection
  const BATCH = 4;
  for (let i = 0; i < uncached.length; i += BATCH) {
    // Abort if we go offline mid-warm
    if (!navigator.onLine) return;

    const batch = uncached.slice(i, i + BATCH);
    await Promise.allSettled(batch.map((url) => fetch(url)));
  }

  localStorage.setItem(VERSION_KEY, String(ASSET_VERSION));
}
