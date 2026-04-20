import Fastify from 'fastify';
import cors from '@fastify/cors';
import replyFrom from '@fastify/reply-from';
import rateLimit from '@fastify/rate-limit';
import {
  codeParamsSchema,
  CodeParams,
  shortenBodySchema,
  ShortenBody,
  errorHandler,
  registerGracefulShutdown,
} from '@url-shortener/shared';

const PORT = Number(process.env.PORT!);
const SHORTEN_URL = process.env.SHORTEN_URL!;
const REDIRECT_URL = process.env.REDIRECT_URL!;
const STATS_URL = process.env.STATS_URL!;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY!;
const CLIENT_URL = process.env.CLIENT_URL!;

async function main() {
  const fastify = Fastify({ logger: { level: process.env.LOG_LEVEL! }, trustProxy: true });

  await fastify.register(cors, {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
  });
  await fastify.register(rateLimit, { max: 60, timeWindow: '1 minute' });
  await fastify.register(replyFrom);

  fastify.setErrorHandler(errorHandler);

  fastify.post<{ Body: ShortenBody }>(
    '/shorten',
    { schema: { body: shortenBodySchema } },
    (_request, reply) => {
      reply.from(`${SHORTEN_URL}/shorten`);
    },
  );

  fastify.register(async (statsScope) => {
    statsScope.addHook('onRequest', async (request, reply) => {
      if (request.headers['x-api-key'] !== ADMIN_API_KEY) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    });

    statsScope.get('/stats', (_request, reply) => {
      reply.from(`${STATS_URL}/stats`);
    });

    statsScope.get<{ Params: CodeParams }>(
      '/stats/:code',
      { schema: { params: codeParamsSchema } },
      (req, reply) => {
        reply.from(`${STATS_URL}/stats/${req.params.code}`);
      },
    );
  });

  fastify.get<{ Params: CodeParams }>(
    '/:code',
    { schema: { params: codeParamsSchema } },
    (req, reply) => {
      reply.from(`${REDIRECT_URL}/${req.params.code}`, {
        onResponse(request, reply, res) {
          if ((res.statusCode ?? 0) >= 400 && request.headers.accept?.includes('text/html')) {
            return reply.redirect(`${CLIENT_URL}/not-found`);
          }

          reply.send(res);
        },
      });
    },
  );

  registerGracefulShutdown(fastify);

  await fastify.listen({ port: PORT, host: '0.0.0.0' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
