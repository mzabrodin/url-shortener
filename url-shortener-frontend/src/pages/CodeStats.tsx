import { useState, useEffect } from 'react'
import { Link, useParams, useLocation, Navigate } from 'react-router-dom'
import { getCodeStats, ApiError, type CodeStat } from '../api'
import { DailyTable } from '../components/DailyTable'

const STORAGE_KEY = 'admin_api_key'

export default function CodeStats() {
  const { code } = useParams<{ code: string }>()
  const location = useLocation()

  const apiKey =
    sessionStorage.getItem(STORAGE_KEY) ||
    ((location.state as { apiKey?: string } | null)?.apiKey ?? '')

  const [stat, setStat] = useState<CodeStat | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!!apiKey && !!code)

  useEffect(() => {
    if (!apiKey || !code) return

    getCodeStats(code, apiKey)
      .then(setStat)
      .catch(err => {
        setError(err instanceof ApiError ? err.message : 'Failed to load stats')
        if (err instanceof ApiError && err.status === 401) {
          sessionStorage.removeItem(STORAGE_KEY)
        }
      })
      .finally(() => setLoading(false))
  }, [code, apiKey])

  const backLink = (
    <Link
      to="/stats"
      className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors group"
    >
      <svg
        className="group-hover:-translate-x-0.5 transition-transform"
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to Stats
    </Link>
  )

  if (!apiKey) {
    return <Navigate to="/stats" replace />
  }

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-5 py-10 space-y-4">
        {backLink}
        <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-600 pt-4">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-5 py-10 space-y-4">
        {backLink}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
          <svg className="shrink-0 text-red-500 dark:text-red-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="flex-1 text-sm text-red-600 dark:text-red-400">{error}</p>
          <button type="button" onClick={() => setError(null)} className="shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    )
  }

  if (!stat) return null

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-10 space-y-8 animate-[fade-up_0.2s_ease-out]">
      {backLink}

      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
          {stat.code}
        </h1>
        <a
          href={stat.longUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors break-all"
        >
          {stat.longUrl}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      <div className="inline-flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-8 py-6">
        <div className="text-4xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50 leading-none mb-1.5">
          {stat.totalClicks.toLocaleString()}
        </div>
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          Total clicks
        </div>
      </div>

      <DailyTable daily={stat.daily} />
    </div>
  )
}
