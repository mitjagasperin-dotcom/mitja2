import { useEffect } from "react";
import { FIXED_DT } from "@app/constants";
import { useGameStore } from "@app/store";

export function useGameLoop(): void {
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    let animationFrame = 0;
    let lastTime = performance.now();
    let accumulator = 0;

    const step = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      accumulator += delta;
      while (accumulator >= FIXED_DT) {
        tick(FIXED_DT);
        accumulator -= FIXED_DT;
      }
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [tick]);
}
