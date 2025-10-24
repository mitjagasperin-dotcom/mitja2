import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../app/store';
import { drawWorld } from './draw';
import { applyGlow } from './glow';

function useResize(ref: React.RefObject<HTMLCanvasElement>) {
  const [size, setSize] = useState({ width: 640, height: 360 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export default function TopDownCanvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const expertMode = useGameStore((state) => state.expertMode);
  const time = useGameStore((state) => state.world.time);
  const size = useResize(canvasRef);

  useEffect(() => {
    if (expertMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { world } = useGameStore.getState();
    drawWorld(ctx, world, canvas.width, canvas.height);
    applyGlow(ctx, canvas);
  }, [expertMode, time, size.width, size.height]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: expertMode ? 'none' : 'block' }} />;
}
