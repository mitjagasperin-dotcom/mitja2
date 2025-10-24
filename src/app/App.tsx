import { useEffect } from 'react';
import { startGameLoop } from './loop';
import { useKeyboardInput } from './input';
import TopDownCanvas from '../render/TopDownCanvas';
import Perception1DCanvas from '../render/Perception1DCanvas';
import HUD from '../ui/HUD';
import DialoguePane from '../ui/DialoguePane';

export default function App(): JSX.Element {
  useEffect(() => {
    startGameLoop();
  }, []);
  useKeyboardInput();

  return (
    <div className="app-shell">
      <div className="app-shell__left">
        <DialoguePane />
      </div>
      <div className="app-shell__main">
        <div className="app-shell__top">
          <TopDownCanvas />
        </div>
        <div className="app-shell__perception">
          <Perception1DCanvas />
        </div>
        <HUD />
      </div>
    </div>
  );
}
