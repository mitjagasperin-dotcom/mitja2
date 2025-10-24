import { FOG_GAMMA, FOG_MAX_DISTANCE } from '../app/constants';
import { clamp } from '../utils/math';

export function fogFactor(distance: number): number {
  const normalized = clamp(distance / FOG_MAX_DISTANCE, 0, 1);
  return 1 - Math.pow(normalized, FOG_GAMMA);
}

export function fogToGray(fog: number): string {
  const value = Math.floor(clamp(fog, 0, 1) * 255);
  return `rgb(${value}, ${value}, ${value})`;
}
