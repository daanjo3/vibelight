# VibeLight

Animate your smart lights with smooth, organic color transitions using Perlin noise. Integrates with Home Assistant to control any color-capable light.

## Features

- Perlin noise-based color animation for natural, flowing transitions
- Multiple color presets (Full Rainbow, Warm Party, Cool Vibes, Sunset, Ocean, Forest, Urban Boutique Hotel)
- Preset selection via Home Assistant input_select entity
- Enable/disable via Home Assistant input_boolean or REST API
- Staggered light updates to avoid network congestion
- Docker support

## Requirements

- Node.js 20+ or Docker
- Home Assistant instance with:
  - Long-lived access token
  - Color-capable lights
  - `input_boolean.vibelight` entity (for enable/disable)
  - `input_select.vibelight_preset` entity (for preset selection)

## Installation

```bash
pnpm install
```

## Configuration

Copy `example.env` to `.env` and configure:

```env
# Required
HA_URL=http://homeassistant.local:8123
HA_TOKEN=your-long-lived-access-token
HA_ENTITY_IDS=light.living_room,light.bedroom,light.kitchen

# Optional
HA_VIBELIGHT_ENTITY_ID=input_boolean.vibelight
HA_PRESET_ENTITY_ID=input_select.vibelight_preset
LIGHT_STAGGER_DELAY_MS=300
LIGHT_TRANSITION_SECONDS=3
EVENT_SERVER_PORT=3001
```

### Home Assistant Setup

Create the control entities in your Home Assistant configuration:

```yaml
input_boolean:
  vibelight:
    name: VibeLight
    icon: mdi:lightbulb-group

input_select:
  vibelight_preset:
    name: VibeLight Preset
    options:
      - Full Rainbow
      - Warm Party
      - Cool Vibes
      - Sunset
      - Ocean
      - Forest
      - Urban Boutique Hotel
```

## Usage

### Development

```bash
pnpm run dev
```

### Production

```bash
pnpm run build
pnpm run start
```

### Docker

```bash
docker build -t vibelight .
docker run -d --env-file .env -p 3001:3001 vibelight
```

## REST API

The event server exposes endpoints for external control:

- `GET /health` - Health check
- `POST /state` - Toggle animation: `{"enabled": true}` or `{"enabled": false}`

## How It Works

VibeLight uses simplex noise (a variant of Perlin noise) to generate smooth, continuous values that change over time. Each light receives a unique offset into the noise field, creating varied but coordinated color changes across all lights.

The animation loop:
1. Advances the noise time based on the preset's speed setting
2. Samples noise values for each light at their unique offsets
3. Maps noise values to hue within the preset's color range
4. Sends color updates to Home Assistant with transition timing
5. Waits for the transition to complete before the next update

When disabled, lights transition to a warm idle color (hue 30, saturation 81%).
