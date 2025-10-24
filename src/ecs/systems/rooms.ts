import { GameContent, WorldState } from "@app/world";
import { getRoomSegments } from "@app/world";

export interface RoomState {
  roomId: string;
  segments: ReturnType<typeof getRoomSegments>;
}

export function enterRoom(world: WorldState, content: GameContent, roomId: string): RoomState | null {
  if (!content.rooms[roomId]) {
    return null;
  }
  return {
    roomId,
    segments: getRoomSegments(world, roomId),
  };
}

export function exitRoom(): RoomState | null {
  return null;
}
