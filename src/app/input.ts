import { useEffect } from 'react';
import { useGameStore } from './store';

const keyBindings: Record<string, keyof ReturnType<typeof useGameStore.getState>['input']> = {
  KeyW: 'moveForward',
  KeyS: 'moveBackward',
  KeyA: 'moveLeft',
  KeyD: 'moveRight',
  KeyQ: 'rotateLeft',
  KeyE: 'rotateRight',
};

export function useKeyboardInput(): void {
  const setInput = useGameStore((state) => state.setInput);
  const attemptTalk = useGameStore((state) => state.attemptTalk);
  const toggleExpertMode = useGameStore((state) => state.toggleExpertMode);
  const chooseDialogue = useGameStore((state) => state.chooseDialogue);
  const closeDialogue = useGameStore((state) => state.closeDialogue);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code === 'KeyT') {
        attemptTalk();
        return;
      }
      if (event.code === 'KeyX') {
        toggleExpertMode();
        return;
      }
      if (event.code.startsWith('Digit')) {
        const index = Number(event.code.slice(5)) - 1;
        if (index >= 0) {
          chooseDialogue(index);
          return;
        }
      }
      if (event.code === 'Escape') {
        closeDialogue();
        return;
      }
      const action = keyBindings[event.code];
      if (action) {
        event.preventDefault();
        setInput((prev) => ({ ...prev, [action]: true }));
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      const action = keyBindings[event.code];
      if (action) {
        setInput((prev) => ({ ...prev, [action]: false }));
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [setInput, attemptTalk, toggleExpertMode, chooseDialogue, closeDialogue]);
}
