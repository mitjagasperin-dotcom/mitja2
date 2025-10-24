import { Vec2 } from "./vec2";

export interface GridCell {
  key: string;
  items: number[];
}

export class SpatialHash {
  private readonly cellSize: number;
  private readonly buckets = new Map<string, number[]>();

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  clear(): void {
    this.buckets.clear();
  }

  insert(id: number, min: Vec2, max: Vec2): void {
    const minCell = this.worldToCell(min);
    const maxCell = this.worldToCell(max);
    for (let y = minCell.y; y <= maxCell.y; y += 1) {
      for (let x = minCell.x; x <= maxCell.x; x += 1) {
        const key = this.cellKey(x, y);
        const list = this.buckets.get(key);
        if (list) {
          list.push(id);
        } else {
          this.buckets.set(key, [id]);
        }
      }
    }
  }

  query(min: Vec2, max: Vec2): number[] {
    const out = new Set<number>();
    const minCell = this.worldToCell(min);
    const maxCell = this.worldToCell(max);
    for (let y = minCell.y; y <= maxCell.y; y += 1) {
      for (let x = minCell.x; x <= maxCell.x; x += 1) {
        const key = this.cellKey(x, y);
        const list = this.buckets.get(key);
        if (list) {
          for (const id of list) {
            out.add(id);
          }
        }
      }
    }
    return [...out];
  }

  private worldToCell(pos: Vec2): Vec2 {
    return new Vec2(Math.floor(pos.x / this.cellSize), Math.floor(pos.y / this.cellSize));
  }

  private cellKey(x: number, y: number): string {
    return `${x}:${y}`;
  }
}
