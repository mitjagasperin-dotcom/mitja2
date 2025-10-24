import { buildRegularPolygon } from "../geom/polygon";
import { Vec2 } from "../geom/vec2";
import { useGameStore } from "../app/store";
import { WORLD_SCALE } from "../app/constants";
import "./ui.css";

export function SideMeter() {
  const sides = useGameStore((state) => state.playerSides);
  const lose = useGameStore((state) => state.lose);
  const polygon = buildRegularPolygon({ n: Math.max(3, sides), center: Vec2.zero(), radius: 1, rotation: 0 });
  const path = polygon
    .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x * WORLD_SCALE * 0.2} ${p.y * WORLD_SCALE * 0.2}`)
    .join(" ");
  const status = lose ? "Critical" : "Stable";
  return (
    <div className="side-meter">
      <svg viewBox="-30 -30 60 60" className="side-meter-glyph">
        <path d={`${path} Z`} fill="rgba(220,220,220,0.9)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
      </svg>
      <div className="side-meter-text">
        <span className="side-meter-label">Sides</span>
        <span className="side-meter-value">{sides}</span>
        <span className="side-meter-status">{status}</span>
      </div>
    </div>
  );
}
