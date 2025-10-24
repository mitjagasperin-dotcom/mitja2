import { addEntity, createEntityMap, getEntities, resetIds } from "@ecs/ecs";
import {
  DialogueDefinition,
  Entity,
  EntityMap,
  LevelDefinition,
  PuzzleDefinition,
  RoomDefinition,
} from "@ecs/types";
import { buildRegularPolygon, polygonBoundingRadius } from "@geom/polygon";
import { Segment, Vec2 } from "@geom/vec2";
import { tessellateAnalyticShapes } from "@geom/roommesh";
import { MAX_FOG_DISTANCE, PLAYER_START_SIDES } from "./constants";

export interface GameContent {
  levels: Record<string, LevelDefinition>;
  rooms: Record<string, RoomDefinition>;
  dialogues: Record<string, DialogueDefinition>;
  puzzles: Record<string, PuzzleDefinition>;
}

export interface WorldState {
  entities: EntityMap;
  levelId: string;
  playerId: number;
  segments: Segment[];
  roomSegments: Record<string, Segment[]>;
}

export function createWorld(levelId: string, content: GameContent): WorldState {
  const level = content.levels[levelId];
  if (!level) {
    throw new Error(`Unknown level ${levelId}`);
  }
  resetIds();
  const entities = createEntityMap();

  const globalSegments: Segment[] = [];
  const roomSegments: Record<string, Segment[]> = {};

  for (const house of level.houses) {
    const center = new Vec2(house.center[0], house.center[1]);
    const vertices = buildRegularPolygon({ n: house.n, center, radius: house.radius, rotation: house.rotation });
    const radius = polygonBoundingRadius(vertices, center);
    for (let i = 0; i < vertices.length; i += 1) {
      const current = vertices[i];
      const next = vertices[(i + 1) % vertices.length];
      globalSegments.push({ a: current, b: next });
    }
    addEntity(entities, {
      kind: "house",
      transform: { position: center, rotation: house.rotation },
      polygon: { vertices, radius, sides: house.n },
      linkedRoomId: house.roomId,
    });
    if (house.roomId) {
      const roomDef = content.rooms[house.roomId];
      if (roomDef) {
        roomSegments[house.roomId] = tessellateAnalyticShapes(roomDef.equations);
      }
    }
  }

  const playerPosition = new Vec2(level.playerStart[0], level.playerStart[1]);
  const playerPolygon = buildRegularPolygon({ n: PLAYER_START_SIDES, center: playerPosition, radius: 0.6 });
  const player = addEntity(entities, {
    kind: "player",
    transform: { position: playerPosition, rotation: 0 },
    polygon: { vertices: playerPolygon, radius: 0.6, sides: PLAYER_START_SIDES },
    kinematics: { velocity: Vec2.zero(), angularVelocity: 0 },
    sideCounter: { sides: PLAYER_START_SIDES },
  });

  for (const agent of level.agents) {
    const position = new Vec2(agent.pos[0], agent.pos[1]);
    const vertices = buildRegularPolygon({ n: agent.n, center: position, radius: 0.6 });
    addEntity(entities, {
      kind: "polygonAgent",
      transform: { position, rotation: 0 },
      polygon: { vertices, radius: 0.6, sides: agent.n },
      kinematics: { velocity: Vec2.zero(), angularVelocity: 0 },
      agentProfile: {
        name: agent.name,
        intellectRank: agent.intellectRank ?? "Student",
        behaviour: agent.ai,
      },
      dialogue: agent.dialogue ? { id: agent.dialogue } : undefined,
    });
  }

  for (const line of level.lines) {
    const center = new Vec2(line.pos[0], line.pos[1]);
    addEntity(entities, {
      kind: "lineAgent",
      transform: { position: center, rotation: 0 },
      line: {
        length: line.length,
        rotationSpeed: line.rotSpeed,
        translationVelocity: new Vec2(line.speed, 0),
      },
      kinematics: { velocity: new Vec2(line.speed, 0), angularVelocity: line.rotSpeed },
    });
  }

  return {
    entities,
    levelId,
    playerId: player.id,
    segments: globalSegments,
    roomSegments,
  };
}

export function getPlayer(world: WorldState): Entity {
  const entity = world.entities.get(world.playerId);
  if (!entity) {
    throw new Error("Player entity missing");
  }
  return entity;
}

export function listEntities(world: WorldState): Entity[] {
  return getEntities(world.entities);
}

export function rebuildSegments(world: WorldState): void {
  const segments: Segment[] = [];
  for (const entity of getEntities(world.entities)) {
    if (entity.polygon && entity.kind !== "player") {
      const verts = entity.polygon.vertices;
      for (let i = 0; i < verts.length; i += 1) {
        const a = verts[i];
        const b = verts[(i + 1) % verts.length];
        segments.push({ a, b });
      }
    }
  }
  world.segments = segments;
}

export function worldSegmentsForPerception(world: WorldState): Segment[] {
  return world.segments;
}

export function getRoomSegments(world: WorldState, roomId: string): Segment[] {
  return world.roomSegments[roomId] ?? [];
}

export const EMPTY_SEGMENTS: Segment[] = Object.freeze([]);

export function fogDistanceForEmpty(): number {
  return MAX_FOG_DISTANCE;
}
