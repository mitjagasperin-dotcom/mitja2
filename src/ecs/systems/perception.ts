import { DEFAULT_RAY_COUNT, FIELD_OF_VIEW, MAX_RAY_COUNT, MIN_RAY_COUNT } from "@app/constants";
import { WorldState, worldSegmentsForPerception, getPlayer } from "@app/world";
import { clamp } from "@utils/math";
import { Vec2 } from "@geom/vec2";
import { raycastSegments } from "@geom/raycast";
import { fogIntensity } from "@render/fog";

export interface PerceptionColumn {
  intensity: number;
  vertexCue: number;
}

export function samplePerception(world: WorldState, width: number): PerceptionColumn[] {
  const player = getPlayer(world);
  const segments = worldSegmentsForPerception(world);
  const sampleCount = clamp(Math.round((width / 800) * DEFAULT_RAY_COUNT), MIN_RAY_COUNT, MAX_RAY_COUNT);
  const samples: PerceptionColumn[] = [];
  for (let i = 0; i < sampleCount; i += 1) {
    const t = sampleCount <= 1 ? 0 : i / (sampleCount - 1);
    const angle = player.transform.rotation - FIELD_OF_VIEW / 2 + FIELD_OF_VIEW * t;
    const dir = Vec2.fromAngle(angle);
    const hit = raycastSegments(player.transform.position, dir, segments);
    const intensity = fogIntensity(hit.distance);
    samples.push({ intensity, vertexCue: hit.vertexProximity });
  }
  const results: PerceptionColumn[] = [];
  for (let x = 0; x < width; x += 1) {
    const ratio = width <= 1 ? 0 : x / (width - 1);
    const index = Math.min(samples.length - 1, Math.round(ratio * (samples.length - 1)));
    results.push(samples[index]);
  }
  return results;
}
