import roomRt1 from '../../content/rooms/room_rt_1.json';
import { tessellate } from '../../geom/roommesh';

export interface RoomDefinition {
  id: string;
  segments: ReturnType<typeof tessellate>;
  puzzles: string[];
}

const rooms: RoomDefinition[] = [
  {
    id: roomRt1.id,
    segments: tessellate(roomRt1.equations as any),
    puzzles: roomRt1.puzzles as string[],
  },
];

export function getRoomDefinition(id: string): RoomDefinition | undefined {
  return rooms.find((room) => room.id === id);
}
