import { useEffect, useRef, useState } from 'react';
import { PERCEPTION_HEIGHT } from '../app/constants';
import { useGameStore } from '../app/store';
import { fogToGray } from './fog';

export default function Perception1DCanvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const perception = useGameStore((state) => state.perception);
  const setColumns = useGameStore((state) => state.setPerceptionColumns);
  const [width, setWidth] = useState(640);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      setWidth(Math.max(1, Math.floor(rect.width)));
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setColumns(width);
  }, [width, setColumns]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = PERCEPTION_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    for (let x = 0; x < width; x += 1) {
      const index = Math.floor((x / width) * perception.length);
      const intensity = perception[Math.min(index, perception.length - 1)] ?? 0;
      ctx.fillStyle = fogToGray(intensity);
      ctx.fillRect(x, 0, 1, PERCEPTION_HEIGHT);
    }
  }, [perception, width]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: `${PERCEPTION_HEIGHT}px` }} />;
}
