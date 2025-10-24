export interface Vec2Like {
  x: number;
  y: number;
}

export class Vec2 implements Vec2Like {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static fromAngle(rad: number): Vec2 {
    return new Vec2(Math.cos(rad), Math.sin(rad));
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  add(v: Vec2Like): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vec2Like): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  mul(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  dot(v: Vec2Like): number {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vec2Like): number {
    return this.x * v.y - this.y * v.x;
  }

  len(): number {
    return Math.hypot(this.x, this.y);
  }

  normalize(): Vec2 {
    const length = this.len();
    if (length === 0) {
      return new Vec2(0, 0);
    }
    return new Vec2(this.x / length, this.y / length);
  }
}

export function rotate(vec: Vec2Like, angle: number): Vec2 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Vec2(vec.x * c - vec.y * s, vec.x * s + vec.y * c);
}

export function lerp(a: Vec2Like, b: Vec2Like, t: number): Vec2 {
  return new Vec2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
}

export const ZERO = new Vec2(0, 0);
