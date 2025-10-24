import { useEffect, useRef } from "react";
import { useGameStore } from "../app/store";
import { WORLD_SCALE } from "../app/constants";
import { fogGradient } from "./fog";
import "../ui/ui.css";

function worldToScreen(x: number, y: number, width: number, height: number) {
  return {
    x: width / 2 + x * WORLD_SCALE,
    y: height / 2 + y * WORLD_SCALE
  };
}

export function TopDownCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const polygons = useGameStore((state) => state.polygons);
  const houses = useGameStore((state) => state.houses);
  const lines = useGameStore((state) => state.lines);
  const expertMode = useGameStore((state) => state.expertMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio ?? 1;
    const width = rect.width * dpr;
    const height = rect.height * dpr;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "#111216";
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = fogGradient(ctx, rect.width, rect.height);
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.lineWidth = 1;
    ctx.lineJoin = "round";

    for (const house of houses) {
      ctx.beginPath();
      const first = worldToScreen(house.points[0].x, house.points[0].y, rect.width, rect.height);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < house.points.length; i += 1) {
        const pt = worldToScreen(house.points[i].x, house.points[i].y, rect.width, rect.height);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(50, 50, 54, 0.6)";
      ctx.strokeStyle = "rgba(200, 200, 210, 0.35)";
      ctx.fill("evenodd");
      ctx.stroke();
      const radius = Math.hypot(house.points[0].x - house.center.x, house.points[0].y - house.center.y);
      for (const door of house.doors) {
        const doorAngle = door.angle + house.rotation;
        const inner = worldToScreen(
          house.center.x + Math.cos(doorAngle) * (radius - 0.1),
          house.center.y + Math.sin(doorAngle) * (radius - 0.1),
          rect.width,
          rect.height
        );
        const outer = worldToScreen(
          house.center.x + Math.cos(doorAngle) * (radius + 0.4),
          house.center.y + Math.sin(doorAngle) * (radius + 0.4),
          rect.width,
          rect.height
        );
        ctx.strokeStyle = "rgba(220, 220, 220, 0.25)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(inner.x, inner.y);
        ctx.lineTo(outer.x, outer.y);
        ctx.stroke();
      }
    }

    for (const polygon of polygons) {
      ctx.beginPath();
      const first = worldToScreen(polygon.points[0].x, polygon.points[0].y, rect.width, rect.height);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < polygon.points.length; i += 1) {
        const pt = worldToScreen(polygon.points[i].x, polygon.points[i].y, rect.width, rect.height);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fillStyle = polygon.fill;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.fill();
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(190, 190, 190, 0.3)";
    ctx.lineWidth = 2;
    for (const line of lines) {
      const a = worldToScreen(line.a.x, line.a.y, rect.width, rect.height);
      const b = worldToScreen(line.b.x, line.b.y, rect.width, rect.height);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    ctx.restore();
  }, [polygons, houses, lines]);

  if (expertMode) {
    return <div className="topdown-hidden">Expert mode hides top-down view.</div>;
  }

  return <canvas ref={canvasRef} className="topdown-canvas" />;
}
