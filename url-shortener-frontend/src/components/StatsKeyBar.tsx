import {useState} from 'react'
import * as React from "react";

interface StatsKeyBarProps {
    onSubmit: (apiKey: string) => void
    loading: boolean
}

export function StatsKeyBar({onSubmit, loading}: StatsKeyBarProps) {
    const [key, setKey] = useState('')

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        if (key.trim()) onSubmit(key.trim())
    }

    return (
        <form onSubmit={handleSubmit}
              className="flex items-center gap-1.5 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 shadow-sm focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all">
      <span className="pl-2.5 text-zinc-400 dark:text-zinc-600 shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </span>

            <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="Admin API key"
                required
                autoComplete="off"
                className="flex-1 min-w-0 py-2 bg-transparent text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
            />

            <button
                type="submit"
                disabled={loading}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-colors cursor-pointer"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Loading
                    </>
                ) : (
                    'Get Stats'
                )}
            </button>
        </form>
    )
}
