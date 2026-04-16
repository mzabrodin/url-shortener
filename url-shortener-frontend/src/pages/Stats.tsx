import { useState, useEffect } from 'react'
import { getStats, ApiError, type TopStat } from '../api'
import { StatsKeyBar } from '../components/StatsKeyBar'
import { StatsTable } from '../components/StatsTable'

const STORAGE_KEY = 'admin_api_key'

export default function Stats() {
  const [stats, setStats] = useState<TopStat[] | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(() => !!sessionStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return

    getStats(stored)
      .then(data => {
        setApiKey(stored)
        setStats(data)
      })
      .catch(err => {
        setError(err instanceof ApiError ? err.message : 'Failed to load stats')
        if (err instanceof ApiError && err.status === 401) {
          sessionStorage.removeItem(STORAGE_KEY)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  function handleFetch(key: string) {
    setLoading(true)
    setError(null)
    getStats(key)
      .then(data => {
        setApiKey(key)
        setStats(data)
        sessionStorage.setItem(STORAGE_KEY, key)
      })
      .catch(err => {
        setError(err instanceof ApiError ? err.message : 'Failed to load stats')
        setStats(null)
        if (err instanceof ApiError && err.status === 401) {
          sessionStorage.removeItem(STORAGE_KEY)
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="relative flex flex-col items-center px-4 overflow-hidden min-h-[60vh] pt-[20vh] pb-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-160 h-120 rounded-full bg-violet-200/40 dark:bg-violet-900/20 blur-3xl" />
          <div className="absolute top-16 -right-24 w-72 h-72 rounded-full bg-indigo-200/30 dark:bg-indigo-900/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-xl space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Stats
            </h1>
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              Enter API key to load the data.
            </p>
          </div>

          <div className="flex justify-center">
            <StatsKeyBar onSubmit={handleFetch} loading={loading} />
          </div>

          {stats && stats.length === 0 && (
            <p className="text-center text-sm text-zinc-400 dark:text-zinc-600">
              No short links yet.
            </p>
          )}

          {error && (
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
          )}
        </div>
      </div>

      {stats && stats.length > 0 && (
        <div className="max-w-5xl mx-auto w-full px-5 pb-16">
          <StatsTable stats={stats} apiKey={apiKey} />
        </div>
      )}
    </div>
  )
}
