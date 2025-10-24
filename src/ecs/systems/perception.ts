import { FOG_GAMMA, FOG_MAX_DISTANCE, FOV_RADIANS } from '../../app/constants';
import { nearestIntersection, type Segment } from '../../geom/raycast';
import { Vec2 } from '../../geom/vec2';
import type { GameWorld } from '../ecs';
import { playerEntity } from '../ecs';
import { clamp } from '../../utils/math';

function polygonToSegments(vertices: Vec2[]): Segment[] {
  const segments: Segment[] = [];
  for (let i = 0; i < vertices.length; i += 1) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];
    segments.push({ a, b });
  }
  return segments;
}

function gatherSegments(world: GameWorld, excludeId?: string): Segment[] {
  const segments: Segment[] = [];
  for (const entity of world.entities) {
    if (entity.id === excludeId) continue;
    segments.push(...polygonToSegments(entity.collider.vertices));
  }
  return segments;
}

function fogIntensity(distance: number): number {
  const norm = distance / FOG_MAX_DISTANCE;
  const value = 1 - Math.pow(clamp(norm, 0, 1), FOG_GAMMA);
  return clamp(value, 0, 1);
}

export function samplePerception(world: GameWorld, columns: number): number[] {
  const player = playerEntity(world);
  const segments = gatherSegments(world, player.id);
  const intensities: number[] = [];

  for (let i = 0; i < columns; i += 1) {
    const t = columns <= 1 ? 0 : i / (columns - 1);
    const angle = player.transform.rotation - FOV_RADIANS / 2 + t * FOV_RADIANS;
    const dir = Vec2.fromAngle(angle);
    const distance = nearestIntersection(player.transform.position, dir, segments, FOG_MAX_DISTANCE);
    intensities.push(fogIntensity(distance));
  }

  return intensities;
}
