import { Vec2 } from './vec2';

export interface RegularPolygonOptions {
  sides: number;
  center: Vec2;
  radius: number;
  rotation?: number;
}

export function buildRegularPolygon({
  sides,
  center,
  radius,
  rotation = 0,
}: RegularPolygonOptions): Vec2[] {
  const vertices: Vec2[] = [];
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + (i * Math.PI * 2) / sides;
    vertices.push(new Vec2(center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle)));
  }
  return vertices;
}

export function polygonNormals(vertices: Vec2[]): Vec2[] {
  const normals: Vec2[] = [];
  for (let i = 0; i < vertices.length; i += 1) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];
    const edge = b.sub(a);
    const normal = new Vec2(-edge.y, edge.x).normalize();
    normals.push(normal);
  }
  return normals;
}

export function polygonArea(vertices: Vec2[]): number {
  let area = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];
    area += a.x * b.y - b.x * a.y;
  }
  return Math.abs(area) / 2;
}

export function polygonCenter(vertices: Vec2[]): Vec2 {
  let cx = 0;
  let cy = 0;
  for (const v of vertices) {
    cx += v.x;
    cy += v.y;
  }
  const inv = 1 / vertices.length;
  return new Vec2(cx * inv, cy * inv);
}
