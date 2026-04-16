import {createDb, createRedisClient, createLogger, registerProcessShutdown} from '@url-shortener/shared';

const DATABASE_URL = process.env.DATABASE_URL!;
const REDIS_URL = process.env.REDIS_URL!;

type XReadStream = {
  name: string;
  messages: Array<{ id: string; message: Record<string, string> }>;
};

const log = createLogger('analytics');

async function main() {
  const db = createDb(DATABASE_URL);
  const redis = await createRedisClient(REDIS_URL);

  let lastId = '0-0';
  const isRunning = registerProcessShutdown(log);

  log.info('Analytics consumer started, listening on Redis Stream "clicks"');

  while (isRunning()) {
    try {
      const streams = (await redis.xRead(
        [{key: 'clicks', id: lastId}],
        {COUNT: 100, BLOCK: 5000},
      )) as XReadStream[] | null;

      if (!streams || streams.length === 0) continue;

      for (const {messages} of streams) {
        if (messages.length === 0) continue;

        const clicksToInsert = messages.map(({message}) => ({
          code: message.code,
          clicked_at: new Date(message.timestamp),
        }));

        await db`
          INSERT INTO clicks ${db(clicksToInsert, 'code', 'clicked_at')}
        `;

        const messageIds = messages.map(({id}) => id);
        await redis.xDel('clicks', messageIds);

        log.info({count: messages.length}, 'Batch of clicks recorded successfully');

        lastId = messageIds[messageIds.length - 1];
      }
    } catch (error) {
      log.error({err: error}, 'Error processing batch, retrying in 5s');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  log.info('Closing database and redis connections');
  await redis.quit();
  await db.end();
  process.exit(0);
}

main().catch((err) => {
  log.error(err, 'fatal error, shutting down');
  process.exit(1);
});
