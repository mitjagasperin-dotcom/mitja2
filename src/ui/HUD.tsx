import { ExpertToggle } from "./ExpertToggle";
import { SideMeter } from "./SideMeter";
import { CompassN } from "./CompassN";
import { useGameStore } from "../app/store";
import "./ui.css";

export function HUD() {
  const currentRoom = useGameStore((state) => state.currentRoom);
  const puzzle = useGameStore((state) => state.puzzle);
  const expertMode = useGameStore((state) => state.expertMode);
  return (
    <div className="hud">
      <SideMeter />
      <CompassN />
      <ExpertToggle />
      <div className="hud-status">
        <span className="hud-room">{currentRoom ? `Room: ${currentRoom}` : "Exterior"}</span>
        <span className="hud-mode">{expertMode ? "Expert progression enabled" : "Explore freely"}</span>
        {puzzle && (
          <span className="hud-puzzle-status">{puzzle.resolved ? "Puzzle resolved" : "Puzzle active"}</span>
        )}
      </div>
    </div>
  );
}
