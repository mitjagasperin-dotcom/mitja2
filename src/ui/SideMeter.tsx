import { useGameStore } from "@app/store";

export function SideMeter(): JSX.Element {
  const sides = useGameStore((state) => state.world.entities.get(state.world.playerId)?.sideCounter?.sides ?? 0);
  return (
    <div className="side-meter">
      <div className="side-meter-icon">{sides}</div>
      <div className="side-meter-label">Sides</div>
    </div>
  );
}
