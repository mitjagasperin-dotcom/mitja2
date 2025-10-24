import { Segment, Vec2 } from "./vec2";
import { raySegment } from "./collide";

export interface RayHit {
  distance: number;
  segment: Segment | null;
}

export function castRay(origin: Vec2, direction: Vec2, segments: Segment[]): RayHit {
  let closest = Infinity;
  let hitSegment: Segment | null = null;
  for (const segment of segments) {
    const t = raySegment(origin, direction, segment);
    if (t !== null && t < closest) {
      closest = t;
      hitSegment = segment;
    }
  }
  return { distance: closest === Infinity ? Infinity : closest, segment: hitSegment };
}
