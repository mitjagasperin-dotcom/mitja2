import { Vec2 } from "./vec2";
import { Segment } from "./vec2";

export type AnalyticShape =
  | { type: "segment"; from: [number, number]; to: [number, number] }
  | { type: "circle"; center: [number, number]; radius: number; segments?: number }
  | { type: "ellipse"; center: [number, number]; radiusX: number; radiusY: number; segments?: number }
  | { type: "parabola"; origin: [number, number]; a: number; h: number; k: number; span: number; segments?: number }
  | { type: "parametric"; equation: "lemniscate" | "astroid" | "cardioid"; center: [number, number]; scale: number; segments?: number };

export function tessellateAnalyticShapes(shapes: AnalyticShape[]): Segment[] {
  const segments: Segment[] = [];
  for (const shape of shapes) {
    switch (shape.type) {
      case "segment": {
        segments.push({
          a: new Vec2(shape.from[0], shape.from[1]),
          b: new Vec2(shape.to[0], shape.to[1]),
        });
        break;
      }
      case "circle": {
        const count = shape.segments ?? 48;
        const { center, radius } = shape;
        pushLoopSegments(segments, count, (i) => {
          const angle = (i / count) * Math.PI * 2;
          return new Vec2(center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle));
        });
        break;
      }
      case "ellipse": {
        const count = shape.segments ?? 64;
        const { center, radiusX, radiusY } = shape;
        pushLoopSegments(segments, count, (i) => {
          const angle = (i / count) * Math.PI * 2;
          return new Vec2(center[0] + radiusX * Math.cos(angle), center[1] + radiusY * Math.sin(angle));
        });
        break;
      }
      case "parabola": {
        const count = shape.segments ?? 48;
        const { origin, a, h, k, span } = shape;
        let prev: Vec2 | null = null;
        for (let i = 0; i <= count; i += 1) {
          const x = origin[0] - span / 2 + (span * i) / count;
          const y = origin[1] + a * (x - h) * (x - h) + k;
          const point = new Vec2(x, y);
          if (prev) {
            segments.push({ a: prev, b: point });
          }
          prev = point;
        }
        break;
      }
      case "parametric": {
        const count = shape.segments ?? 72;
        const { center, scale, equation } = shape;
        pushLoopSegments(segments, count, (i) => {
          const t = (i / count) * Math.PI * 2;
          switch (equation) {
            case "lemniscate": {
              const denom = 1 + Math.sin(t) * Math.sin(t);
              const r = Math.sqrt(2) * scale * Math.cos(t) / denom;
              return new Vec2(center[0] + r * Math.cos(t), center[1] + r * Math.sin(t));
            }
            case "astroid": {
              return new Vec2(center[0] + scale * Math.pow(Math.cos(t), 3), center[1] + scale * Math.pow(Math.sin(t), 3));
            }
            case "cardioid": {
              const r = scale * (1 - Math.sin(t));
              return new Vec2(center[0] + r * Math.cos(t), center[1] + r * Math.sin(t));
            }
            default:
              return new Vec2(center[0], center[1]);
          }
        });
        break;
      }
      default:
        break;
    }
  }
  return segments;
}

function pushLoopSegments(segments: Segment[], count: number, pointFn: (index: number) => Vec2) {
  let prev = pointFn(0);
  for (let i = 1; i <= count; i += 1) {
    const point = i === count ? pointFn(0) : pointFn(i);
    segments.push({ a: prev, b: point });
    prev = point;
  }
}
