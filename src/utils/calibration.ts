/**
 * Map Calibration Tool
 *
 * Usage (dev mode only):
 *   1. Import and call `startCalibration()` from the browser console
 *   2. Or: temporarily set CALIBRATION_ENABLED = true and rebuild
 *
 * Overworld calibration (13 clicks):
 *   - 4 image corners (top-left, top-right, bottom-left, bottom-right)
 *   - 8 world locations in order
 *   - 1 shop location
 *
 * Zone calibration (8 clicks):
 *   - 8 stage locations in order
 *
 * The tool logs percentage coordinates to the console as you click,
 * and outputs a ready-to-paste config block when finished.
 *
 * To use:
 *   1. Add `onClick={handleCalibrationClick}` to the map container div
 *   2. Add the calibration state from this file
 *   3. After calibrating, paste the output into mapConfig.ts
 *   4. Remove the onClick handler
 */

// ── Overworld Calibration ───────────────────────────────────────────

export const OVERWORLD_CALIBRATION_LABELS = [
  '📍 Click TOP-LEFT corner of the image',
  '📍 Click TOP-RIGHT corner of the image',
  '📍 Click BOTTOM-LEFT corner of the image',
  '📍 Click BOTTOM-RIGHT corner of the image',
  '📍 Click location 1: Emerald Forest',
  '📍 Click location 2: Crystal Caves',
  '📍 Click location 3: Mystic Meadows',
  '📍 Click location 4: Ironforge Mountains',
  '📍 Click location 5: Shadow Swamp',
  '📍 Click location 6: Enchanted Ruins',
  '📍 Click location 7: Sky Citadel',
  "📍 Click location 8: Dragon's Peak",
  '🛒 Click location 9: Shop (forest clearing)',
];

export const WORLD_NAMES = [
  'Emerald Forest',
  'Crystal Caves',
  'Mystic Meadows',
  'Ironforge Mountains',
  'Shadow Swamp',
  'Enchanted Ruins',
  'Sky Citadel',
  "Dragon's Peak",
];

export function processOverworldCalibration(
  points: { top: number; left: number }[],
): void {
  console.log('\n✅ OVERWORLD CALIBRATION COMPLETE — Copy into mapConfig.ts:\n');
  console.log('Corners:', JSON.stringify(points.slice(0, 4), null, 2));
  const locations = points.slice(4, 12);
  const shopPoint = points[12];
  console.log('\nexport const OVERWORLD_NODES: MapNode[] = [');
  locations.forEach((p, i) => {
    console.log(
      `  { worldIndex: ${i}, name: '${WORLD_NAMES[i]}', top: ${p.top}, left: ${p.left} },`,
    );
  });
  console.log('];');
  console.log(
    `\nexport const SHOP_NODE = { name: 'Shop', top: ${shopPoint.top}, left: ${shopPoint.left} };`,
  );
}

// ── Zone Calibration ────────────────────────────────────────────────

export function getZoneCalibrationLabels(
  stages: { type: string }[],
): string[] {
  return stages.map((s, i) => {
    if (s.type === 'mini-boss') return `📍 Click Mini-Boss (stage ${i + 1})`;
    if (s.type === 'world-boss') return `📍 Click World Boss (stage ${i + 1})`;
    return `📍 Click Stage ${i + 1}`;
  });
}

export function processZoneCalibration(
  worldIndex: number,
  worldName: string,
  points: { top: number; left: number }[],
  stages: { type: string }[],
): void {
  console.log(`\n✅ ZONE ${worldIndex} CALIBRATION COMPLETE:\n`);
  console.log(`// World ${worldIndex}: ${worldName}`);
  console.log('nodes: [');
  points.forEach((p, i) => {
    console.log(
      `  { stageIndex: ${i}, top: ${p.top}, left: ${p.left}, type: '${stages[i].type}' },`,
    );
  });
  console.log('],');
}

// ── Shared click handler helper ─────────────────────────────────────

export function getClickPercent(
  e: React.MouseEvent,
  containerRef: React.RefObject<HTMLDivElement | null>,
): { top: number; left: number } | null {
  const rect = containerRef.current?.getBoundingClientRect();
  if (!rect) return null;
  const left = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
  const top = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
  return { top, left };
}
