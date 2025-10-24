import { GameContent, WorldState, createWorld } from "@app/world";

export function initializeWorld(levelId: string, content: GameContent): WorldState {
  return createWorld(levelId, content);
}
