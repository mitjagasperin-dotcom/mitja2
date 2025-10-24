import { Vec2 } from './vec2';

export interface Segment {
  a: Vec2;
  b: Vec2;
}

export function raySegment(origin: Vec2, dir: Vec2, segment: Segment): number | null {
  const v1 = origin.sub(segment.a);
  const v2 = segment.b.sub(segment.a);
  const v3 = new Vec2(-dir.y, dir.x);
  const denom = v2.dot(v3);
  if (Math.abs(denom) < 1e-6) return null;
  const t1 = v2.cross(v1) / denom;
  const t2 = v1.dot(v3) / denom;
  if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
    return t1;
  }
  return null;
}

export function nearestIntersection(origin: Vec2, dir: Vec2, segments: Segment[], maxDistance: number): number {
  let best = maxDistance;
  for (const segment of segments) {
    const hit = raySegment(origin, dir, segment);
    if (hit !== null && hit < best) {
      best = hit;
    }
  }
  return best;
}
