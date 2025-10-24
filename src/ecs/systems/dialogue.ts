import type { DialogueSessionState, DialogueScript } from '../types';

export function createDialogueSession(script: DialogueScript, speakerId: string): DialogueSessionState {
  const node = script.nodes.start ?? Object.values(script.nodes)[0];
  if (!node) {
    throw new Error(`Dialogue script ${script.id} missing nodes`);
  }
  return {
    script,
    node,
    speakerId,
  };
}

export function advanceDialogue(
  session: DialogueSessionState,
  choiceIndex: number,
): DialogueSessionState | null {
  const choice = session.node.choices[choiceIndex];
  if (!choice) return session;
  if (choice.end || !choice.goto) {
    return null;
  }
  const next = session.script.nodes[choice.goto];
  if (!next) {
    return null;
  }
  return {
    ...session,
    node: next,
  };
}
