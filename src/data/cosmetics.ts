import type { CosmeticItem } from '../types';
import { CRYSTALS } from './crystals';

/** Check whether a cosmetic's unlock condition is satisfied for a given profile. */
export function isCosmeticUnlocked(
  item: CosmeticItem,
  profile: { currentWorld: number; collectedCrystals?: string[] },
): boolean {
  if (!item.unlockCondition) return true;

  const cond = item.unlockCondition;

  // 'beat-world-N' → player must have beaten that world's boss
  const worldMatch = cond.match(/^beat-world-(\d+)$/);
  if (worldMatch) {
    const worldIndex = parseInt(worldMatch[1], 10);
    // Beating a world boss either advances currentWorld or collects the crystal (final world)
    const crystal = CRYSTALS.find((c) => c.worldIndex === worldIndex);
    return (
      profile.currentWorld > worldIndex ||
      (!!crystal && (profile.collectedCrystals ?? []).includes(crystal.id))
    );
  }

  // 'defeat-archimedes' → beat world 7 boss
  if (cond === 'defeat-archimedes') {
    return (
      profile.currentWorld > 7 ||
      (profile.collectedCrystals ?? []).includes('crystal-champions')
    );
  }

  return false;
}

export const COSMETICS: CosmeticItem[] = [
  // ── Nameplates (border/frame around name) ──
  { id: 'np-wooden', name: 'Wooden Nameplate', category: 'nameplate', description: 'A simple carved wooden border.', cost: 50, cssClass: 'nameplate-wooden' },
  { id: 'np-stone', name: 'Stone Nameplate', category: 'nameplate', description: 'Chiseled stone tablet with rune accents.', cost: 100, cssClass: 'nameplate-stone' },
  { id: 'np-silver', name: 'Silver Nameplate', category: 'nameplate', description: 'Polished silver with engraved edges.', cost: 200, cssClass: 'nameplate-silver' },
  { id: 'np-gold', name: 'Golden Nameplate', category: 'nameplate', description: 'Gleaming gold with ornate filigree.', cost: 400, cssClass: 'nameplate-gold' },
  { id: 'np-crystal', name: 'Crystal Nameplate', category: 'nameplate', description: 'Translucent purple crystal frame.', cost: 600, cssClass: 'nameplate-crystal' },
  { id: 'np-flame', name: 'Flame Nameplate', category: 'nameplate', description: 'Flickering fire border.', cost: 800, cssClass: 'nameplate-flame' },
  { id: 'np-rainbow', name: 'Rainbow Nameplate', category: 'nameplate', description: 'Shifting rainbow gradient border.', cost: 1000, cssClass: 'nameplate-rainbow' },
  { id: 'np-dragon', name: 'Dragon Nameplate', category: 'nameplate', description: 'Dark obsidian with golden dragon wings.', cost: 1500, cssClass: 'nameplate-dragon', unlockCondition: 'defeat-archimedes' },

  // ── Nameplate Colors (text color) ──
  { id: 'nc-crimson', name: 'Crimson Red', category: 'nameplate-color', description: 'Bold red text.', cost: 25, cssClass: 'nc-crimson', preview: '#dc2626' },
  { id: 'nc-royal-blue', name: 'Royal Blue', category: 'nameplate-color', description: 'Deep blue text.', cost: 25, cssClass: 'nc-royal-blue', preview: '#2563eb' },
  { id: 'nc-emerald', name: 'Emerald Green', category: 'nameplate-color', description: 'Rich green text.', cost: 25, cssClass: 'nc-emerald', preview: '#059669' },
  { id: 'nc-golden', name: 'Golden Yellow', category: 'nameplate-color', description: 'Shining gold text.', cost: 50, cssClass: 'nc-golden', preview: '#eab308' },
  { id: 'nc-purple', name: 'Purple Mystic', category: 'nameplate-color', description: 'Mystical purple text.', cost: 50, cssClass: 'nc-purple', preview: '#9333ea' },
  { id: 'nc-ice', name: 'Ice Blue', category: 'nameplate-color', description: 'Cool icy blue text.', cost: 75, cssClass: 'nc-ice', preview: '#06b6d4' },
  { id: 'nc-hot-pink', name: 'Hot Pink', category: 'nameplate-color', description: 'Bright pink text.', cost: 75, cssClass: 'nc-hot-pink', preview: '#ec4899' },
  { id: 'nc-rainbow', name: 'Rainbow Shift', category: 'nameplate-color', description: 'Animated shifting rainbow text.', cost: 200, cssClass: 'nc-rainbow' },
  { id: 'nc-lava', name: 'Lava Orange', category: 'nameplate-color', description: 'Glowing lava-orange text.', cost: 200, cssClass: 'nc-lava', preview: '#ea580c' },
  { id: 'nc-ghost', name: 'Ghost White', category: 'nameplate-color', description: 'Pulsing ghostly white text.', cost: 300, cssClass: 'nc-ghost' },

  // ── Nameplate Fonts ──
  { id: 'nf-bold-hero', name: 'Bold Hero', category: 'nameplate-font', description: 'Thick, strong block letters.', cost: 50, cssClass: 'nf-bold-hero' },
  { id: 'nf-magical', name: 'Magical Script', category: 'nameplate-font', description: 'Curly wizard-style cursive.', cost: 75, cssClass: 'nf-magical' },
  { id: 'nf-runic', name: 'Runic', category: 'nameplate-font', description: 'Angular fantasy rune-inspired.', cost: 100, cssClass: 'nf-runic' },
  { id: 'nf-royal', name: 'Royal Serif', category: 'nameplate-font', description: 'Elegant serif like a royal decree.', cost: 100, cssClass: 'nf-royal' },
  { id: 'nf-pixel', name: 'Pixel Retro', category: 'nameplate-font', description: 'Chunky pixel-art font.', cost: 75, cssClass: 'nf-pixel' },
  { id: 'nf-bubbly', name: 'Bubbly', category: 'nameplate-font', description: 'Round, bouncy kid-friendly letters.', cost: 50, cssClass: 'nf-bubbly' },

  // ── Backgrounds (behind avatar) ──
  { id: 'bg-forest', name: 'Enchanted Forest', category: 'background', description: 'A mystical forest glade behind you.', cost: 75, cssClass: 'avatar-bg-forest' },
  { id: 'bg-volcano', name: 'Volcanic Crater', category: 'background', description: 'Lava and fire glow behind you.', cost: 75, cssClass: 'avatar-bg-volcano' },
  { id: 'bg-ocean', name: 'Deep Ocean', category: 'background', description: 'Shimmering underwater depths.', cost: 75, cssClass: 'avatar-bg-ocean' },
  { id: 'bg-starfield', name: 'Starfield', category: 'background', description: 'A glittering night sky full of stars.', cost: 150, cssClass: 'avatar-bg-starfield' },
  { id: 'bg-rainbow', name: 'Rainbow Burst', category: 'background', description: 'An explosion of rainbow colors!', cost: 300, cssClass: 'avatar-bg-rainbow' },
  { id: 'bg-sunset', name: 'Sunset Blaze', category: 'background', description: 'A warm orange-pink sunset.', cost: 150, cssClass: 'avatar-bg-sunset' },
  { id: 'bg-aurora', name: 'Northern Lights', category: 'background', description: 'Shimmering aurora borealis.', cost: 400, cssClass: 'avatar-bg-aurora' },
  { id: 'bg-void', name: 'The Void', category: 'background', description: 'Pure darkness with distant stars.', cost: 500, cssClass: 'avatar-bg-void' },

  // ── World Backgrounds (unlocked by completing worlds) ──
  { id: 'bg-world-0', name: 'Emerald Forest', category: 'background', description: 'The magical forest clearing you conquered.', cost: 0, cssClass: 'avatar-bg-world-0', unlockCondition: 'beat-world-0', preview: '/assets/backgrounds/emerald forest.png' },
  { id: 'bg-world-1', name: 'Crystal Caves', category: 'background', description: 'The glowing crystal caverns you explored.', cost: 0, cssClass: 'avatar-bg-world-1', unlockCondition: 'beat-world-1', preview: '/assets/backgrounds/crystal caves.png' },
  { id: 'bg-world-2', name: 'Mystic Meadows', category: 'background', description: 'The enchanted meadows you crossed.', cost: 0, cssClass: 'avatar-bg-world-2', unlockCondition: 'beat-world-2', preview: '/assets/backgrounds/mystic meadow.png' },
  { id: 'bg-world-3', name: 'Ironforge Mountains', category: 'background', description: 'The fiery forges you survived.', cost: 0, cssClass: 'avatar-bg-world-3', unlockCondition: 'beat-world-3', preview: '/assets/backgrounds/ironforge mountains.png' },
  { id: 'bg-world-4', name: 'Shadow Swamp', category: 'background', description: 'The murky swamps you braved.', cost: 0, cssClass: 'avatar-bg-world-4', unlockCondition: 'beat-world-4', preview: '/assets/backgrounds/shadow swamp.png' },
  { id: 'bg-world-5', name: 'Enchanted Ruins', category: 'background', description: 'The ancient ruins you uncovered.', cost: 0, cssClass: 'avatar-bg-world-5', unlockCondition: 'beat-world-5', preview: '/assets/backgrounds/enchanted ruins.png' },
  { id: 'bg-world-6', name: 'Sky Citadel', category: 'background', description: 'The floating castle in the clouds.', cost: 0, cssClass: 'avatar-bg-world-6', unlockCondition: 'beat-world-6', preview: '/assets/backgrounds/sky citadel.png' },
  { id: 'bg-world-7', name: "Dragon's Peak", category: 'background', description: 'The volcanic lair of the final dragon.', cost: 0, cssClass: 'avatar-bg-world-7', unlockCondition: 'beat-world-7', preview: '/assets/backgrounds/dragons peak.png' },

  // ── Effects / Auras (CSS animations around avatar) ──
  { id: 'effect-sparkle', name: 'Sparkle', category: 'effect', description: 'Tiny sparkles float around your avatar.', cost: 100, cssClass: 'effect-sparkle' },
  { id: 'effect-glow', name: 'Golden Glow', category: 'effect', description: 'A warm golden aura surrounds you.', cost: 200, cssClass: 'effect-glow' },
  { id: 'effect-frost', name: 'Frost Mist', category: 'effect', description: 'Cool icy mist drifts around you.', cost: 300, cssClass: 'effect-frost' },
  { id: 'effect-leaves', name: 'Nature Leaves', category: 'effect', description: 'Small green leaves swirl around you.', cost: 250, cssClass: 'effect-leaves' },
  { id: 'effect-shadow', name: 'Shadow Smoke', category: 'effect', description: 'Dark purple wisps curl around you.', cost: 400, cssClass: 'effect-shadow' },
  { id: 'effect-lightning', name: 'Lightning Crackle', category: 'effect', description: 'Electricity arcs around your character.', cost: 500, cssClass: 'effect-lightning' },
  { id: 'effect-stars', name: 'Starfield', category: 'effect', description: 'Tiny stars orbit around you.', cost: 600, cssClass: 'effect-stars' },
  { id: 'effect-rainbow', name: 'Rainbow Trail', category: 'effect', description: 'Colorful rainbow particles surround you.', cost: 800, cssClass: 'effect-rainbow' },
];

export function getCosmetic(id: string): CosmeticItem | undefined {
  return COSMETICS.find((c) => c.id === id);
}

export function getCosmeticsByCategory(category: CosmeticItem['category']): CosmeticItem[] {
  return COSMETICS.filter((c) => c.category === category);
}
