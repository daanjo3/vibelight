import { createNoise2D, NoiseFunction2D } from 'simplex-noise';
import alea from 'alea';

export class PerlinEngine {
  private noise: NoiseFunction2D;
  private time: number = 0;
  private speed: number = 1.0;

  constructor(seed: string = 'vibesync') {
    const prng = alea(seed);
    this.noise = createNoise2D(prng);
  }

  setSpeed(speed: number): void {
    this.speed = Math.max(0.1, Math.min(speed, 5.0));
  }

  getSpeed(): number {
    return this.speed;
  }

  tick(deltaMs: number): void {
    this.time += (deltaMs / 1000) * this.speed;
  }

  sample(offset: number): number {
    const value = this.noise(this.time, offset);
    return (value + 1) / 2;
  }

  sampleRange(offset: number, min: number, max: number): number {
    const normalized = this.sample(offset);
    return min + normalized * (max - min);
  }

  reset(): void {
    this.time = 0;
  }

  getTime(): number {
    return this.time;
  }
}

export const perlinEngine = new PerlinEngine();
