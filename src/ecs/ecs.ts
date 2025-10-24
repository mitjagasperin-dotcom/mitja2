import { Vec2 } from "../geom/vec2";
import {
  AgentComponent,
  ColliderComponent,
  DialogueComponent,
  Entity,
  HouseComponent,
  KinematicsComponent,
  LineAgentComponent,
  LineColliderComponent,
  PlayerComponent,
  RoomComponent,
  TransformComponent
} from "./types";

export class ECSWorld {
  private nextId = 1;
  transforms = new Map<Entity, TransformComponent>();
  kinematics = new Map<Entity, KinematicsComponent>();
  colliders = new Map<Entity, ColliderComponent>();
  lineColliders = new Map<Entity, LineColliderComponent>();
  agents = new Map<Entity, AgentComponent>();
  lineAgents = new Map<Entity, LineAgentComponent>();
  player = new Map<Entity, PlayerComponent>();
  dialogues = new Map<Entity, DialogueComponent>();
  houses = new Map<Entity, HouseComponent>();
  rooms = new Map<Entity, RoomComponent>();

  createEntity(): Entity {
    return this.nextId++;
  }

  destroyEntity(entity: Entity): void {
    this.transforms.delete(entity);
    this.kinematics.delete(entity);
    this.colliders.delete(entity);
    this.lineColliders.delete(entity);
    this.agents.delete(entity);
    this.lineAgents.delete(entity);
    this.player.delete(entity);
    this.dialogues.delete(entity);
    this.houses.delete(entity);
    this.rooms.delete(entity);
  }

  setTransform(entity: Entity, position: Vec2, rotation: number): void {
    this.transforms.set(entity, { position, rotation });
  }

  ensureKinematics(entity: Entity): KinematicsComponent {
    let k = this.kinematics.get(entity);
    if (!k) {
      k = { velocity: Vec2.zero(), angularVelocity: 0 };
      this.kinematics.set(entity, k);
    }
    return k;
  }
}
