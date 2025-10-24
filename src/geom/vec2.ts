export class Vec2 {
  constructor(public x: number, public y: number) {}

  static zero(): Vec2 {
    return new Vec2(0, 0);
  }

  static fromAngle(angle: number): Vec2 {
    return new Vec2(Math.cos(angle), Math.sin(angle));
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  scale(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vec2): number {
    return this.x * v.y - this.y * v.x;
  }

  length(): number {
    return Math.hypot(this.x, this.y);
  }

  normalize(): Vec2 {
    const len = this.length();
    if (len === 0) {
      return new Vec2(0, 0);
    }
    return this.scale(1 / len);
  }

  rotate(angle: number): Vec2 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Vec2(this.x * c - this.y * s, this.x * s + this.y * c);
  }

  perp(): Vec2 {
    return new Vec2(-this.y, this.x);
  }
}

export type Segment = { a: Vec2; b: Vec2 };

export function midpoint(a: Vec2, b: Vec2): Vec2 {
  return new Vec2((a.x + b.x) / 2, (a.y + b.y) / 2);
}
