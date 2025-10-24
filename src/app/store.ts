import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ECSWorld } from "../ecs/ecs";
import { Entity, DialogueSessionState } from "../ecs/types";
import campusLevel from "../content/levels/campus.json";
import roomRt1 from "../content/rooms/room_rt_1.json";
import lessonIntro from "../content/dialogues/lesson_intro_pentagon.json";
import triangleHint from "../content/dialogues/triangle_hint.json";
import squareStudy from "../content/dialogues/square_study.json";
import rtHypo from "../content/puzzles/rt_leg_hypotenuse_basic.json";
import rtTrig from "../content/puzzles/rt_trig_basic.json";
import { Vec2 } from "../geom/vec2";
import { buildRegularPolygon } from "../geom/polygon";
import { createLineAgentGeometry } from "../geom/lineseg";
import { RNG } from "../utils/rng";
import { FOV, LOSE_SIDES_THRESHOLD, MAX_RAY_COUNT, MIN_RAY_COUNT } from "./constants";

export interface DialogueMap {
  [id: string]: typeof lessonIntro;
}

export interface PuzzleDefinition {
  id: string;
  type: "numeric_mcq";
  prompt: string;
  choices: string[];
  correctIndex: number;
  effectsOnCorrect: { sidesDelta: number };
  effectsOnWrong: { sidesDelta: number; explanation?: string };
}

export interface LevelState {
  world: ECSWorld;
  player: Entity;
  rng: RNG;
}

export interface RenderPolygon {
  id: string;
  points: Vec2[];
  sides: number;
  fill: string;
  stroke?: string;
}

export interface RenderLine {
  id: string;
  a: Vec2;
  b: Vec2;
}

export interface RenderHouse {
  id: string;
  points: Vec2[];
  doors: { angle: number; width: number; targetRoomId: string | null }[];
  center: Vec2;
  rotation: number;
}

export interface PerceptionColumn {
  distance: number;
  intensity: number;
  angle: number;
  hit?: string;
}

export interface PuzzleSession {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
  resolved: boolean;
}

export interface GameStoreState {
  level: LevelState;
  polygons: RenderPolygon[];
  houses: RenderHouse[];
  lines: RenderLine[];
  perception: PerceptionColumn[];
  dialogue: DialogueSessionState | null;
  expertMode: boolean;
  playerSides: number;
  lose: boolean;
  currentRoom: string | null;
  puzzle: PuzzleSession | null;
  input: Record<string, boolean>;
  talkRequested: boolean;
  roomInteractRequested: boolean;
  startDialogue: (dialogueId: string, actorSides: number) => void;
  advanceDialogue: (choiceIndex: number) => void;
  dismissDialogue: () => void;
  toggleExpert: () => void;
  setInput: (key: string, pressed: boolean) => void;
  requestTalk: () => void;
  requestRoomInteraction: () => void;
  beginPuzzle: (puzzleId: string) => void;
  answerPuzzle: (choiceIndex: number) => void;
  updateWorld: (updater: (state: GameStoreState) => void) => void;
  setRenderState: (data: {
    polygons: RenderPolygon[];
    houses: RenderHouse[];
    lines: RenderLine[];
    perception: PerceptionColumn[];
    playerSides: number;
    lose: boolean;
  }) => void;
}

const dialogues: DialogueMap = {
  [lessonIntro.id]: lessonIntro,
  [triangleHint.id]: triangleHint,
  [squareStudy.id]: squareStudy
};

const puzzles: Record<string, PuzzleDefinition> = {
  [rtHypo.id]: rtHypo as PuzzleDefinition,
  [rtTrig.id]: rtTrig as PuzzleDefinition
};

const rooms = {
  [roomRt1.id]: roomRt1
};

function createInitialWorld(): LevelState {
  const world = new ECSWorld();
  const rng = new RNG(42);
  const player = world.createEntity();
  world.setTransform(player, new Vec2(campusLevel.playerStart[0], campusLevel.playerStart[1]), 0);
  world.player.set(player, { sides: 4, expertMode: false, perceptionRays: [] });
  world.colliders.set(player, {
    points: buildRegularPolygon({ n: 4, center: Vec2.zero(), radius: 0.8 }),
    radius: 0.8
  });

  for (const house of campusLevel.houses) {
    const entity = world.createEntity();
    world.setTransform(entity, new Vec2(house.center[0], house.center[1]), house.rotation ?? 0);
    const polygon = buildRegularPolygon({
      n: house.n,
      center: Vec2.zero(),
      radius: house.radius,
      rotation: 0
    });
    world.colliders.set(entity, {
      points: polygon,
      radius: house.radius
    });
    world.houses.set(entity, {
      id: house.id,
      polygon,
      doors: house.doors.map((door) => ({ ...door }))
    });
  }

  for (const agent of campusLevel.agents) {
    const entity = world.createEntity();
    world.setTransform(entity, new Vec2(agent.pos[0], agent.pos[1]), rng.range(0, Math.PI * 2));
    const polygon = buildRegularPolygon({ n: agent.n, center: Vec2.zero(), radius: 0.75, rotation: 0 });
    world.colliders.set(entity, { points: polygon, radius: 0.75 });
    world.agents.set(entity, {
      name: agent.name,
      sides: agent.n,
      intellectRank: agent.ai === "Scholar" ? "Scholar" : agent.ai === "TriangleWander" ? "Triangle" : "Square",
      dialogueId: agent.dialogue,
      mood: "neutral"
    });
  }

  for (const line of campusLevel.lines) {
    const entity = world.createEntity();
    world.setTransform(entity, new Vec2(line.pos[0], line.pos[1]), rng.range(0, Math.PI * 2));
    world.lineAgents.set(entity, {
      length: line.length,
      width: 0.2,
      rotationSpeed: line.rotSpeed
    });
    const geometry = createLineAgentGeometry(new Vec2(0, 0), line.length, 0, 0.2);
    world.lineColliders.set(entity, geometry);
    const kinematics = world.ensureKinematics(entity);
    kinematics.velocity = new Vec2(line.speed, 0).rotate(rng.range(0, Math.PI * 2));
    kinematics.angularVelocity = line.rotSpeed;
  }

  return { world, player, rng };
}

const initialWorld = createInitialWorld();

export const useGameStore = create<GameStoreState>()(
  immer((set, get) => ({
    level: initialWorld,
    polygons: [],
    houses: [],
    lines: [],
    perception: [],
    dialogue: null,
    expertMode: false,
    playerSides: 4,
    lose: false,
    currentRoom: null,
    puzzle: null,
    input: {},
    talkRequested: false,
    roomInteractRequested: false,
    startDialogue: (dialogueId: string, actorSides: number) => {
      const node = dialogues[dialogueId]?.nodes.start;
      if (!node) return;
      set((state) => {
        state.dialogue = {
          actorId: dialogueId,
          nodeId: "start",
          text: node.text,
          options: node.choices?.map((choice) => ({
            label: choice.label,
            goto: choice.goto ?? null,
            effects: (choice.effects as any) ?? null
          })) ?? [],
          shapeSides: actorSides,
          iconSides: actorSides
        };
      });
    },
    advanceDialogue: (choiceIndex: number) => {
      const { dialogue } = get();
      if (!dialogue) return;
      const dialogueData = dialogues[dialogue.actorId ?? ""];
      if (!dialogueData) return;
      const currentNode = dialogueData.nodes[dialogue.nodeId];
      const choice = currentNode?.choices?.[choiceIndex];
      if (!choice) return;
      const applyEffects = () => {
        const effects = choice.effects as { sidesDelta?: number; explanation?: string } | undefined;
        if (effects?.sidesDelta) {
          set((state) => {
            const player = state.level.world.player.get(state.level.player);
            if (player) {
              player.sides = Math.max(player.sides + effects.sidesDelta, 0);
              state.playerSides = player.sides;
              state.lose = player.sides < LOSE_SIDES_THRESHOLD;
            }
          });
        }
      };
      applyEffects();
      if (choice.goto === null && !("end" in currentNode)) {
        set((state) => {
          state.dialogue = null;
        });
        return;
      }
      if (choice.goto) {
        const next = dialogueData.nodes[choice.goto];
        if (!next) {
          set((state) => {
            state.dialogue = null;
          });
          return;
        }
        set((state) => {
          state.dialogue = {
            actorId: dialogue.actorId,
            nodeId: choice.goto!,
            text: next.text ?? "",
            options: next.choices?.map((c) => ({
              label: c.label,
              goto: c.goto ?? null,
              effects: (c.effects as any) ?? null
            })) ?? [],
            shapeSides: dialogue.shapeSides,
            iconSides: dialogue.shapeSides
          };
        });
      } else if ((currentNode as any).end) {
        set((state) => {
          state.dialogue = null;
        });
      }
    },
    dismissDialogue: () => {
      set((state) => {
        state.dialogue = null;
      });
    },
    toggleExpert: () => {
      set((state) => {
        const player = state.level.world.player.get(state.level.player);
        if (!player) return;
        player.expertMode = !player.expertMode;
        state.expertMode = player.expertMode;
      });
    },
    setInput: (key: string, pressed: boolean) => {
      set((state) => {
        state.input[key] = pressed;
      });
    },
    requestTalk: () => {
      set((state) => {
        state.talkRequested = true;
      });
    },
    requestRoomInteraction: () => {
      set((state) => {
        state.roomInteractRequested = true;
      });
    },
    beginPuzzle: (puzzleId: string) => {
      const puzzle = puzzles[puzzleId];
      if (!puzzle) return;
      set((state) => {
        state.puzzle = {
          id: puzzle.id,
          prompt: puzzle.prompt,
          choices: puzzle.choices,
          correctIndex: puzzle.correctIndex,
          explanation: puzzle.effectsOnWrong.explanation,
          resolved: false
        };
      });
    },
    answerPuzzle: (choiceIndex: number) => {
      const { puzzle } = get();
      if (!puzzle || puzzle.resolved) return;
      const definition = puzzles[puzzle.id];
      if (!definition) return;
      const isCorrect = choiceIndex === definition.correctIndex;
      set((state) => {
        const player = state.level.world.player.get(state.level.player);
        if (!player) return;
        const effects = isCorrect ? definition.effectsOnCorrect : definition.effectsOnWrong;
        if (player.expertMode) {
          player.sides = Math.max(player.sides + (effects.sidesDelta ?? 0), 0);
          state.playerSides = player.sides;
          state.lose = player.sides < LOSE_SIDES_THRESHOLD;
        }
        state.puzzle = {
          ...puzzle,
          resolved: true,
          explanation: !isCorrect ? effects.explanation ?? puzzle.explanation : puzzle.explanation
        };
      });
    },
    updateWorld: (updater: (state: GameStoreState) => void) => {
      set((state) => {
        updater(state);
      });
    },
    setRenderState: ({ polygons, houses, lines, perception, playerSides, lose }) => {
      set((state) => {
        state.polygons = polygons;
        state.houses = houses;
        state.lines = lines;
        state.perception = perception;
        state.playerSides = playerSides;
        state.lose = lose;
      });
    }
  }))
);

export function computeRayCount(width: number): number {
  return Math.round(Math.min(MAX_RAY_COUNT, Math.max(MIN_RAY_COUNT, width)));
}

export function createPerceptionBuffer(): number[] {
  return new Array(MAX_RAY_COUNT).fill(0);
}

export const dialogueEntries = dialogues;
export const puzzleEntries = puzzles;
export const roomEntries = rooms;
