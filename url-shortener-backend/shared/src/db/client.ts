import postgres from 'postgres';

export function createDb(url: string) {
  return postgres(url);
}

export type Db = ReturnType<typeof createDb>;
