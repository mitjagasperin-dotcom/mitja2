import { Vec2 } from "../geom/vec2";

export interface DrawPolygonOptions {
  fillStyle: string;
  strokeStyle?: string;
  lineWidth?: number;
}

export function drawPolygon(ctx: CanvasRenderingContext2D, points: Vec2[], options: DrawPolygonOptions): void {
  if (points.length === 0) return;
  const { fillStyle, strokeStyle, lineWidth = 1 } = options;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

export function drawPolygonOutline(ctx: CanvasRenderingContext2D, points: Vec2[], strokeStyle: string, lineWidth = 1): void {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

export function drawLine(ctx: CanvasRenderingContext2D, a: Vec2, b: Vec2, strokeStyle: string, lineWidth = 1): void {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}
