import { CompassN } from "@ui/CompassN";
import { ExpertToggle } from "@ui/ExpertToggle";
import { SideMeter } from "@ui/SideMeter";

export function HUD(): JSX.Element {
  return (
    <div className="hud">
      <SideMeter />
      <CompassN />
      <ExpertToggle />
    </div>
  );
}
