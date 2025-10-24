import { MAX_FOG_DISTANCE } from "@app/constants";
import { Segment, Vec2 } from "./vec2";

export interface RayHit {
  distance: number;
  point: Vec2;
  segment: Segment | null;
  vertexProximity: number;
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

export function raycastSegments(origin: Vec2, direction: Vec2, segments: Segment[]): RayHit {
  let closest = MAX_FOG_DISTANCE;
  let hitSegment: Segment | null = null;
  let closestPoint = origin.add(direction.scale(MAX_FOG_DISTANCE));
  let vertexProximity = 1;
  for (const seg of segments) {
    const t = raySegment(origin, direction, seg);
    if (t !== null && t < closest) {
      closest = t;
      hitSegment = seg;
      closestPoint = origin.add(direction.scale(t));
      const da = seg.a.sub(closestPoint).length();
      const db = seg.b.sub(closestPoint).length();
      const minDist = Math.min(da, db);
      vertexProximity = Math.min(vertexProximity, Math.exp(-minDist * 4));
    }
  }
  return {
    distance: closest,
    point: closestPoint,
    segment: hitSegment,
    vertexProximity,
  };
}
