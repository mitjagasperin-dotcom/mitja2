import { useEffect, useRef } from "react";
import { useGameStore } from "../app/store";
import { STRIP_HEIGHT } from "../app/constants";
import "../ui/ui.css";

export function Perception1DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const perception = useGameStore((state) => state.perception);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
    const height = STRIP_HEIGHT;
    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    if (perception.length === 0) {
      ctx.fillStyle = "#1a1b1f";
      ctx.fillRect(0, 0, width, height);
    } else {
      for (let i = 0; i < perception.length; i += 1) {
        const intensity = perception[i]?.intensity ?? 0;
        const shade = Math.floor(30 + 200 * intensity);
        const columnWidth = width / perception.length;
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        ctx.fillRect(i * columnWidth, 0, columnWidth + 1, height);
      }
    }
    ctx.restore();
  }, [perception]);

  return <canvas ref={canvasRef} className="perception-strip" />;
}
