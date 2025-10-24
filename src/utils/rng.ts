export class RNG {
  private seed: number;

  constructor(seed = 1) {
    this.seed = seed >>> 0;
  }

  next(): number {
    // xorshift32
    let x = this.seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.seed = x >>> 0;
    return this.seed / 0xffffffff;
  }

  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}
