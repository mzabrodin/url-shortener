import {createClient} from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

export async function createRedisClient(url: string): Promise<RedisClient> {
  const client = createClient({url});
  await client.connect();
  return client;
}
