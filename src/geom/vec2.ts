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

  len(): number {
    return Math.hypot(this.x, this.y);
  }

  norm(): Vec2 {
    const length = this.len();
    if (length === 0) {
      return new Vec2(0, 0);
    }
    return new Vec2(this.x / length, this.y / length);
  }

  rotate(angle: number): Vec2 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Vec2(this.x * c - this.y * s, this.x * s + this.y * c);
  }
}

export interface Segment {
  a: Vec2;
  b: Vec2;
}
