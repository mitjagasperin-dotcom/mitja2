import { Vec2 } from "./vec2";
import { polygonNormals } from "./polygon";

export interface Projection {
  min: number;
  max: number;
}

export function projectPolygon(vertices: Vec2[], axis: Vec2): Projection {
  let min = vertices[0].dot(axis);
  let max = min;
  for (let i = 1; i < vertices.length; i += 1) {
    const value = vertices[i].dot(axis);
    if (value < min) min = value;
    if (value > max) max = value;
  }
  return { min, max };
}

function overlaps(a: Projection, b: Projection): boolean {
  return a.max >= b.min && b.max >= a.min;
}

export function collidesSAT(a: Vec2[], b: Vec2[]): boolean {
  const axes = [...polygonNormals(a), ...polygonNormals(b)];
  for (const axis of axes) {
    const projA = projectPolygon(a, axis);
    const projB = projectPolygon(b, axis);
    if (!overlaps(projA, projB)) {
      return false;
    }
  }
  return true;
}

export interface CollisionResult {
  normal: Vec2;
  penetration: number;
}

export function collisionResponse(a: Vec2[], b: Vec2[]): CollisionResult | null {
  let minOverlap = Number.POSITIVE_INFINITY;
  let smallestAxis: Vec2 | null = null;
  const axes = [...polygonNormals(a), ...polygonNormals(b)];
  for (const axis of axes) {
    const projA = projectPolygon(a, axis);
    const projB = projectPolygon(b, axis);
    if (!overlaps(projA, projB)) {
      return null;
    }
    const overlap = Math.min(projA.max, projB.max) - Math.max(projA.min, projB.min);
    if (overlap < minOverlap) {
      minOverlap = overlap;
      smallestAxis = axis;
    }
  }
  if (!smallestAxis) {
    return null;
  }
  return { normal: smallestAxis, penetration: minOverlap };
}
