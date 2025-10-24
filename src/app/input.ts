import { useGameStore } from "./store";
import { ENTER_ROOM_KEY, EXPERT_KEY, TALK_KEY } from "./constants";

const MOVEMENT_KEYS = new Set(["w", "a", "s", "d", "q", "e"]);

export function attachInputListeners(): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (MOVEMENT_KEYS.has(key)) {
      event.preventDefault();
      useGameStore.getState().setInput(key, true);
    }
    if (key === TALK_KEY) {
      event.preventDefault();
      useGameStore.getState().requestTalk();
    }
    if (key === EXPERT_KEY) {
      event.preventDefault();
      useGameStore.getState().toggleExpert();
    }
    if (key === ENTER_ROOM_KEY) {
      event.preventDefault();
      useGameStore.getState().requestRoomInteraction();
    }
    if (["1", "2", "3", "4"].includes(key)) {
      event.preventDefault();
      const index = Number(key) - 1;
      const state = useGameStore.getState();
      if (state.dialogue) {
        state.advanceDialogue(index);
      } else if (state.puzzle && !state.puzzle.resolved) {
        state.answerPuzzle(index);
      }
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (MOVEMENT_KEYS.has(key)) {
      event.preventDefault();
      useGameStore.getState().setInput(key, false);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}
