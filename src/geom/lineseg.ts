import { Vec2, Segment } from "./vec2";

export interface LineAgentGeometry {
  segment: Segment;
  width: number;
}

export function createLineAgentGeometry(center: Vec2, length: number, rotation: number, width: number): LineAgentGeometry {
  const half = length / 2;
  const dir = Vec2.fromAngle(rotation);
  const tangent = new Vec2(-dir.y, dir.x);
  const a = center.add(dir.scale(-half));
  const b = center.add(dir.scale(half));
  return {
    segment: { a, b },
    width,
  };
}

export function capsuleBoundingBox({ segment, width }: LineAgentGeometry): { min: Vec2; max: Vec2 } {
  const minX = Math.min(segment.a.x, segment.b.x) - width;
  const maxX = Math.max(segment.a.x, segment.b.x) + width;
  const minY = Math.min(segment.a.y, segment.b.y) - width;
  const maxY = Math.max(segment.a.y, segment.b.y) + width;
  return {
    min: new Vec2(minX, minY),
    max: new Vec2(maxX, maxY),
  };
}
