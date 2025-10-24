import { describe, it, expect } from "vitest";
import { Vec2 } from "./vec2";
import { buildRegularPolygon } from "./polygon";

describe("buildRegularPolygon", () => {
  it("creates the expected number of vertices", () => {
    const polygon = buildRegularPolygon({ n: 5, center: Vec2.zero(), radius: 2 });
    expect(polygon).toHaveLength(5);
  });

  it("positions vertices around the center", () => {
    const polygon = buildRegularPolygon({ n: 4, center: new Vec2(1, 1), radius: 1 });
    const centroidX = polygon.reduce((sum, p) => sum + p.x, 0) / polygon.length;
    const centroidY = polygon.reduce((sum, p) => sum + p.y, 0) / polygon.length;
    expect(Math.abs(centroidX - 1)).toBeLessThan(1e-6);
    expect(Math.abs(centroidY - 1)).toBeLessThan(1e-6);
  });
});
