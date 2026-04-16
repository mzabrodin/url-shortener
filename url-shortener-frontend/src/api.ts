export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const STATUS_MESSAGES: Record<number, string> = {
    400: 'Invalid request',
    401: 'Invalid API key',
    403: 'Access denied',
    404: 'Not found',
    409: 'Conflict',
    422: 'Validation error',
    429: 'Too many requests — slow down',
    500: 'Server error, please try again',
    502: 'Service unavailable',
    503: 'Service unavailable',
    504: 'Gateway timeout',
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    let res: Response
    try {
        res = await fetch(path, init)
    } catch {
        throw new ApiError('Cannot reach server - check your connection', 0)
    }

    if (!res.ok) {
        const body: { message?: string; error?: string } = await res.json().catch(() => ({}))
        throw new ApiError(body.message ?? body.error ?? STATUS_MESSAGES[res.status] ?? `HTTP ${res.status}`, res.status)
    }

    return await res.json() as T
}

export interface ShortenResponse {
    shortUrl: string
}

export interface TopStat {
    code: string
    longUrl: string
    totalClicks: number
}

export interface DailyStat {
    date: string
    clicks: number
}

export interface CodeStat {
    code: string
    longUrl: string
    totalClicks: number
    daily: DailyStat[]
}

export function shortenUrl(url: string): Promise<ShortenResponse> {
    return request<ShortenResponse>('/shorten', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url}),
    })
}

export function getStats(apiKey: string): Promise<TopStat[]> {
    return request<TopStat[]>('/stats', {
        headers: {'X-Api-Key': apiKey},
    })
}

export function getCodeStats(code: string, apiKey: string): Promise<CodeStat> {
    return request<CodeStat>(`/stats/${code}`, {
        headers: {'X-Api-Key': apiKey},
    })
}
