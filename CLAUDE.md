# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands

```bash
pnpm install          # Install dependencies
pnpm run build        # Compile TypeScript to dist/
pnpm run dev          # Run directly with ts-node
pnpm run start        # Run compiled JavaScript
```

## Architecture

VibeLight is a Home Assistant integration that animates smart lights using Perlin noise to create smooth, organic color transitions.

### Core Components

**Perlin Engine** (`src/perlin/engine.ts`): Simplex noise generator using a seeded PRNG. Provides `sample()` for normalized 0-1 values and `sampleRange()` for mapped values. Single global instance (`perlinEngine`) maintains time state.

**Vibe State** (`src/vibe/state.ts`): Manages current animation parameters (hue range, saturation, speed) and enabled state. Applies presets from `config/presets.ts`. When disabled, returns to idle state (fixed warm color).

**Vibe Mapper** (`src/vibe/mapper.ts`): Translates noise values into light colors. Each light gets a unique offset for varied but coordinated animations. Handles hue wrapping across 0/360 boundary.

**Light Updater** (`src/homeassistant/updater.ts`): Main loop that polls preset selection from HA, computes colors via mapper, and sends updates to lights with staggered timing to avoid overwhelming the network.

**Event Server** (`src/event-server/server.ts`): Express server accepting POST `/state` with `{enabled: boolean}` to toggle animation on/off externally.

**HA Client** (`src/homeassistant/client.ts`): REST client for Home Assistant API. Reads input_boolean/input_select states and calls light.turn_on service.

### Data Flow

1. `LightUpdater` loop ticks the perlin engine and fetches current preset from HA
2. `VibeState` holds active preset parameters
3. `Mapper` samples perlin noise at light-specific offsets to compute hue/saturation
4. `HAClient` sends colors to lights via HA REST API

### Environment Variables

Required: `HA_URL`, `HA_TOKEN`, `HA_ENTITY_IDS` (comma-separated light entity IDs)

Optional: `HA_VIBELIGHT_ENTITY_ID`, `HA_PRESET_ENTITY_ID`, `LIGHT_STAGGER_DELAY_MS`, `LIGHT_TRANSITION_SECONDS`, `EVENT_SERVER_PORT`
