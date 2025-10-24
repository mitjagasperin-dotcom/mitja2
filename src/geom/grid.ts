import { Vec2 } from './vec2';

export interface GridItem<T> {
  key: string;
  payload: T;
}

export class SpatialGrid<T> {
  private readonly cellSize: number;
  private readonly cells = new Map<string, T[]>();

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  clear(): void {
    this.cells.clear();
  }

  private cellKey(x: number, y: number): string {
    return `${x}|${y}`;
  }

  private cellIndex(value: number): number {
    return Math.floor(value / this.cellSize);
  }

  insert(point: Vec2, payload: T): void {
    const ix = this.cellIndex(point.x);
    const iy = this.cellIndex(point.y);
    const key = this.cellKey(ix, iy);
    const bucket = this.cells.get(key);
    if (bucket) {
      bucket.push(payload);
    } else {
      this.cells.set(key, [payload]);
    }
  }

  query(point: Vec2, radius: number): T[] {
    const minX = this.cellIndex(point.x - radius);
    const maxX = this.cellIndex(point.x + radius);
    const minY = this.cellIndex(point.y - radius);
    const maxY = this.cellIndex(point.y + radius);
    const results: T[] = [];
    for (let ix = minX; ix <= maxX; ix += 1) {
      for (let iy = minY; iy <= maxY; iy += 1) {
        const key = this.cellKey(ix, iy);
        const bucket = this.cells.get(key);
        if (bucket) {
          results.push(...bucket);
        }
      }
    }
    return results;
  }
}
