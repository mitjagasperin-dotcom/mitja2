import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameWorld } from '../ecs/ecs';
import { loadInitialContent } from '../ecs/systems/spawn';
import { applyMovement, updateLineAgents, type InputCommand } from '../ecs/systems/movement';
import { resolvePlayerCollisions } from '../ecs/systems/collision';
import { samplePerception } from '../ecs/systems/perception';
import type { DialogueSessionState, DialogueScript } from '../ecs/types';
import { createDialogueSession, advanceDialogue } from '../ecs/systems/dialogue';
import { applySideDelta, setPlayerSides } from '../ecs/systems/progression';
import { SIMULATION_DT } from './constants';
import { playerEntity } from '../ecs/ecs';

export interface InputState {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  rotateLeft: boolean;
  rotateRight: boolean;
  talk: boolean;
}

export interface GameStoreState {
  world: GameWorld;
  dialogues: Record<string, DialogueScript>;
  dialogueSession?: DialogueSessionState;
  perception: number[];
  perceptionColumns: number;
  expertMode: boolean;
  playerSides: number;
  input: InputState;
  tick(dt: number): void;
  setPerceptionColumns(columns: number): void;
  setInput(updater: (prev: InputState) => InputState): void;
  attemptTalk(): void;
  chooseDialogue(index: number): void;
  toggleExpertMode(): void;
  setTalkConsumed(): void;
  closeDialogue(): void;
}

const initialInput: InputState = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  rotateLeft: false,
  rotateRight: false,
  talk: false,
};

function inputToCommand(input: InputState): InputCommand {
  const forward = (input.moveForward ? 1 : 0) - (input.moveBackward ? 1 : 0);
  const strafe = (input.moveLeft ? -1 : 0) + (input.moveRight ? 1 : 0);
  const rotate = (input.rotateRight ? 1 : 0) - (input.rotateLeft ? 1 : 0);
  return { forward, strafe, rotate };
}

function findNearestDialogue(world: GameWorld, dialogues: Record<string, DialogueScript>, maxDistance: number) {
  const player = playerEntity(world);
  let bestId: string | undefined;
  let bestDist = maxDistance;
  for (const entity of world.entities) {
    if (!entity.dialogueId) continue;
    if (!dialogues[entity.dialogueId]) continue;
    const distance = player.transform.position.sub(entity.transform.position).len();
    if (distance < bestDist) {
      bestDist = distance;
      bestId = entity.id;
    }
  }
  return bestId;
}

const { world: initialWorld, dialogues: initialDialogues } = loadInitialContent();
setPlayerSides(initialWorld, 4);

export const useGameStore = create<GameStoreState>()(
  immer((set, get) => ({
    world: initialWorld,
    dialogues: initialDialogues,
    dialogueSession: undefined,
    perception: samplePerception(initialWorld, 320),
    perceptionColumns: 320,
    expertMode: false,
    playerSides: 4,
    input: initialInput,
    tick: (dt: number) => {
      set((state) => {
        state.world.time += dt;
        const command = inputToCommand(state.input);
        applyMovement(state.world, command, dt);
        updateLineAgents(state.world, dt);
        resolvePlayerCollisions(state.world);
        state.perception = samplePerception(state.world, state.perceptionColumns);
      });
    },
    setPerceptionColumns: (columns: number) => {
      set((state) => {
        state.perceptionColumns = columns;
        state.perception = samplePerception(state.world, columns);
      });
    },
    setInput: (updater: (prev: InputState) => InputState) => {
      set((state) => {
        state.input = updater(state.input);
      });
    },
    attemptTalk: () => {
      const { world, dialogues } = get();
      const nearest = findNearestDialogue(world, dialogues, 2.5);
      if (!nearest) return;
      const speaker = world.entities.find((entity) => entity.id === nearest);
      if (!speaker || !speaker.dialogueId) return;
      const script = dialogues[speaker.dialogueId];
      if (!script) return;
      set((state) => {
        state.dialogueSession = createDialogueSession(script, speaker.id);
      });
    },
    chooseDialogue: (index: number) => {
      const session = get().dialogueSession;
      if (!session) return;
      const choice = session.node.choices[index];
      if (!choice) return;
      set((state) => {
        if (choice.effects?.sidesDelta) {
          const result = applySideDelta(state.world, state.playerSides, choice.effects.sidesDelta);
          state.playerSides = result.sides;
          if (result.lost) {
            state.dialogueSession = undefined;
            return;
          }
        }
        const next = advanceDialogue(session, index);
        state.dialogueSession = next ?? undefined;
      });
    },
    toggleExpertMode: () => {
      set((state) => {
        state.expertMode = !state.expertMode;
      });
    },
    setTalkConsumed: () => {
      set((state) => {
        state.input.talk = false;
      });
    },
    closeDialogue: () => {
      set((state) => {
        state.dialogueSession = undefined;
      });
    },
  })),
);

export function fixedTick(): void {
  useGameStore.getState().tick(SIMULATION_DT);
}
