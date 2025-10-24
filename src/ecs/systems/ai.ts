import { WorldState, listEntities } from "@app/world";
import { RNG } from "@utils/rng";
import { Vec2 } from "@geom/vec2";

const rng = new RNG(123456);

export function updateAI(world: WorldState, dt: number): void {
  for (const entity of listEntities(world)) {
    if (!entity.kinematics) continue;
    switch (entity.agentProfile?.behaviour) {
      case "TriangleWander": {
        wander(entity, dt, 1.4);
        break;
      }
      case "SquareStudent": {
        wander(entity, dt, 0.9);
        break;
      }
      case "Scholar": {
        entity.kinematics.velocity = Vec2.zero();
        break;
      }
      default:
        break;
    }
  }
}

function wander(entity: { transform: { position: Vec2 }; kinematics: { velocity: Vec2 } }, dt: number, speed: number) {
  if (rng.next() < 0.02) {
    const angle = rng.range(0, Math.PI * 2);
    entity.kinematics.velocity = Vec2.fromAngle(angle).scale(speed);
  }
  entity.transform.position = entity.transform.position.add(entity.kinematics.velocity.scale(dt));
}
