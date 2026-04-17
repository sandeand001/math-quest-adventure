import type { SidekickDefinition } from '../types';

export const SIDEKICKS: SidekickDefinition[] = [
  {
    id: 'twig',
    name: 'Twig',
    description: 'A tiny stick sprite with an acorn helmet. Tries to be tough, is adorable.',
    spritePath: '/assets/mini-bosses/twig',
    placement: 'ground',
  },
  {
    id: 'glimmer',
    name: 'Glimmer',
    description: 'A sparkly crystal bat who always looks confused.',
    spritePath: '/assets/mini-bosses/glimmer',
    placement: 'flying',
  },
  {
    id: 'petalwhirl',
    name: 'Petalwhirl',
    description: 'A chubby flower fairy with daisy wings and a dandelion wand.',
    spritePath: '/assets/mini-bosses/petalwhirl',
    placement: 'flying',
  },
  {
    id: 'cinder',
    name: 'Cinder',
    description: 'A grumpy little fire imp with a tiny hammer. Permanently annoyed.',
    spritePath: '/assets/mini-bosses/cinder',
    placement: 'ground',
  },
  {
    id: 'boggle',
    name: 'Boggle',
    description: 'A gloriously ugly swamp toad with mismatched eyes and mushrooms on its back.',
    spritePath: '/assets/mini-bosses/boggle',
    placement: 'ground',
  },
  {
    id: 'rune',
    name: 'Rune',
    description: 'A mysterious floating stone mask with glowing turquoise runes.',
    spritePath: '/assets/mini-bosses/rune',
    placement: 'flying',
  },
  {
    id: 'zephyr',
    name: 'Zephyr',
    description: 'A fluffy cloud dragon who looks permanently surprised. Cute and zappy.',
    spritePath: '/assets/mini-bosses/zephyr',
    placement: 'flying',
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'A tiny phoenix made of smoldering coals. Small but never gives up.',
    spritePath: '/assets/mini-bosses/ember',
    placement: 'ground',
  },
];

/** Id-keyed map for O(1) lookups. */
const SIDEKICK_MAP = new Map<string, SidekickDefinition>(SIDEKICKS.map((s) => [s.id, s]));

export function getSidekick(id: string): SidekickDefinition | undefined {
  return SIDEKICK_MAP.get(id);
}
