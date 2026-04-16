import {useState} from 'react'

interface ResultCardProps {
    url: string
    fading?: boolean
    onDismiss?: () => void
}

export function ResultCard({url, fading = false, onDismiss}: ResultCardProps) {
    const [copied, setCopied] = useState(false)

    const shortUrl = (() => {
        try {
            return window.location.origin + new URL(url).pathname
        } catch {
            return url
        }
    })()

    async function handleCopy() {
        await navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div
            style={{transition: fading ? 'opacity 0.6s ease' : undefined}}
            className={`rounded-xl border border-violet-200 dark:border-violet-800/60 bg-linear-to-br from-violet-50 to-indigo-50/50 dark:from-violet-950/40 dark:to-indigo-950/20 p-4 space-y-3 ${fading ? 'opacity-0' : 'animate-[fade-up_0.2s_ease-out]'}`}
        >
            <div className="flex items-center gap-2">
        <span
            className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-600 dark:bg-violet-500 shrink-0">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
                <span
                    className="flex-1 text-xs font-medium text-violet-700 dark:text-violet-300 uppercase tracking-wide">
          Your short link is ready
        </span>
                {onDismiss && (
                    <button type="button" onClick={onDismiss}
                            className="shrink-0 text-violet-400 hover:text-violet-600 dark:hover:text-violet-200 transition-colors cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-0 font-medium text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100 truncate transition-colors"
                >
                    {shortUrl}
                </a>
                <button
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-900 border border-violet-200 dark:border-violet-700/60 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/40 transition-colors cursor-pointer"
                >
                    {copied ? (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Copied
                        </>
                    ) : (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            Copy
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
