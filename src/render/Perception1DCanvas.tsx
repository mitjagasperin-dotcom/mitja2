import { useEffect, useRef } from "react";
import { useGameStore } from "@app/store";
import { STRIP_HEIGHT } from "@app/constants";

export function Perception1DCanvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const perception = useGameStore((state) => state.perception);
  const setWidth = useGameStore((state) => state.setPerceptionWidth);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = STRIP_HEIGHT * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setWidth(rect.width);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [setWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, width, STRIP_HEIGHT);
    const columnWidth = width / Math.max(1, perception.length);
    perception.forEach((col, index) => {
      const value = Math.floor(col.intensity * 255);
      const edge = Math.floor(col.vertexCue * 50);
      const tone = Math.min(255, value + edge);
      ctx.fillStyle = `rgb(${tone}, ${tone}, ${tone})`;
      ctx.fillRect(index * columnWidth, 0, columnWidth + 1, STRIP_HEIGHT);
    });
  }, [perception]);

  return <canvas ref={canvasRef} className="perception-canvas" style={{ height: STRIP_HEIGHT }} />;
}
