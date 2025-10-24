import { Vec2 } from '../geom/vec2';
import type { Entity } from './types';

export interface GameWorld {
  entities: Entity[];
  playerId: string;
  time: number;
}

export function createWorld(entities: Entity[], playerId: string): GameWorld {
  return {
    entities,
    playerId,
    time: 0,
  };
}

export function findEntity(world: GameWorld, id: string): Entity | undefined {
  return world.entities.find((entity) => entity.id === id);
}

export function playerEntity(world: GameWorld): Entity {
  const entity = findEntity(world, world.playerId);
  if (!entity) {
    throw new Error('Player entity missing');
  }
  return entity;
}

export function translateEntity(entity: Entity, delta: Vec2): void {
  entity.transform.position = entity.transform.position.add(delta);
  entity.collider.vertices = entity.collider.vertices.map((vertex) => vertex.add(delta));
}

export function rotateEntity(entity: Entity, rotation: number): void {
  entity.transform.rotation += rotation;
}
