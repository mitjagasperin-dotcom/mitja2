import { Vec2 } from "./vec2";

export interface RegularPolygonConfig {
  n: number;
  center: Vec2;
  radius: number;
  rotation?: number;
}

export function buildRegularPolygon({
  n,
  center,
  radius,
  rotation = 0
}: RegularPolygonConfig): Vec2[] {
  const out: Vec2[] = [];
  for (let i = 0; i < n; i += 1) {
    const angle = rotation + (i * Math.PI * 2) / n;
    out.push(new Vec2(center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle)));
  }
  return out;
}

export function polygonEdges(points: Vec2[]): { a: Vec2; b: Vec2; normal: Vec2 }[] {
  const edges = [] as { a: Vec2; b: Vec2; normal: Vec2 }[];
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const edge = b.sub(a);
    const normal = new Vec2(-edge.y, edge.x).norm();
    edges.push({ a, b, normal });
  }
  return edges;
}

export function polygonNormals(points: Vec2[]): Vec2[] {
  return polygonEdges(points).map((e) => e.normal);
}

export function projectOntoAxis(points: Vec2[], axis: Vec2): [number, number] {
  let min = points[0].dot(axis);
  let max = min;
  for (let i = 1; i < points.length; i += 1) {
    const projection = points[i].dot(axis);
    if (projection < min) min = projection;
    if (projection > max) max = projection;
  }
  return [min, max];
}

export function polygonCentroid(points: Vec2[]): Vec2 {
  const sum = points.reduce((acc, p) => new Vec2(acc.x + p.x, acc.y + p.y), Vec2.zero());
  return sum.scale(1 / points.length);
}

export function transformPolygon(points: Vec2[], position: Vec2, rotation: number): Vec2[] {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return points.map((p) => {
    const x = p.x * cos - p.y * sin + position.x;
    const y = p.x * sin + p.y * cos + position.y;
    return new Vec2(x, y);
  });
}

export function polygonBounds(points: Vec2[]): { min: Vec2; max: Vec2 } {
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  for (let i = 1; i < points.length; i += 1) {
    const p = points[i];
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { min: new Vec2(minX, minY), max: new Vec2(maxX, maxY) };
}
