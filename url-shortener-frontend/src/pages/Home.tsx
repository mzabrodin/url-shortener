import { ShortenForm } from '../components/ShortenForm'

export default function Home() {
  return (
    <div className="relative flex flex-col items-center flex-1 px-4 pt-[25vh] pb-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-160 h-120 rounded-full bg-violet-200/40 dark:bg-violet-900/20 blur-3xl" />
        <div className="absolute top-16 -right-24 w-72 h-72 rounded-full bg-indigo-200/30 dark:bg-indigo-900/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Shorten{' '}
            <span className="bg-linear-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              any URL
            </span>
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Paste a long link below and get a short, shareable URL instantly.
          </p>
        </div>

        <ShortenForm />
      </div>
    </div>
  )
}
