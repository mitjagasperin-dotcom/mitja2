import { Vec2 } from "./vec2";

export interface LineAgentGeometry {
  center: Vec2;
  length: number;
  rotation: number;
  radius: number;
}

export function lineAgentEndpoints(geom: LineAgentGeometry): { a: Vec2; b: Vec2 } {
  const dir = Vec2.fromAngle(geom.rotation);
  const half = dir.scale(geom.length / 2);
  return {
    a: geom.center.sub(half),
    b: geom.center.add(half),
  };
}

export function capsuleVertices(geom: LineAgentGeometry): Vec2[] {
  const { a, b } = lineAgentEndpoints(geom);
  const normal = b.sub(a).normalize().perp().scale(geom.radius);
  return [a.add(normal), b.add(normal), b.sub(normal), a.sub(normal)];
}
