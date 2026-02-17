import { perlinEngine } from '../perlin/engine';
import { vibeState, VibeParams } from './state';

export interface LightColor {
  hue: number;
  saturation: number;
}

const BULB_OFFSETS = [0, 100, 200, 300];

function normalizeHue(hue: number): number {
  while (hue < 0) hue += 360;
  while (hue >= 360) hue -= 360;
  return hue;
}

export function computeLightColors(entityIds: string[]): LightColor[] {
  const params = vibeState.getParams();
  perlinEngine.setSpeed(params.noiseSpeed);

  const colors: LightColor[] = [];

  for (let i = 0; i < entityIds.length; i++) {
    const offset = BULB_OFFSETS[i] || i * 100;
    const color = computeSingleLight(params, offset);
    colors.push(color);
  }

  return colors;
}

function computeSingleLight(params: VibeParams, offset: number): LightColor {
  const hue = computeHue(params, offset);

  const satVariation = perlinEngine.sampleRange(offset + 50, -10, 10);
  const saturation = Math.max(0, Math.min(100, params.saturation + satVariation));

  return { hue, saturation };
}

function computeHue(params: VibeParams, offset: number): number {
  const { hueMin, hueMax } = params;

  if (hueMin === hueMax) {
    return hueMin;
  }

  const noiseValue = perlinEngine.sample(offset);

  if (hueMin < hueMax) {
    const hueRange = hueMax - hueMin;
    const hue = hueMin + noiseValue * hueRange;
    return normalizeHue(hue);
  } else {
    const hueRange = (360 - hueMin) + hueMax;
    const hue = hueMin + noiseValue * hueRange;
    return normalizeHue(hue);
  }
}

export function tickPerlin(deltaMs: number): void {
  perlinEngine.tick(deltaMs);
}
