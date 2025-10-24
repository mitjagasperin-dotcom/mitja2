import { Vec2, Segment } from "./vec2";

export type AnalyticShape =
  | { type: "segment"; from: [number, number]; to: [number, number] }
  | { type: "circle"; center: [number, number]; radius: number; samples?: number }
  | { type: "ellipse"; center: [number, number]; radiusX: number; radiusY: number; samples?: number }
  | { type: "parabola"; origin: [number, number]; a: number; width: number; height: number; samples?: number }
  | { type: "parametric"; expr: (t: number) => [number, number]; start: number; end: number; samples: number };

export function tessellateAnalyticShapes(shapes: AnalyticShape[]): Segment[] {
  const segments: Segment[] = [];
  for (const shape of shapes) {
    switch (shape.type) {
      case "segment": {
        const a = new Vec2(shape.from[0], shape.from[1]);
        const b = new Vec2(shape.to[0], shape.to[1]);
        segments.push({ a, b });
        break;
      }
      case "circle": {
        const samples = shape.samples ?? 32;
        const { center, radius } = shape;
        let prev = new Vec2(center[0] + radius, center[1]);
        for (let i = 1; i <= samples; i += 1) {
          const angle = (i / samples) * Math.PI * 2;
          const next = new Vec2(center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle));
          segments.push({ a: prev, b: next });
          prev = next;
        }
        break;
      }
      case "ellipse": {
        const samples = shape.samples ?? 32;
        const { center, radiusX, radiusY } = shape;
        let prev = new Vec2(center[0] + radiusX, center[1]);
        for (let i = 1; i <= samples; i += 1) {
          const angle = (i / samples) * Math.PI * 2;
          const next = new Vec2(center[0] + radiusX * Math.cos(angle), center[1] + radiusY * Math.sin(angle));
          segments.push({ a: prev, b: next });
          prev = next;
        }
        break;
      }
      case "parabola": {
        const samples = shape.samples ?? 32;
        const { origin, a, width, height } = shape;
        let prev = new Vec2(origin[0] - width / 2, origin[1]);
        for (let i = 1; i <= samples; i += 1) {
          const t = i / samples;
          const x = origin[0] - width / 2 + t * width;
          const y = origin[1] + a * (x - origin[0]) * (x - origin[0]);
          if (y > origin[1] + height) continue;
          const next = new Vec2(x, y);
          segments.push({ a: prev, b: next });
          prev = next;
        }
        break;
      }
      case "parametric": {
        const { expr, start, end, samples } = shape;
        let prev: Vec2 | null = null;
        for (let i = 0; i <= samples; i += 1) {
          const t = start + ((end - start) * i) / samples;
          const [x, y] = expr(t);
          const current = new Vec2(x, y);
          if (prev) {
            segments.push({ a: prev, b: current });
          }
          prev = current;
        }
        break;
      }
      default: {
        const exhaustive: never = shape;
        throw new Error(`Unhandled shape type ${(exhaustive as { type: string }).type}`);
      }
    }
  }
  return segments;
}
