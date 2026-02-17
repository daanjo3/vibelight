import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const config = {
  ha: {
    url: required('HA_URL'),
    token: required('HA_TOKEN'),
    entityIds: required('HA_ENTITY_IDS').split(',').map(id => id.trim()),
    vibelightEntityId: optional('HA_VIBELIGHT_ENTITY_ID', 'input_boolean.vibelight'),
    presetEntityId: optional('HA_PRESET_ENTITY_ID', 'input_select.vibelight_preset'),
  },
  timing: {
    staggerDelayMs: parseInt(optional('LIGHT_STAGGER_DELAY_MS', '300'), 10),
    transitionSeconds: parseInt(optional('LIGHT_TRANSITION_SECONDS', '3'), 10),
  },
  server: {
    port: parseInt(optional('EVENT_SERVER_PORT', '3001'), 10),
  },
};
