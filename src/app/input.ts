import { useEffect } from "react";
import { useGameStore } from "./store";
import { clamp } from "@utils/math";

function isInteractiveElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function useKeyboardInput(): void {
  const setInput = useGameStore((state) => state.setInput);
  const toggleExpert = useGameStore((state) => state.toggleExpert);
  const resetTalk = useGameStore((state) => state.resetTalk);

  useEffect(() => {
    const pressed = new Set<string>();

    const updateAxes = () => {
      const forward = (pressed.has("KeyW") ? 1 : 0) + (pressed.has("KeyS") ? -1 : 0);
      const right = (pressed.has("KeyD") ? 1 : 0) + (pressed.has("KeyA") ? -1 : 0);
      const rotation = (pressed.has("KeyE") ? 1 : 0) + (pressed.has("KeyQ") ? -1 : 0);
      setInput({
        forward: clamp(forward, -1, 1),
        right: clamp(right, -1, 1),
        rotation: clamp(rotation, -1, 1),
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveElement(event.target)) return;
      if (event.repeat) return;
      switch (event.code) {
        case "KeyX":
          toggleExpert();
          break;
        case "KeyT":
          setInput({ talk: true });
          break;
        case "Escape":
          resetTalk();
          break;
        default:
          pressed.add(event.code);
          updateAxes();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (pressed.delete(event.code)) {
        updateAxes();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      pressed.clear();
    };
  }, [resetTalk, setInput, toggleExpert]);
}
