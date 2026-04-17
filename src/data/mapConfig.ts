/**
 * Overworld map node coordinates.
 * Positions are percentages (0–100) relative to the map image dimensions.
 * Adjust these values if the clickable nodes don't align with the clearings.
 */
export interface MapNode {
  worldIndex: number;
  name: string;
  top: number;   // % from top
  left: number;  // % from left
}

export const OVERWORLD_NODES: MapNode[] = [
  { worldIndex: 0, name: 'Emerald Forest',      top: 81.8, left: 12.7 },
  { worldIndex: 1, name: 'Crystal Caves',       top: 82.7, left: 35.5 },
  { worldIndex: 2, name: 'Mystic Meadows',      top: 49.7, left: 20.7 },
  { worldIndex: 3, name: 'Ironforge Mountains',  top: 31.4, left: 43.7 },
  { worldIndex: 4, name: 'Shadow Swamp',        top: 71.3, left: 59.9 },
  { worldIndex: 5, name: 'Enchanted Ruins',     top: 76.7, left: 83.5 },
  { worldIndex: 6, name: 'Sky Citadel',         top: 27.4, left: 70.7 },
  { worldIndex: 7, name: "Dragon's Peak",       top: 28.3, left: 89.5 },
];

export const SHOP_NODE = { name: 'Shop', top: 22.9, left: 14 };

// ── Zone Maps (per-world stage maps) ────────────────────────────────

export interface ZoneStageNode {
  stageIndex: number;
  top: number;
  left: number;
  type: 'practice' | 'challenge' | 'mini-boss' | 'world-boss';
}

export interface ZoneMapConfig {
  image: string;          // path to zone map image
  calibrating: boolean;   // set true to enable calibration tool
  nodes: ZoneStageNode[];
}

/**
 * Zone map configs for each world.
 * To calibrate a new zone map:
 *   1. Add the image path and set calibrating: true
 *   2. Run dev, click each of the 8 stage locations in order
 *   3. Copy the console output into the nodes array
 *   4. Set calibrating: true
 */
export const ZONE_MAPS: (ZoneMapConfig | null)[] = [
  // World 0: Emerald Forest
  { image: '/assets/maps/tier maps/emerald forest.png', calibrating: false, nodes: [
    { stageIndex: 0, top: 45.8, left: 22.8, type: 'practice' },
    { stageIndex: 1, top: 48.3, left: 27, type: 'practice' },
    { stageIndex: 2, top: 52.4, left: 28.9, type: 'challenge' },
    { stageIndex: 3, top: 60.6, left: 29.5, type: 'challenge' },
    { stageIndex: 4, top: 65.5, left: 40.7, type: 'mini-boss' },
    { stageIndex: 5, top: 72.9, left: 55.6, type: 'challenge' },
    { stageIndex: 6, top: 65.5, left: 65.2, type: 'challenge' },
    { stageIndex: 7, top: 56.8, left: 75.9, type: 'world-boss' },
  ] },
  // World 1: Crystal Caves
  { image: '/assets/maps/tier maps/crystal cave.png', calibrating: false, nodes: [
    { stageIndex: 0, top: 89.7, left: 32.4, type: 'practice' },
    { stageIndex: 1, top: 74.5, left: 31.2, type: 'practice' },
    { stageIndex: 2, top: 65.9, left: 42.2, type: 'challenge' },
    { stageIndex: 3, top: 62.9, left: 52.2, type: 'challenge' },
    { stageIndex: 4, top: 59.2, left: 60.1, type: 'mini-boss' },
    { stageIndex: 5, top: 57, left: 67.3, type: 'challenge' },
    { stageIndex: 6, top: 53.5, left: 73.8, type: 'challenge' },
    { stageIndex: 7, top: 50.9, left: 67.6, type: 'world-boss' },
  ] },
  // World 2: Mystic Meadows
  { image: '/assets/maps/tier maps/mystic meadow.png', calibrating: false, nodes: [
    { stageIndex: 0, top: 87.8, left: 27.7, type: 'practice' },
    { stageIndex: 1, top: 72, left: 37, type: 'practice' },
    { stageIndex: 2, top: 65.8, left: 50.1, type: 'challenge' },
    { stageIndex: 3, top: 62.4, left: 60.3, type: 'challenge' },
    { stageIndex: 4, top: 59.1, left: 62.9, type: 'mini-boss' },
    { stageIndex: 5, top: 57, left: 70.5, type: 'challenge' },
    { stageIndex: 6, top: 53.6, left: 77.2, type: 'challenge' },
    { stageIndex: 7, top: 49.7, left: 79.7, type: 'world-boss' },
  ] },
  // World 3: Ironforge Mountains
  { image: '/assets/maps/tier maps/molten forge.png', calibrating: false, nodes: [
    { stageIndex: 0, top: 91.2, left: 27.1, type: 'practice' },
    { stageIndex: 1, top: 72.4, left: 34.9, type: 'practice' },
    { stageIndex: 2, top: 64.5, left: 48.2, type: 'challenge' },
    { stageIndex: 3, top: 60.8, left: 56.5, type: 'challenge' },
    { stageIndex: 4, top: 57.3, left: 64.5, type: 'mini-boss' },
    { stageIndex: 5, top: 54.9, left: 71.3, type: 'challenge' },
    { stageIndex: 6, top: 53.2, left: 76.8, type: 'challenge' },
    { stageIndex: 7, top: 51.3, left: 81, type: 'world-boss' },
  ] },
  // World 4: Shadow Swamp
  { image: '/assets/maps/tier maps/shadow swamp.png', calibrating: false, nodes: [
    { stageIndex: 0, top: 90, left: 26.2, type: 'practice' },
    { stageIndex: 1, top: 68.4, left: 35.4, type: 'practice' },
    { stageIndex: 2, top: 58.4, left: 47.2, type: 'challenge' },
    { stageIndex: 3, top: 53.5, left: 55.1, type: 'challenge' },
    { stageIndex: 4, top: 48.1, left: 59.9, type: 'mini-boss' },
    { stageIndex: 5, top: 44, left: 58.2, type: 'challenge' },
    { stageIndex: 6, top: 42.2, left: 55.7, type: 'challenge' },
    { stageIndex: 7, top: 40.9, left: 53.2, type: 'world-boss' },
  ] },
  // World 5: Enchanted Ruins
  { image: '/assets/maps/tier maps/enchanted ruins.png', calibrating: false, nodes: [
    { stageIndex: 0, top: 90.9, left: 26.1, type: 'practice' },
    { stageIndex: 1, top: 75.5, left: 31.5, type: 'practice' },
    { stageIndex: 2, top: 67.1, left: 43.6, type: 'challenge' },
    { stageIndex: 3, top: 62.7, left: 52.1, type: 'challenge' },
    { stageIndex: 4, top: 58.4, left: 60.6, type: 'mini-boss' },
    { stageIndex: 5, top: 55, left: 67.4, type: 'challenge' },
    { stageIndex: 6, top: 51.9, left: 73.8, type: 'challenge' },
    { stageIndex: 7, top: 46.6, left: 78.6, type: 'world-boss' },
  ] },
  // World 6: Sky Citadel
  { image: '/assets/maps/tier maps/sky citadel.png', calibrating: false, nodes: [
    { stageIndex: 0, top: 86.7, left: 30.2, type: 'practice' },
    { stageIndex: 1, top: 64.3, left: 36.3, type: 'practice' },
    { stageIndex: 2, top: 52.7, left: 44.4, type: 'challenge' },
    { stageIndex: 3, top: 47.9, left: 53, type: 'challenge' },
    { stageIndex: 4, top: 45.4, left: 60, type: 'mini-boss' },
    { stageIndex: 5, top: 44.3, left: 66.9, type: 'challenge' },
    { stageIndex: 6, top: 42.4, left: 74.4, type: 'challenge' },
    { stageIndex: 7, top: 38.2, left: 75.6, type: 'world-boss' },
  ] },
  // World 7: Dragon's Peak
  { image: '/assets/maps/tier maps/dragons peak.png', calibrating: false, nodes: [
    { stageIndex: 0, top: 87.5, left: 29.3, type: 'practice' },
    { stageIndex: 1, top: 75.4, left: 38.3, type: 'practice' },
    { stageIndex: 2, top: 60.5, left: 23.6, type: 'challenge' },
    { stageIndex: 3, top: 47, left: 38.5, type: 'challenge' },
    { stageIndex: 4, top: 39.6, left: 27.9, type: 'mini-boss' },
    { stageIndex: 5, top: 34.2, left: 39.3, type: 'challenge' },
    { stageIndex: 6, top: 30.9, left: 31.9, type: 'challenge' },
    { stageIndex: 7, top: 27.6, left: 36.2, type: 'world-boss' },
  ] },
];

export const OVERWORLD_MAP_IMAGE = '/assets/maps/world maps/overworld_map.jpg';
