import SideMeter from './SideMeter';
import ExpertToggle from './ExpertToggle';
import CompassN from './CompassN';

export default function HUD(): JSX.Element {
  return (
    <div className="hud">
      <SideMeter />
      <ExpertToggle />
      <CompassN />
    </div>
  );
}
