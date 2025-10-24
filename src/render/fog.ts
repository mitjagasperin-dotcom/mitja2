import { FOG_GAMMA, MAX_FOG_DISTANCE } from "@app/constants";

export function fogIntensity(distance: number): number {
  const normalized = Math.min(1, distance / MAX_FOG_DISTANCE);
  return Math.pow(1 - normalized, FOG_GAMMA);
}

export function fogColor(distance: number): string {
  const intensity = fogIntensity(distance);
  const value = Math.floor(intensity * 200);
  return `rgb(${value}, ${value}, ${value})`;
}
