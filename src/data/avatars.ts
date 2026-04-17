import type { AvatarDefinition } from '../types';

export const AVATARS: AvatarDefinition[] = [
  // ── Starters (free, always available, chosen at profile creation) ──
  { id: 'starting-male',   name: 'Young Hero',    class: 'starter', spritePath: '/assets/avatars/starting-male.png',   premium: false, cost: 0, starter: true },
  { id: 'starting-female', name: 'Young Heroine', class: 'starter', spritePath: '/assets/avatars/starting-female.png', premium: false, cost: 0, starter: true },

  // ── Knights (unlocked progressively) ──
  { id: 'knight-red',    name: 'Crimson Knight', class: 'knight', spritePath: '/assets/avatars/red-knight.png',    premium: true, cost: 100, unlockWorld: 0 },
  { id: 'knight-blue',   name: 'Azure Knight',   class: 'knight', spritePath: '/assets/avatars/blue-knight.png',   premium: true, cost: 100, unlockWorld: 2 },
  { id: 'knight-gold',   name: 'Golden Knight',  class: 'knight', spritePath: '/assets/avatars/gold-knight.png',   premium: true, cost: 300, unlockWorld: 5 },
  { id: 'knight-shadow', name: 'Shadow Knight',  class: 'knight', spritePath: '/assets/avatars/shadow-knight.png', premium: true, cost: 500, unlockWorld: 7 },

  // ── Wizards (unlocked progressively) ──
  { id: 'wizard-purple', name: 'Amethyst Wizard', class: 'wizard', spritePath: '/assets/avatars/purple-wizard.png', premium: true, cost: 100, unlockWorld: 1 },
  { id: 'wizard-green',  name: 'Emerald Wizard',  class: 'wizard', spritePath: '/assets/avatars/green-wizard.png',  premium: true, cost: 100, unlockWorld: 3 },
  { id: 'wizard-fire',   name: 'Fire Wizard',     class: 'wizard', spritePath: '/assets/avatars/fire-wizard.png',   premium: true, cost: 300, unlockWorld: 5 },
  { id: 'wizard-ice',    name: 'Ice Wizard',      class: 'wizard', spritePath: '/assets/avatars/ice-wizard.png',    premium: true, cost: 500, unlockWorld: 7 },

  // ── Rangers (unlocked progressively) ──
  { id: 'ranger-green', name: 'Forest Ranger', class: 'ranger', spritePath: '/assets/avatars/green-ranger.png', premium: true, cost: 100, unlockWorld: 2 },
  { id: 'ranger-brown', name: 'Desert Ranger', class: 'ranger', spritePath: '/assets/avatars/brown-ranger.png', premium: true, cost: 100, unlockWorld: 4 },
  { id: 'ranger-white', name: 'Arctic Ranger', class: 'ranger', spritePath: '/assets/avatars/white-ranger.png', premium: true, cost: 300, unlockWorld: 6 },
  { id: 'ranger-black', name: 'Night Ranger',  class: 'ranger', spritePath: '/assets/avatars/black-ranger.png', premium: true, cost: 500, unlockWorld: 7 },

  // ── Healers (unlocked progressively) ──
  { id: 'healer-white', name: 'Light Healer',   class: 'healer', spritePath: '/assets/avatars/white-healer.png', premium: true, cost: 100, unlockWorld: 1 },
  { id: 'healer-pink',  name: 'Blossom Healer', class: 'healer', spritePath: '/assets/avatars/pink-healer.png',  premium: true, cost: 100, unlockWorld: 3 },
  { id: 'healer-gold',  name: 'Solar Healer',   class: 'healer', spritePath: '/assets/avatars/gold-healer.png',  premium: true, cost: 300, unlockWorld: 6 },
  { id: 'healer-dark',  name: 'Moon Healer',    class: 'healer', spritePath: '/assets/avatars/black-mage.png',   premium: true, cost: 500, unlockWorld: 7 },
];

export const STARTER_AVATARS = AVATARS.filter((a) => a.starter);
export const UNLOCKABLE_AVATARS = AVATARS.filter((a) => !a.starter);

/** Get avatars unlocked at a specific world. */
export function getAvatarsUnlockedAtWorld(worldIndex: number): AvatarDefinition[] {
  return AVATARS.filter((a) => a.unlockWorld === worldIndex);
}

export function getAvatar(id: string): AvatarDefinition | undefined {
  return AVATARS.find((a) => a.id === id);
}
