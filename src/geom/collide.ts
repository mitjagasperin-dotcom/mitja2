import { Vec2 } from './vec2';

export interface Projection {
  min: number;
  max: number;
}

function projectPolygon(vertices: Vec2[], axis: Vec2): Projection {
  let min = vertices[0].dot(axis);
  let max = min;
  for (let i = 1; i < vertices.length; i += 1) {
    const value = vertices[i].dot(axis);
    if (value < min) min = value;
    if (value > max) max = value;
  }
  return { min, max };
}

function overlap(a: Projection, b: Projection): number {
  return Math.min(a.max, b.max) - Math.max(a.min, b.min);
}

export interface CollisionResult {
  overlap: number;
  normal: Vec2;
}

export function separatingAxisTest(a: Vec2[], b: Vec2[]): CollisionResult | null {
  let smallestOverlap = Number.POSITIVE_INFINITY;
  let collisionNormal = new Vec2(0, 0);

  const axes: Vec2[] = [];
  const pushAxes = (polygon: Vec2[]): void => {
    for (let i = 0; i < polygon.length; i += 1) {
      const p = polygon[i];
      const q = polygon[(i + 1) % polygon.length];
      const edge = q.sub(p);
      const axis = new Vec2(-edge.y, edge.x).normalize();
      axes.push(axis);
    }
  };

  pushAxes(a);
  pushAxes(b);

  for (const axis of axes) {
    const projA = projectPolygon(a, axis);
    const projB = projectPolygon(b, axis);
    const o = overlap(projA, projB);
    if (o <= 0) {
      return null;
    }
    if (o < smallestOverlap) {
      smallestOverlap = o;
      collisionNormal = axis;
    }
  }

  return { overlap: smallestOverlap, normal: collisionNormal };
}

export function translateVertices(vertices: Vec2[], delta: Vec2): Vec2[] {
  return vertices.map((v) => v.add(delta));
}

export function rotateVertices(vertices: Vec2[], angle: number, origin: Vec2): Vec2[] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return vertices.map((v) => {
    const ox = v.x - origin.x;
    const oy = v.y - origin.y;
    return new Vec2(origin.x + ox * c - oy * s, origin.y + ox * s + oy * c);
  });
}
