import { config } from './config';
import { createLogger } from './utils/logger';
import { EventServer } from './event-server/server';
import { lightUpdater } from './homeassistant/updater';

const log = createLogger('main');

async function main(): Promise<void> {
  log.info('Starting VibeLight');

  const eventServer = new EventServer(config.server.port);

  eventServer.onEnabledStateChange(async isEnabled => {
    if (isEnabled) {
      lightUpdater.start();
    } else {
      await lightUpdater.stop();
    }
  });

  eventServer.start();

  await lightUpdater.startIfEnabled();

  process.on('SIGINT', async () => {
    log.info('Received SIGINT, shutting down');
    await lightUpdater.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    log.info('Received SIGTERM, shutting down');
    await lightUpdater.stop();
    process.exit(0);
  });
}

main().catch(err => {
  log.error('Fatal error', err);
  process.exit(1);
});
