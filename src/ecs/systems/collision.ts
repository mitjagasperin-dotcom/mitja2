import { translateEntity, playerEntity } from '../ecs';
import type { GameWorld } from '../ecs';
import { separatingAxisTest } from '../../geom/collide';
import { Vec2 } from '../../geom/vec2';

const SEPARATION_EPSILON = 0.001;

export function resolvePlayerCollisions(world: GameWorld): void {
  const player = playerEntity(world);
  for (const entity of world.entities) {
    if (entity.id === player.id) continue;
    const result = separatingAxisTest(player.collider.vertices, entity.collider.vertices);
    if (!result) continue;
    let normal = result.normal;
    const direction = player.transform.position.sub(entity.transform.position);
    if (direction.dot(normal) < 0) {
      normal = normal.mul(-1);
    }
    const push = normal.mul(result.overlap + SEPARATION_EPSILON);
    translateEntity(player, push);
  }
}
