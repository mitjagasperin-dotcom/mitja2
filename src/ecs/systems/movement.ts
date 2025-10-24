import { PLAYER_MAX_SPEED, PLAYER_ROT_SPEED } from '../../app/constants';
import { Vec2 } from '../../geom/vec2';
import { translateEntity, playerEntity } from '../ecs';
import type { GameWorld } from '../ecs';

export interface InputCommand {
  forward: number;
  strafe: number;
  rotate: number;
}

export function applyMovement(world: GameWorld, input: InputCommand, dt: number): void {
  const player = playerEntity(world);
  const heading = player.transform.rotation;
  const forwardAxis = Vec2.fromAngle(heading);
  const rightAxis = Vec2.fromAngle(heading + Math.PI / 2);
  const desired = forwardAxis.mul(input.forward).add(rightAxis.mul(input.strafe));

  if (desired.len() > 0) {
    const delta = desired.normalize().mul(PLAYER_MAX_SPEED * dt);
    translateEntity(player, delta);
  }

  const rotationDelta = input.rotate * PLAYER_ROT_SPEED * dt;
  player.transform.rotation += rotationDelta;
}

export function updateLineAgents(world: GameWorld, dt: number): void {
  for (const entity of world.entities) {
    if (entity.type !== 'lineAgent' || !entity.line) continue;
    entity.transform.rotation += entity.line.angularVelocity * dt;
    const direction = Vec2.fromAngle(entity.transform.rotation);
    const delta = direction.mul(entity.line.speed * dt);
    translateEntity(entity, delta);
  }
}
