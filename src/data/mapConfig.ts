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
 *   4. Set calibrating: false
 */
export const ZONE_MAPS: (ZoneMapConfig | null)[] = [
  // World 0: Emerald Forest — no zone map yet (will use fallback list)
  null,
  // World 1: Crystal Caves
  null,
  // World 2: Mystic Meadows
  null,
  // World 3: Ironforge Mountains
  null,
  // World 4: Shadow Swamp
  null,
  // World 5: Enchanted Ruins
  null,
  // World 6: Sky Citadel
  null,
  // World 7: Dragon's Peak
  null,
];

export const OVERWORLD_MAP_IMAGE = '/assets/maps/world maps/overworld_map.jpg';
