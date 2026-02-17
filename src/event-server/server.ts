import express, { Request, Response } from 'express';
import { createLogger } from '../utils/logger';

const log = createLogger('event-server');

type EnabledStateHandler = (isEnabled: boolean) => void;

export class EventServer {
  private app = express();
  private enabledStateHandlers: EnabledStateHandler[] = [];

  constructor(private port: number) {
    this.app.use(express.json());
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({ status: 'healthy' });
    });

    this.app.post('/state', (req: Request, res: Response) => {
      const { enabled } = req.body as { enabled: boolean };
      this.notifyEnabledState(enabled);
      res.status(200).send();
    });
  }

  onEnabledStateChange(handler: EnabledStateHandler): void {
    this.enabledStateHandlers.push(handler);
  }

  private notifyEnabledState(isEnabled: boolean): void {
    for (const handler of this.enabledStateHandlers) {
      try {
        handler(isEnabled);
      } catch (err) {
        log.error('Error in enabled state handler', err as Error);
      }
    }
  }

  start(): void {
    this.app.listen(this.port, () => {
      log.info(`Event server listening on port ${this.port}`);
    });
  }
}
