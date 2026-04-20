export const codeParamsSchema = {
  type: 'object',
  required: ['code'],
  properties: {
    code: { type: 'string', maxLength: 7, pattern: '^[a-zA-Z0-9_-]+$' },
  },
} as const;

export const shortenBodySchema = {
  type: 'object',
  required: ['url'],
  properties: {
    url: { type: 'string', format: 'uri' },
  },
} as const;

export interface CodeParams {
  code: string;
}

export interface ShortenBody {
  url: string;
}

export interface ShortenResponse {
  shortUrl: string;
}

export interface DailyClick {
  date: string;
  clicks: number;
}

export interface StatEntry {
  code: string;
  longUrl: string;
  totalClicks: number;
}

export interface CodeStats extends StatEntry {
  daily: DailyClick[];
}
