import { useEffect, useRef } from "react";
import { useGameStore } from "@app/store";
import { getPlayer, listEntities, WorldState } from "@app/world";
import { drawEntity, clearCanvas } from "@render/draw";
import { Vec2 } from "@geom/vec2";

const SCALE = 40;

export function TopDownCanvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const unsubscribe = useGameStore.subscribe(
      (state) => ({ world: state.world, expert: state.expertMode }),
      ({ world, expert }) => {
        if (expert) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }
        drawWorld(ctx, world, canvas.width / dpr, canvas.height / dpr);
      },
    );

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, []);

  return <canvas ref={canvasRef} className="top-down-canvas" />;
}

function drawWorld(ctx: CanvasRenderingContext2D, world: WorldState, width: number, height: number): void {
  clearCanvas(ctx, width, height);
  const player = getPlayer(world);
  const center = player.transform.position;
  const toScreen = (v: Vec2): Vec2 => new Vec2(width / 2 + (v.x - center.x) * SCALE, height / 2 + (v.y - center.y) * SCALE);

  for (const entity of listEntities(world)) {
    if (!entity.polygon) continue;
    const screenVerts = entity.polygon.vertices.map((v) => toScreen(v));
    drawEntity(ctx, { ...entity, polygon: { ...entity.polygon, vertices: screenVerts } });
  }
}
