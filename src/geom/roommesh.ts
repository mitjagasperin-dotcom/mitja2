import { Vec2 } from './vec2';

export type RoomPrimitive =
  | { type: 'segment'; from: [number, number]; to: [number, number] }
  | { type: 'circle'; center: [number, number]; radius: number; segments?: number }
  | { type: 'polygon'; points: [number, number][] };

export function tessellate(primitives: RoomPrimitive[]): Vec2[][] {
  const meshes: Vec2[][] = [];
  for (const primitive of primitives) {
    switch (primitive.type) {
      case 'segment':
        meshes.push([new Vec2(...primitive.from), new Vec2(...primitive.to)]);
        break;
      case 'circle': {
        const segments = primitive.segments ?? 32;
        const verts: Vec2[] = [];
        for (let i = 0; i < segments; i += 1) {
          const theta = (i / segments) * Math.PI * 2;
          verts.push(
            new Vec2(
              primitive.center[0] + primitive.radius * Math.cos(theta),
              primitive.center[1] + primitive.radius * Math.sin(theta),
            ),
          );
        }
        meshes.push(verts);
        break;
      }
      case 'polygon':
        meshes.push(primitive.points.map((p) => new Vec2(p[0], p[1])));
        break;
      default:
        break;
    }
  }
  return meshes;
}
