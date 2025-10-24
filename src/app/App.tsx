import { useEffect } from "react";
import { DialoguePane } from "../ui/DialoguePane";
import { HUD } from "../ui/HUD";
import { TopDownCanvas } from "../render/TopDownCanvas";
import { Perception1DCanvas } from "../render/Perception1DCanvas";
import { attachInputListeners } from "./input";
import { startGameLoop, stopGameLoop } from "./loop";

export default function App() {
  useEffect(() => {
    const detach = attachInputListeners();
    startGameLoop();
    return () => {
      detach();
      stopGameLoop();
    };
  }, []);

  return (
    <div className="app-root">
      <DialoguePane />
      <section className="main-panel">
        <div className="topdown-wrapper">
          <TopDownCanvas />
        </div>
        <div className="perception-wrapper">
          <Perception1DCanvas />
        </div>
      </section>
      <HUD />
    </div>
  );
}
