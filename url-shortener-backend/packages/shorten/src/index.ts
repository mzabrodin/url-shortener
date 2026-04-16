import Fastify from 'fastify';
import {createDb, errorHandler, registerGracefulShutdown} from '@url-shortener/shared';
import {nanoid} from 'nanoid';

const PORT = Number(process.env.PORT!);
const DATABASE_URL = process.env.DATABASE_URL!;
const BASE_URL = process.env.BASE_URL!;

const db = createDb(DATABASE_URL);

async function main() {
  const fastify = Fastify({logger: {level: process.env.LOG_LEVEL!}});

  fastify.setErrorHandler(errorHandler);

  fastify.post<{ Body: { url: string } }>('/shorten', {
    schema: {
      body: {
        type: 'object',
        required: ['url'],
        properties: {
          url: {type: 'string', format: 'uri'}
        }
      }
    }
  }, async (req, reply) => {
    const {url} = req.body;

    const code = nanoid(7);

    const [row] = await db<{ code: string }[]>`
      INSERT INTO urls (long_url, code)
      VALUES (${url}, ${code})
      ON CONFLICT (long_url) DO UPDATE SET long_url = EXCLUDED.long_url
      RETURNING code
    `;

    return reply.send({shortUrl: `${BASE_URL}/${row.code}`});
  });

  registerGracefulShutdown(fastify, async () => {
    await db.end();
  });

  await fastify.listen({port: PORT, host: '0.0.0.0'});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
