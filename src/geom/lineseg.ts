import { Vec2 } from './vec2';

export interface LineSegmentConfig {
  center: Vec2;
  length: number;
  angle: number;
  halfWidth?: number;
}

export function segmentEndpoints({ center, length, angle }: LineSegmentConfig): [Vec2, Vec2] {
  const dir = Vec2.fromAngle(angle);
  const half = length / 2;
  return [center.add(dir.mul(-half)), center.add(dir.mul(half))];
}
