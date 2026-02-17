export interface ColorPreset {
  hueMin: number;
  hueMax: number;
  saturation: number;
  noiseSpeed: number;
}

export const presets: Record<string, ColorPreset> = {
  'Full Rainbow': { hueMin: 0, hueMax: 360, saturation: 85, noiseSpeed: 0.8 },
  'Warm Party': { hueMin: 0, hueMax: 60, saturation: 90, noiseSpeed: 1.0 },
  'Cool Vibes': { hueMin: 180, hueMax: 270, saturation: 80, noiseSpeed: 0.6 },
  'Sunset': { hueMin: 0, hueMax: 45, saturation: 95, noiseSpeed: 0.5 },
  'Ocean': { hueMin: 180, hueMax: 220, saturation: 85, noiseSpeed: 0.4 },
  'Forest': { hueMin: 80, hueMax: 140, saturation: 75, noiseSpeed: 0.5 },
  'Urban Boutique Hotel': { hueMin: 280, hueMax: 45, saturation: 70, noiseSpeed: 0.4 },
};

export const DEFAULT_PRESET = 'Full Rainbow';

export function getPreset(name: string): ColorPreset {
  return presets[name] || presets[DEFAULT_PRESET];
}
