import { MOVEMENT_SPEED, ROTATION_SPEED } from "@app/constants";
import { WorldState, getPlayer, listEntities } from "@app/world";
import { InputState } from "@app/inputState";
import { buildRegularPolygon } from "@geom/polygon";
import { Vec2 } from "@geom/vec2";

export function integrateMovement(world: WorldState, input: InputState, dt: number): void {
  const player = getPlayer(world);
  const moveDir = new Vec2(input.right, input.forward);
  const length = moveDir.length();
  const direction = length > 0 ? moveDir.scale(1 / length) : Vec2.zero();
  const speed = MOVEMENT_SPEED * length;
  const forwardAxis = Vec2.fromAngle(player.transform.rotation);
  const rightAxis = forwardAxis.perp();
  const displacement = forwardAxis.scale(direction.y * speed * dt).add(rightAxis.scale(direction.x * speed * dt));
  player.transform.position = player.transform.position.add(displacement);
  player.transform.rotation += input.rotation * ROTATION_SPEED * dt;
  player.transform.rotation = clampAngle(player.transform.rotation);
  if (player.polygon) {
    player.polygon.vertices = buildRegularPolygon({
      n: player.polygon.sides,
      center: player.transform.position,
      radius: player.polygon.radius,
      rotation: player.transform.rotation,
    });
  }

  for (const entity of listEntities(world)) {
    if (entity.kind === "lineAgent" && entity.line && entity.kinematics) {
      entity.transform.position = entity.transform.position.add(entity.kinematics.velocity.scale(dt));
      entity.transform.rotation += entity.line.rotationSpeed * dt;
      entity.transform.rotation = clampAngle(entity.transform.rotation);
    }
    if (entity.polygon) {
      entity.polygon.vertices = buildRegularPolygon({
        n: entity.polygon.sides,
        center: entity.transform.position,
        radius: entity.polygon.radius,
        rotation: entity.transform.rotation,
      });
    }
  }
}

function clampAngle(angle: number): number {
  const twoPi = Math.PI * 2;
  return angle - Math.floor(angle / twoPi) * twoPi;
}
