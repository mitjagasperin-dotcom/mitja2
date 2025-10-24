import { GameContent } from "@app/world";
import {
  DialogueChoice,
  DialogueDefinition,
  DialogueNode,
  DialogueRuntime,
  EntityId,
} from "@ecs/types";

export function beginDialogue(content: GameContent, dialogueId: string, speakerEntityId: EntityId): DialogueRuntime | null {
  const dialogue = content.dialogues[dialogueId];
  if (!dialogue) {
    return null;
  }
  const node = resolveNode(dialogue, "start");
  return {
    dialogue,
    currentNode: node,
    speakerEntityId,
  };
}

export function applyChoice(runtime: DialogueRuntime, choice: DialogueChoice): DialogueRuntime {
  if (choice.end) {
    return { ...runtime, currentNode: { ...runtime.currentNode, end: true, choices: [] } };
  }
  const nextId = choice.goto ?? "start";
  const node = resolveNode(runtime.dialogue, nextId);
  return { ...runtime, currentNode: node };
}

function resolveNode(dialogue: DialogueDefinition, nodeId: string): DialogueNode {
  const raw = dialogue.nodes[nodeId];
  if (!raw) {
    throw new Error(`Dialogue node ${nodeId} missing in ${dialogue.id}`);
  }
  const choices: DialogueChoice[] = (raw.choices ?? []).map((choice) => ({
    label: choice.label,
    goto: choice.goto,
    end: choice.end,
    effects: choice.effects,
  }));
  return {
    id: nodeId,
    text: raw.text,
    choices,
    end: raw.end,
  };
}
