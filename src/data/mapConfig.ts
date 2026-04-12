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
  { worldIndex: 0, name: 'Emerald Forest',      top: 74, left: 13 },
  { worldIndex: 1, name: 'Crystal Caves',       top: 76, left: 36 },
  { worldIndex: 2, name: 'Mystic Meadows',      top: 40, left: 18 },
  { worldIndex: 3, name: 'Ironforge Mountains',  top: 19, left: 42 },
  { worldIndex: 4, name: 'Shadow Swamp',        top: 55, left: 56 },
  { worldIndex: 5, name: 'Enchanted Ruins',     top: 70, left: 84 },
  { worldIndex: 6, name: 'Sky Citadel',         top: 13, left: 64 },
  { worldIndex: 7, name: "Dragon's Peak",       top: 10, left: 92 },
];

export const OVERWORLD_MAP_IMAGE = '/assets/maps/world maps/overworld_map.jpg';
