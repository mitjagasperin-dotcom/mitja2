import { useGameStore } from '../app/store';

export default function CompassN(): JSX.Element {
  const rotation = useGameStore((state) => state.world.entities.find((e) => e.id === state.world.playerId)?.transform.rotation ?? 0);
  const deg = Math.round((rotation * 180) / Math.PI) % 360;
  return (
    <div className="compass-n" aria-label="Compass">
      <div className="compass-n__needle" style={{ transform: `rotate(${deg}deg)` }} />
      <span className="compass-n__label">N</span>
    </div>
  );
}
