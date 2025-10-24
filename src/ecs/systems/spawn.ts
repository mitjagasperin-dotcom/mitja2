import { Vec2 } from '../../geom/vec2';
import { buildRegularPolygon } from '../../geom/polygon';
import type { GameWorld } from '../ecs';
import { createWorld } from '../ecs';
import type { DialogueScript, Entity } from '../types';
import campusLevel from '../../content/levels/campus.json';
import pentagonDialogue from '../../content/dialogues/lesson_intro_pentagon.json';
import triangleDialogue from '../../content/dialogues/triangle_hint.json';

export interface LoadedContent {
  world: GameWorld;
  dialogues: Record<string, DialogueScript>;
}

interface LevelAgent {
  id: string;
  name: string;
  n: number;
  pos: [number, number];
  ai: string;
  dialogue: string;
}

interface LevelHouse {
  id: string;
  n: number;
  center: [number, number];
  radius: number;
  rotation: number;
  doors: { angle: number; width: number }[];
}

interface LevelLine {
  id: string;
  pos: [number, number];
  length: number;
  speed: number;
  rotSpeed: number;
}

interface LevelData {
  id: string;
  playerStart: [number, number];
  houses: LevelHouse[];
  agents: LevelAgent[];
  lines: LevelLine[];
}

const playerRadius = 0.6;

function createPlayer(position: Vec2): Entity {
  const vertices = buildRegularPolygon({
    sides: 4,
    center: position,
    radius: playerRadius,
  });
  return {
    id: 'player',
    type: 'player',
    transform: { position, rotation: 0 },
    collider: {
      vertices,
      radius: playerRadius,
      sides: 4,
    },
    velocity: new Vec2(0, 0),
    name: 'You',
  };
}

function createAgent(agent: LevelAgent): Entity {
  const center = new Vec2(agent.pos[0], agent.pos[1]);
  const radius = 0.8 + agent.n * 0.05;
  const vertices = buildRegularPolygon({
    sides: agent.n,
    center,
    radius,
  });
  return {
    id: agent.id,
    type: 'polygonAgent',
    transform: { position: center, rotation: 0 },
    collider: { vertices, radius, sides: agent.n },
    name: agent.name,
    dialogueId: agent.dialogue,
  };
}

function createHouse(house: LevelHouse): Entity {
  const center = new Vec2(house.center[0], house.center[1]);
  const vertices = buildRegularPolygon({
    sides: house.n,
    center,
    radius: house.radius,
    rotation: house.rotation,
  });
  return {
    id: house.id,
    type: 'house',
    transform: { position: center, rotation: house.rotation },
    collider: { vertices, radius: house.radius, sides: house.n },
    name: house.id,
  };
}

function createLine(line: LevelLine): Entity {
  const center = new Vec2(line.pos[0], line.pos[1]);
  const sides = 6;
  const radius = line.length / 2;
  const vertices = buildRegularPolygon({
    sides,
    center,
    radius: radius * 0.4,
  });
  return {
    id: line.id,
    type: 'lineAgent',
    transform: { position: center, rotation: 0 },
    collider: { vertices, radius, sides },
    line: {
      length: line.length,
      angularVelocity: line.rotSpeed,
      speed: line.speed,
    },
  };
}

const dialogueScripts: DialogueScript[] = [pentagonDialogue, triangleDialogue];

export function loadInitialContent(level: LevelData = campusLevel as LevelData): LoadedContent {
  const playerStart = new Vec2(level.playerStart[0], level.playerStart[1]);
  const entities: Entity[] = [createPlayer(playerStart)];
  for (const house of level.houses) {
    entities.push(createHouse(house));
  }
  for (const agent of level.agents) {
    entities.push(createAgent(agent));
  }
  for (const line of level.lines) {
    entities.push(createLine(line));
  }

  const world = createWorld(entities, 'player');
  const dialogues = Object.fromEntries(dialogueScripts.map((script) => [script.id, script]));

  return { world, dialogues };
}
