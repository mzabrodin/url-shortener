import {type FastifyInstance} from 'fastify';
import {type Logger} from './logger';

export function registerGracefulShutdown(fastify: FastifyInstance, cleanup?: () => Promise<void>) {
  const signals = ['SIGINT', 'SIGTERM'] as const;
  for (const signal of signals) {
    process.on(signal, async () => {
      fastify.log.info(`Received ${signal}, shutting down gracefully`);
      try {
        await fastify.close();
        await cleanup?.();
        process.exit(0);
      } catch (err) {
        fastify.log.error({err}, 'Error during graceful shutdown');
        process.exit(1);
      }
    });
  }
}

export function registerProcessShutdown(log: Logger): () => boolean {
  let running = true;
  const signals = ['SIGINT', 'SIGTERM'] as const;
  for (const signal of signals) {
    process.on(signal, () => {
      log.info(`Received ${signal}, allowing current batch to finish before exiting`);
      running = false;
    });
  }
  return () => running;
}
