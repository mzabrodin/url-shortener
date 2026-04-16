import Fastify from 'fastify';
import {createDb, createRedisClient, errorHandler, registerGracefulShutdown} from '@url-shortener/shared';
import type {RedisClient} from '@url-shortener/shared';

const PORT = Number(process.env.PORT!);
const DATABASE_URL = process.env.DATABASE_URL!;
const REDIS_URL = process.env.REDIS_URL!;
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS!);
const NEGATIVE_CACHE_TTL_SECONDS = Number(process.env.NEGATIVE_CACHE_TTL_SECONDS!);

const db = createDb(DATABASE_URL);
let redis: RedisClient;

async function main() {
  redis = await createRedisClient(REDIS_URL);

  const fastify = Fastify({logger: {level: process.env.LOG_LEVEL!}});

  fastify.setErrorHandler(errorHandler);

  fastify.get<{ Params: { code: string } }>('/:code',
    {
      schema: {
        params: {
          type: 'object',
          required: ['code'],
          properties: {
            code: {type: 'string', maxLength: 7, pattern: '^[a-zA-Z0-9_-]+$'}
          }
        }
      }
    },
    async (req, reply) => {
      const {code} = req.params;

      const cached = await redis.get(`url:${code}`);

      if (cached === 'NOT_FOUND') {
        return reply.code(404).send({error: 'Not found'});
      }

      if (cached) {
        redis.xAdd('clicks', '*', {code, timestamp: new Date().toISOString()})
          .catch(err => fastify.log.error({err, code}, 'Redis xAdd failed'));
        return reply.redirect(cached);
      }

      const rows = await db<{ long_url: string }[]>`
        SELECT long_url
        FROM urls
        WHERE code = ${code}
      `;

      if (rows.length === 0) {
        redis.set(`url:${code}`, 'NOT_FOUND', {EX: NEGATIVE_CACHE_TTL_SECONDS})
          .catch((err) => fastify.log.error({err, code}, 'Redis negative cache set failed'));
        return reply.code(404).send({error: 'Not found'});
      }

      const {long_url} = rows[0];

      redis.set(`url:${code}`, long_url, {EX: CACHE_TTL_SECONDS})
        .catch(err => fastify.log.error({err, code}, 'Redis set failed'));

      redis.xAdd('clicks', '*', {code, timestamp: new Date().toISOString()})
        .catch(err => fastify.log.error({err, code}, 'Redis xAdd failed'));

      return reply.redirect(long_url);
    });

  registerGracefulShutdown(fastify, async () => {
    await redis.quit();
    await db.end();
  });

  await fastify.listen({port: PORT, host: '0.0.0.0'});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
