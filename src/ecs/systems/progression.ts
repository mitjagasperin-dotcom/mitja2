import { buildRegularPolygon } from '../../geom/polygon';
import { playerEntity } from '../ecs';
import type { GameWorld } from '../ecs';
import { Vec2 } from '../../geom/vec2';

const PLAYER_BASE_RADIUS = 0.6;

export interface ProgressionResult {
  sides: number;
  lost: boolean;
}

export function setPlayerSides(world: GameWorld, sides: number): void {
  const player = playerEntity(world);
  const vertices = buildRegularPolygon({
    sides,
    center: player.transform.position,
    radius: PLAYER_BASE_RADIUS,
    rotation: player.transform.rotation,
  });
  player.collider = {
    vertices,
    radius: PLAYER_BASE_RADIUS,
    sides,
  };
}

export function applySideDelta(world: GameWorld, currentSides: number, delta: number): ProgressionResult {
  const raw = currentSides + delta;
  const lost = raw < 3;
  const next = Math.max(3, raw);
  setPlayerSides(world, next);
  return {
    sides: next,
    lost,
  };
}
