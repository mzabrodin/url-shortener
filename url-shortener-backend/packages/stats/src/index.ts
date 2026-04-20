import Fastify from 'fastify';
import {
  createDb,
  errorHandler,
  registerGracefulShutdown,
  codeParamsSchema,
  CodeParams,
} from '@url-shortener/shared';

const PORT = Number(process.env.PORT!);
const DATABASE_URL = process.env.DATABASE_URL!;

const db = createDb(DATABASE_URL);

async function main() {
  const fastify = Fastify({ logger: { level: process.env.LOG_LEVEL! } });

  fastify.setErrorHandler(errorHandler);

  fastify.get<{ Params: CodeParams }>(
    '/stats/:code',
    { schema: { params: codeParamsSchema } },
    async (req, reply) => {
      const { code } = req.params;

      const [url] = await db<{ long_url: string }[]>`
      SELECT long_url FROM urls WHERE code = ${code}
    `;

      if (!url) {
        return reply.code(404).send({ error: 'Not found' });
      }

      const [totals] = await db<{ total: string }[]>`
      SELECT COUNT(*) AS total FROM clicks WHERE code = ${code}
    `;

      const daily = await db<{ date: string; total: string }[]>`
      SELECT DATE(clicked_at) AS date, COUNT(*) AS total
      FROM clicks
      WHERE code = ${code}
      GROUP BY DATE(clicked_at)
      ORDER BY date DESC
      LIMIT 30
    `;

      return reply.send({
        code,
        longUrl: url.long_url,
        totalClicks: Number(totals.total),
        daily: daily.map((row) => ({ date: row.date, clicks: Number(row.total) })),
      });
    },
  );

  fastify.get('/stats', async (_req, reply) => {
    const rows = await db<{ code: string; long_url: string; total: string }[]>`
      SELECT u.code, u.long_url, COUNT(c.id) AS total
      FROM urls u
      LEFT JOIN clicks c ON c.code = u.code
      GROUP BY u.code, u.long_url
      ORDER BY total DESC
      LIMIT 20
    `;

    return reply.send(
      rows.map((row) => ({
        code: row.code,
        longUrl: row.long_url,
        totalClicks: Number(row.total),
      })),
    );
  });

  registerGracefulShutdown(fastify, async () => {
    await db.end();
  });

  await fastify.listen({ port: PORT, host: '0.0.0.0' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
