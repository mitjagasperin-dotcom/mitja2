import { Vec2 } from "./vec2";

export interface RegularPolygonOptions {
  n: number;
  center: Vec2;
  radius: number;
  rotation?: number;
}

export function buildRegularPolygon({
  n,
  center,
  radius,
  rotation = 0,
}: RegularPolygonOptions): Vec2[] {
  const out: Vec2[] = [];
  for (let i = 0; i < n; i += 1) {
    const a = rotation + (i * 2 * Math.PI) / n;
    out.push(new Vec2(center.x + radius * Math.cos(a), center.y + radius * Math.sin(a)));
  }
  return out;
}

export function polygonNormals(vertices: Vec2[]): Vec2[] {
  const normals: Vec2[] = [];
  for (let i = 0; i < vertices.length; i += 1) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const edge = next.sub(current);
    normals.push(edge.perp().normalize());
  }
  return normals;
}

export function polygonArea(vertices: Vec2[]): number {
  let area = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    area += current.cross(next);
  }
  return Math.abs(area) / 2;
}

export function polygonCentroid(vertices: Vec2[]): Vec2 {
  let cx = 0;
  let cy = 0;
  let area = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const cross = current.cross(next);
    cx += (current.x + next.x) * cross;
    cy += (current.y + next.y) * cross;
    area += cross;
  }
  const factor = area * 3;
  if (factor === 0) {
    return Vec2.zero();
  }
  return new Vec2(cx / factor, cy / factor);
}

export function translatePolygon(vertices: Vec2[], offset: Vec2): Vec2[] {
  return vertices.map((v) => v.add(offset));
}

export function rotatePolygon(vertices: Vec2[], angle: number, around: Vec2): Vec2[] {
  return vertices.map((v) => v.sub(around).rotate(angle).add(around));
}

export function polygonBoundingRadius(vertices: Vec2[], center: Vec2): number {
  return vertices.reduce((max, v) => Math.max(max, v.sub(center).length()), 0);
}
