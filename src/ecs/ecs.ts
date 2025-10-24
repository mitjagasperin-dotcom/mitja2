import { Entity, EntityId, EntityMap } from "./types";

let nextEntityId = 1;

export function createEntityId(): EntityId {
  return nextEntityId++;
}

export function createEntityMap(): EntityMap {
  return new Map();
}

export function addEntity(map: EntityMap, entity: Omit<Entity, "id">): Entity {
  const id = createEntityId();
  const full: Entity = { ...entity, id };
  map.set(id, full);
  return full;
}

export function removeEntity(map: EntityMap, id: EntityId): void {
  map.delete(id);
}

export function getEntities(map: EntityMap): Entity[] {
  return Array.from(map.values());
}

export function resetIds(): void {
  nextEntityId = 1;
}
