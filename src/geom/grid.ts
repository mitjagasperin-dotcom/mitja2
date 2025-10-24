import { GRID_CELL_SIZE } from "@app/constants";
import { Vec2 } from "./vec2";

export type GridKey = string;

export interface SpatialEntry<T> {
  key: GridKey;
  item: T;
}

export class SpatialHash<T extends { position: Vec2; radius: number }> {
  private cells = new Map<GridKey, T[]>();

  private static keyFromCoords(x: number, y: number): GridKey {
    return `${x},${y}`;
  }

  clear(): void {
    this.cells.clear();
  }

  insert(item: T): void {
    const { position, radius } = item;
    const minX = Math.floor((position.x - radius) / GRID_CELL_SIZE);
    const minY = Math.floor((position.y - radius) / GRID_CELL_SIZE);
    const maxX = Math.floor((position.x + radius) / GRID_CELL_SIZE);
    const maxY = Math.floor((position.y + radius) / GRID_CELL_SIZE);
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        const key = SpatialHash.keyFromCoords(x, y);
        if (!this.cells.has(key)) {
          this.cells.set(key, []);
        }
        this.cells.get(key)!.push(item);
      }
    }
  }

  query(position: Vec2, radius: number): T[] {
    const results: T[] = [];
    const seen = new Set<T>();
    const minX = Math.floor((position.x - radius) / GRID_CELL_SIZE);
    const minY = Math.floor((position.y - radius) / GRID_CELL_SIZE);
    const maxX = Math.floor((position.x + radius) / GRID_CELL_SIZE);
    const maxY = Math.floor((position.y + radius) / GRID_CELL_SIZE);
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        const key = SpatialHash.keyFromCoords(x, y);
        const bucket = this.cells.get(key);
        if (!bucket) continue;
        for (const item of bucket) {
          if (!seen.has(item)) {
            seen.add(item);
            results.push(item);
          }
        }
      }
    }
    return results;
  }
}
