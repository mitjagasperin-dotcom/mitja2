import { useGameStore } from "../app/store";
import "./ui.css";

export function ExpertToggle() {
  const expertMode = useGameStore((state) => state.expertMode);
  const toggle = useGameStore((state) => state.toggleExpert);
  return (
    <button className="expert-toggle" onClick={() => toggle()}>
      {expertMode ? "Expert View" : "Standard View"}
    </button>
  );
}
