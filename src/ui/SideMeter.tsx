import { useGameStore } from '../app/store';

export default function SideMeter(): JSX.Element {
  const sides = useGameStore((state) => state.playerSides);
  return (
    <div className="side-meter">
      <div className="side-meter__icon">n={sides}</div>
      <div className="side-meter__label">Sides</div>
    </div>
  );
}
