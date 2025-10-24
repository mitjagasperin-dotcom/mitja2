import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { defaultInputState, InputState } from "@app/inputState";
import { MIN_SIDES } from "@app/constants";
import { GameContent, WorldState, getPlayer, listEntities, rebuildSegments } from "@app/world";
import { defaultContent } from "@content/index";
import { initializeWorld } from "@ecs/systems/spawn";
import { integrateMovement } from "@ecs/systems/movement";
import { resolveCollisions } from "@ecs/systems/collision";
import { updateAI } from "@ecs/systems/ai";
import { samplePerception, PerceptionColumn } from "@ecs/systems/perception";
import { beginDialogue, applyChoice } from "@ecs/systems/dialogue";
import { applyDialogueEffects, ProgressionResult, evaluatePuzzle } from "@ecs/systems/progression";
import { DialogueRuntime, Entity } from "@ecs/types";
import { Vec2 } from "@geom/vec2";
import { RoomState, enterRoom as enterRoomSystem, exitRoom as exitRoomSystem } from "@ecs/systems/rooms";

export interface GameStoreState {
  world: WorldState;
  content: GameContent;
  input: InputState;
  expertMode: boolean;
  perception: PerceptionColumn[];
  perceptionWidth: number;
  dialogue: DialogueRuntime | null;
  dialogueResult?: ProgressionResult | null;
  activeRoom: RoomState | null;
  lost: boolean;
  setInput: (partial: Partial<InputState>) => void;
  toggleExpert: () => void;
  setPerceptionWidth: (width: number) => void;
  tick: (dt: number) => void;
  startDialogue: (entity: Entity) => void;
  chooseDialogue: (choiceIndex: number) => void;
  enterRoom: (roomId: string) => void;
  exitRoom: () => void;
  solvePuzzle: (puzzleId: string, choiceIndex: number) => void;
  resetTalk: () => void;
}

function createInitialWorld(content: GameContent): WorldState {
  return initializeWorld("campus", content);
}

export const useGameStore = create<GameStoreState>()(
  immer((set, get) => {
    const content = defaultContent;
    const world = createInitialWorld(content);
    rebuildSegments(world);
    return {
      world,
      content,
      input: { ...defaultInputState },
      expertMode: false,
      perception: [],
      perceptionWidth: 640,
      dialogue: null,
      dialogueResult: null,
      activeRoom: null,
      lost: false,
      setInput: (partial) => {
        set((state) => {
          state.input = { ...state.input, ...partial };
        });
      },
      toggleExpert: () => {
        set((state) => {
          state.expertMode = !state.expertMode;
        });
      },
      setPerceptionWidth: (width) => {
        set((state) => {
          state.perceptionWidth = width;
          state.perception = samplePerception(state.world, Math.max(1, Math.floor(width)));
        });
      },
      tick: (dt) => {
        const state = get();
        const { world } = state;
        const player = getPlayer(world);
        const prevPosition = player.transform.position;
        const prevRotation = player.transform.rotation;
        updateAI(world, dt);
        integrateMovement(world, state.input, dt);
        resolveCollisions(world, prevPosition, prevRotation);
        rebuildSegments(world);
        if (state.input.talk) {
          const nearest = findNearestConversational(world, player.transform.position);
          if (nearest) {
            state.startDialogue(nearest);
          }
        }
        if (state.perceptionWidth > 0) {
          set((draft) => {
            draft.perception = samplePerception(world, Math.floor(draft.perceptionWidth));
          });
        }
        set((draft) => {
          draft.lost = player.sideCounter ? player.sideCounter.sides < MIN_SIDES : false;
        });
        state.resetTalk();
      },
      startDialogue: (entity) => {
        const state = get();
        if (!entity.dialogue) return;
        const runtime = beginDialogue(state.content, entity.dialogue.id, entity.id);
        set((draft) => {
          draft.dialogue = runtime;
          draft.dialogueResult = null;
        });
      },
      chooseDialogue: (choiceIndex) => {
        const state = get();
        const runtime = state.dialogue;
        if (!runtime) return;
        const choice = runtime.currentNode.choices[choiceIndex];
        if (!choice) return;
        const next = applyChoice(runtime, choice);
        const result = applyDialogueEffects(state.world, choice.effects);
        set((draft) => {
          draft.dialogue = next;
          draft.dialogueResult = result;
          draft.lost = result?.lost ?? draft.lost;
        });
      },
      enterRoom: (roomId) => {
        const state = get();
        const room = enterRoomSystem(state.world, state.content, roomId);
        set((draft) => {
          draft.activeRoom = room;
        });
      },
      exitRoom: () => {
        set((draft) => {
          draft.activeRoom = exitRoomSystem();
        });
      },
      solvePuzzle: (puzzleId, choiceIndex) => {
        const state = get();
        const result = evaluatePuzzle(state.world, state.content, puzzleId, choiceIndex);
        set((draft) => {
          draft.dialogueResult = result;
          if (result) {
            draft.lost = result.lost;
          }
        });
      },
      resetTalk: () => {
        set((draft) => {
          draft.input.talk = false;
        });
      },
    };
  }),
);

function findNearestConversational(world: WorldState, position: Vec2): Entity | null {
  let nearest: Entity | null = null;
  let minDist = 1.6;
  for (const entity of listEntities(world)) {
    if (!entity.dialogue || !entity.polygon) continue;
    const dist = entity.transform.position.sub(position).length();
    if (dist < minDist) {
      minDist = dist;
      nearest = entity;
    }
  }
  return nearest;
}
