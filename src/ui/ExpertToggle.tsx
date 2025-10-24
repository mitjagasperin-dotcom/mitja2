import { useGameStore } from "@app/store";

export function ExpertToggle(): JSX.Element {
  const expert = useGameStore((state) => state.expertMode);
  const toggle = useGameStore((state) => state.toggleExpert);
  return (
    <button className="expert-toggle" onClick={toggle} title="Hide Top-Down view; puzzles advance progression">
      Expert Mode: {expert ? "On" : "Off"}
    </button>
  );
}
