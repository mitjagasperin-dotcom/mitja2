import { SIMULATION_DT } from './constants';
import { fixedTick } from './store';

let running = false;
let accumulator = 0;
let lastTimestamp = 0;

function frame(timestamp: number) {
  if (!running) return;
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }
  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;
  accumulator += delta;

  while (accumulator >= SIMULATION_DT) {
    fixedTick();
    accumulator -= SIMULATION_DT;
  }

  requestAnimationFrame(frame);
}

export function startGameLoop(): void {
  if (running) return;
  running = true;
  lastTimestamp = performance.now();
  accumulator = 0;
  requestAnimationFrame(frame);
}

export function stopGameLoop(): void {
  running = false;
  accumulator = 0;
  lastTimestamp = 0;
}
