import { Vec2, Segment } from "./vec2";
import { polygonNormals, projectOntoAxis } from "./polygon";

export interface CollisionResult {
  depth: number;
  normal: Vec2;
}

export function collidesSAT(a: Vec2[], b: Vec2[]): CollisionResult | null {
  const axes = [...polygonNormals(a), ...polygonNormals(b)];
  let smallestOverlap = Infinity;
  let smallestAxis = axes[0];
  for (const axis of axes) {
    const [minA, maxA] = projectOntoAxis(a, axis);
    const [minB, maxB] = projectOntoAxis(b, axis);
    const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
    if (overlap <= 0) {
      return null;
    }
    if (overlap < smallestOverlap) {
      smallestOverlap = overlap;
      smallestAxis = axis;
    }
  }
  return { depth: smallestOverlap, normal: smallestAxis };
}

export function raySegment(origin: Vec2, direction: Vec2, segment: Segment): number | null {
  const v1 = origin.sub(segment.a);
  const v2 = segment.b.sub(segment.a);
  const v3 = new Vec2(-direction.y, direction.x);
  const denom = v2.dot(v3);
  if (Math.abs(denom) < 1e-6) {
    return null;
  }
  const t1 = v2.cross(v1) / denom;
  const t2 = v1.dot(v3) / denom;
  if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
    return t1;
  }
  return null;
}
