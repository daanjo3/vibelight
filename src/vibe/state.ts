import { createLogger } from '../utils/logger';
import { ColorPreset, getPreset, DEFAULT_PRESET } from '../config/presets';

const log = createLogger('vibe-state');

export interface VibeParams {
  hueMin: number;
  hueMax: number;
  saturation: number;
  noiseSpeed: number;
  isEnabled: boolean;
}

const idleParams: VibeParams = {
  hueMin: 30,
  hueMax: 30,
  saturation: 81,
  noiseSpeed: 0,
  isEnabled: false,
};

class VibeState {
  private currentParams: VibeParams = { ...idleParams };
  private currentPresetName: string = DEFAULT_PRESET;

  getParams(): VibeParams {
    return { ...this.currentParams };
  }

  getCurrentPresetName(): string {
    return this.currentPresetName;
  }

  setEnabled(isEnabled: boolean): void {
    if (!isEnabled && this.currentParams.isEnabled) {
      log.info('VibeLight disabled, transitioning to idle');
      this.currentParams = { ...idleParams };
    } else if (isEnabled && !this.currentParams.isEnabled) {
      log.info('VibeLight enabled, applying preset');
      this.applyPreset(this.currentPresetName);
    }
    this.currentParams.isEnabled = isEnabled;
  }

  setPreset(presetName: string): void {
    if (presetName === this.currentPresetName) {
      return;
    }
    this.currentPresetName = presetName;
    if (this.currentParams.isEnabled) {
      this.applyPreset(presetName);
    }
  }

  private applyPreset(presetName: string): void {
    const preset: ColorPreset = getPreset(presetName);
    this.currentParams.hueMin = preset.hueMin;
    this.currentParams.hueMax = preset.hueMax;
    this.currentParams.saturation = preset.saturation;
    this.currentParams.noiseSpeed = preset.noiseSpeed;
    this.currentParams.isEnabled = true;

    log.info(
      `Applied preset "${presetName}": hue=${preset.hueMin}-${preset.hueMax}, ` +
      `sat=${preset.saturation}%, speed=${preset.noiseSpeed}`
    );
  }
}

export const vibeState = new VibeState();
