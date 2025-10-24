import { useEffect, useState } from "react";
import { useGameStore } from "../app/store";
import "./ui.css";

export function CompassN() {
  const rotation = useGameStore((state) => state.level.world.transforms.get(state.level.player)?.rotation ?? 0);
  const [displayRotation, setDisplayRotation] = useState(rotation);

  useEffect(() => {
    setDisplayRotation(rotation);
  }, [rotation]);

  const angleDeg = ((displayRotation * 180) / Math.PI + 360) % 360;

  return (
    <div className="compass">
      <div className="compass-rose" style={{ transform: `rotate(${angleDeg}deg)` }}>
        <span>N</span>
      </div>
      <span className="compass-angle">{angleDeg.toFixed(0)}°</span>
    </div>
  );
}
