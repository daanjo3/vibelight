import { createLogger } from '../utils/logger';
import { config } from '../config';
import { haClient } from './client';
import { computeLightColors, tickPerlin, LightColor } from '../vibe/mapper';
import { vibeState } from '../vibe/state';
import { sleep } from '../utils/sleep';

const log = createLogger('light-updater');

class LightUpdater {
  private running = false;
  private lastTickTime = Date.now();
  private entityIds: string[];
  private vibelightEntityId: string;
  private presetEntityId: string;

  constructor() {
    this.entityIds = config.ha.entityIds;
    this.vibelightEntityId = config.ha.vibelightEntityId;
    this.presetEntityId = config.ha.presetEntityId;
  }

  async startIfEnabled(): Promise<void> {
    const connected = await haClient.checkConnection();
    if (!connected) {
      log.error('Failed to connect to Home Assistant');
      return;
    }

    const enabled = await haClient.getVibelightState(this.vibelightEntityId);
    if (enabled) {
      this.start();
    }
  }

  start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    vibeState.setEnabled(true);
    log.info(`Starting light update loop for ${this.entityIds.length} lights`);
    this.loop();
  }

  async stop(): Promise<void> {
    this.running = false;
    vibeState.setEnabled(false);
    log.info('Stopping light update loop, setting idle colors');
    await this.updateLights();
  }

  private async loop(): Promise<void> {
    while (this.running) {
      const now = Date.now();
      const deltaMs = now - this.lastTickTime;
      this.lastTickTime = now;

      tickPerlin(deltaMs);

      await this.fetchAndApplyPreset();

      await this.updateLights();

      await sleep(config.timing.transitionSeconds * 1000);
    }
  }

  private async fetchAndApplyPreset(): Promise<void> {
    const presetName = await haClient.getSelectedPreset(this.presetEntityId);
    if (presetName) {
      vibeState.setPreset(presetName);
    }
  }

  private async updateLights(): Promise<void> {
    const params = vibeState.getParams();

    if (!params.isEnabled) {
      log.debug('VibeLight disabled, maintaining idle state');
    }

    const colors = computeLightColors(this.entityIds);

    for (let i = 0; i < this.entityIds.length; i++) {
      const entityId = this.entityIds[i];
      const color = colors[i];

      await this.updateSingleLight(entityId, color);

      if (i < this.entityIds.length - 1) {
        await sleep(config.timing.staggerDelayMs);
      }
    }
  }

  private async updateSingleLight(entityId: string, color: LightColor): Promise<void> {
    log.debug(
      `Setting ${entityId}: hue=${color.hue.toFixed(1)}, sat=${color.saturation.toFixed(1)}%`
    );

    const success = await haClient.setLightColor(
      entityId,
      color.hue,
      color.saturation,
      config.timing.transitionSeconds
    );

    if (!success) {
      log.warn(`Failed to update light: ${entityId}`);
    }
  }
}

export const lightUpdater = new LightUpdater();
