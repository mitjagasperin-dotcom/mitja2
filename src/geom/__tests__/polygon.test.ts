import { describe, expect, it } from "vitest";
import { buildRegularPolygon } from "@geom/polygon";
import { Vec2 } from "@geom/vec2";

describe("buildRegularPolygon", () => {
  it("creates vertices equally spaced", () => {
    const center = new Vec2(0, 0);
    const vertices = buildRegularPolygon({ n: 4, center, radius: 1, rotation: 0 });
    expect(vertices).toHaveLength(4);
    const distances = vertices.map((v) => v.length());
    expect(new Set(distances.map((d) => d.toFixed(2))).size).toBe(1);
  });
});
