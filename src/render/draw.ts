import { MAX_FOG_DISTANCE, WORLD_BACKGROUND } from "@app/constants";
import { fogColor } from "@render/fog";
import { Entity } from "@ecs/types";
import { Vec2 } from "@geom/vec2";

export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = WORLD_BACKGROUND;
  ctx.fillRect(0, 0, width, height);
}

export function drawPolygon(ctx: CanvasRenderingContext2D, vertices: Vec2[], stroke = "#bbb", fill = "rgba(200,200,200,0.2)"): void {
  if (vertices.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i += 1) {
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 0.05;
  ctx.fill();
  ctx.stroke();
}

export function drawEntity(ctx: CanvasRenderingContext2D, entity: Entity): void {
  if (!entity.polygon) return;
  drawPolygon(ctx, entity.polygon.vertices);
}

export function drawFoggedBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, fogColor(0));
  gradient.addColorStop(1, fogColor(MAX_FOG_DISTANCE));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
