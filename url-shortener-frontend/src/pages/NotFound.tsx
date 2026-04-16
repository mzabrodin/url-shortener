import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center flex-1 px-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-160 h-120 rounded-full bg-violet-200/40 dark:bg-violet-900/20 blur-3xl" />
      </div>

      <div className="relative text-center space-y-4 animate-[fade-up_0.2s_ease-out]">
        <p className="text-7xl font-bold tabular-nums text-zinc-200 dark:text-zinc-800 select-none">404</p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Page not found</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          This short link doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 mt-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors group"
        >
          <svg
            className="group-hover:-translate-x-0.5 transition-transform"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  )
}
