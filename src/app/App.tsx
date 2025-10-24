import { useKeyboardInput } from "@app/input";
import { useGameLoop } from "@app/loop";
import { TopDownCanvas } from "@render/TopDownCanvas";
import { Perception1DCanvas } from "@render/Perception1DCanvas";
import { DialoguePane } from "@ui/DialoguePane";
import { HUD } from "@ui/HUD";
import { useGameStore } from "@app/store";

export default function App(): JSX.Element {
  useKeyboardInput();
  useGameLoop();
  const lost = useGameStore((state) => state.lost);

  return (
    <div className="app-shell">
      <DialoguePane />
      <main className="main-stage">
        <div className="canvas-wrapper">
          <TopDownCanvas />
          <Perception1DCanvas />
        </div>
        <HUD />
        {lost ? <div className="lose-banner">Shape collapsed. Press T to seek guidance.</div> : null}
      </main>
    </div>
  );
}
