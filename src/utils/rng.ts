export class RNG {
  private seed: number;

  constructor(seed = Date.now() % 2147483647) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 48271) % 2147483647;
    return this.seed / 2147483647;
  }

  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  pick<T>(items: T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }
}
