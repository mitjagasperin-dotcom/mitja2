import { WorldState, getPlayer, listEntities } from "@app/world";
import { collisionResponse } from "@geom/collide";
import { buildRegularPolygon } from "@geom/polygon";
import { Vec2 } from "@geom/vec2";

export function resolveCollisions(world: WorldState, previousPosition: Vec2, previousRotation: number): void {
  const player = getPlayer(world);
  if (!player.polygon) {
    return;
  }
  for (const other of listEntities(world)) {
    if (other.id === player.id) continue;
    if (!other.polygon) continue;
    const response = collisionResponse(player.polygon.vertices, other.polygon.vertices);
    if (response) {
      player.transform.position = previousPosition;
      player.transform.rotation = previousRotation;
      player.polygon.vertices = buildRegularPolygon({
        n: player.polygon.sides,
        center: player.transform.position,
        radius: player.polygon.radius,
        rotation: player.transform.rotation,
      });
      return;
    }
  }
}
