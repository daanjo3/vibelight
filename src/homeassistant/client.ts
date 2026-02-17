import { createLogger } from '../utils/logger';
import { config } from '../config';
import { HAServiceData, HAInputBooleanState, HAInputSelectState } from './types';

const log = createLogger('ha-client');

class HAClient {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = config.ha.url.replace(/\/+$/, '');
    this.token = config.ha.token.trim();
  }

  private async request<T>(method: string, path: string, body?: object): Promise<T | null> {
    const url = `${this.baseUrl}/api${path}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        log.error(`HA API error: ${response.status} ${response.statusText} for ${method} ${url}`);
        return null;
      }

      return (await response.json()) as T;
    } catch (err) {
      log.error('HA API request failed', err as Error);
      return null;
    }
  }

  async checkConnection(): Promise<boolean> {
    const result = await this.request<{ message: string }>('GET', '/');
    if (result) {
      log.info(`Connected to Home Assistant at ${this.baseUrl}`);
      return true;
    }
    return false;
  }

  async setLightColor(
    entityId: string,
    hue: number,
    saturation: number,
    transitionSeconds: number
  ): Promise<boolean> {
    const serviceData: HAServiceData = {
      entity_id: entityId,
      hs_color: [hue, saturation],
      transition: transitionSeconds,
    };

    const result = await this.request<unknown[]>('POST', '/services/light/turn_on', serviceData);
    return result !== null;
  }

  async getVibelightState(entityId: string): Promise<boolean> {
    const result = await this.request<HAInputBooleanState>('GET', `/states/${entityId}`);
    return result?.state === 'on';
  }

  async getSelectedPreset(entityId: string): Promise<string | null> {
    const result = await this.request<HAInputSelectState>('GET', `/states/${entityId}`);
    if (result && result.state) {
      return result.state;
    }
    return null;
  }
}

export const haClient = new HAClient();
