import { useState, useRef } from 'react';

interface CalibrationOverlayProps {
  labels: string[];
  worldIndex: number;
  worldName: string;
  stages: { type: string }[];
}

/**
 * Dev-only calibration overlay for zone maps.
 * Renders numbered click points and logs final coordinates to the console.
 */
export function CalibrationOverlay({
  labels,
  worldIndex,
  worldName,
  stages,
}: CalibrationOverlayProps) {
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState<{ top: number; left: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (step >= labels.length) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const left = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const top = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    const point = { top, left };
    const newPoints = [...points, point];
    setPoints(newPoints);
    console.log(`${labels[step]} → top: ${top}%, left: ${left}%`);
    const next = step + 1;
    setStep(next);
    if (next === labels.length) {
      console.log(`\n✅ ZONE ${worldIndex} CALIBRATION COMPLETE:\n`);
      console.log(`// World ${worldIndex}: ${worldName}`);
      console.log('nodes: [');
      newPoints.forEach((p, i) => {
        console.log(`  { stageIndex: ${i}, top: ${p.top}, left: ${p.left}, type: '${stages[i].type}' },`);
      });
      console.log('],');
    }
  };

  return (
    <>
      {/* Click target (invisible, covers the map image) */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-40 cursor-crosshair"
        onClick={handleClick}
      />

      {/* Instruction banner */}
      {step < labels.length && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/85 text-yellow-300 text-sm font-bold px-4 py-2 rounded-lg z-50 pointer-events-none whitespace-nowrap">
          {labels[step]} ({step + 1}/{labels.length})
        </div>
      )}
      {step >= labels.length && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/85 text-green-400 text-sm font-bold px-4 py-2 rounded-lg z-50 pointer-events-none">
          ✅ Done! Check console for coordinates.
        </div>
      )}

      {/* Placed dots */}
      {points.map((pt, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          style={{ top: `${pt.top}%`, left: `${pt.left}%` }}
        >
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-white bg-black/70 px-1 rounded font-mono">
            {i + 1}
          </span>
        </div>
      ))}
    </>
  );
}
