import {useState, useEffect, useRef} from 'react'
import {shortenUrl, ApiError} from '../api'
import {ResultCard} from './ResultCard'
import * as React from "react";

const DISMISS_MS = 8000
const FADEOUT_MS = 600

export function ShortenForm() {
    const [url, setUrl] = useState('')
    const [result, setResult] = useState<string | null>(null)
    const [fading, setFading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!result) return
        setFading(false)
        const fadeTimer = setTimeout(() => setFading(true), DISMISS_MS - FADEOUT_MS)
        timerRef.current = setTimeout(() => setResult(null), DISMISS_MS)
        return () => {
            clearTimeout(fadeTimer)
            clearTimeout(timerRef.current!)
        }
    }, [result])

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setResult(null)
        setLoading(true)
        try {
            const data = await shortenUrl(url)
            setResult(data.shortUrl)
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-3">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-1.5 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 shadow-sm focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all"
            >
        <span className="pl-2.5 text-zinc-400 dark:text-zinc-600 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </span>

                <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com/some/very/long/path"
                    required
                    className="flex-1 min-w-0 py-2.5 bg-transparent text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-colors cursor-pointer"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Shortening
                        </>
                    ) : (
                        <>
                            Shorten
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                    <svg className="shrink-0 text-red-500 dark:text-red-400" width="14" height="14" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p className="flex-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                    <button type="button" onClick={() => setError(null)}
                            className="shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            )}

            {result && <ResultCard url={result} fading={fading} onDismiss={() => setResult(null)}/>}
        </div>
    )
}
