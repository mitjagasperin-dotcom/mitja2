import { FOG_DISTANCE, FOG_GAMMA } from "../app/constants";

export function fogIntensity(distance: number): number {
  if (!Number.isFinite(distance)) {
    return 0;
  }
  const normalized = Math.min(Math.max(distance / FOG_DISTANCE, 0), 1);
  const intensity = 1 - Math.pow(normalized, FOG_GAMMA);
  return Math.min(Math.max(intensity, 0), 1);
}

export function fogGradient(ctx: CanvasRenderingContext2D, width: number, height: number): CanvasGradient {
  const gradient = ctx.createLinearGradient(width / 2, 0, width / 2, height);
  gradient.addColorStop(0, "rgba(10, 10, 10, 0.9)");
  gradient.addColorStop(1, "rgba(10, 10, 10, 0.2)");
  return gradient;
}
