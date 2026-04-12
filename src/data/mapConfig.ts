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

export const OVERWORLD_MAP_IMAGE = '/assets/maps/world maps/overworld_map.jpg';
