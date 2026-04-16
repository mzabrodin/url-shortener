import {useNavigate} from 'react-router-dom'
import type {TopStat} from '../api'

interface StatsTableProps {
    stats: TopStat[]
    apiKey: string
}

const RANK_STYLES: Record<number, string> = {
    0: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    1: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    2: 'bg-orange-100/60 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
}

export function StatsTable({stats, apiKey}: StatsTableProps) {
    const navigate = useNavigate()

    if (stats.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400 dark:text-zinc-600">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                     strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <p className="text-sm">No data yet.</p>
            </div>
        )
    }

    const max = Math.max(...stats.map(s => s.totalClicks), 1)

    return (
        <div
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-[fade-up_0.2s_ease-out]">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    <th className="text-left px-4 py-3 font-medium text-zinc-400 dark:text-zinc-500 w-10">
                        #
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400 dark:text-zinc-500 w-28">
                        Code
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-400 dark:text-zinc-500">
                        Long URL
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-400 dark:text-zinc-500 w-32">
                        Clicks
                    </th>
                </tr>
                </thead>
                <tbody>
                {stats.map((row, i) => (
                    <tr
                        key={row.code}
                        onClick={() => navigate(`/stats/${row.code}`, {state: {apiKey}})}
                        className={`
                group cursor-pointer transition-colors
                hover:bg-zinc-50 dark:hover:bg-zinc-900/50
                ${i < stats.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800/60' : ''}
              `}
                    >
                        <td className="px-4 py-3 text-center">
                <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-semibold ${RANK_STYLES[i] ?? 'text-zinc-400 dark:text-zinc-600'}`}>
                  {i + 1}
                </span>
                        </td>

                        <td className="px-4 py-3">
                <span className="font-mono font-medium text-violet-600 dark:text-violet-400">
                  {row.code}
                </span>
                        </td>

                        <td className="px-4 py-3">
                            <div className="flex flex-col gap-1 max-w-xs xl:max-w-md">
                  <span className="truncate text-zinc-700 dark:text-zinc-300" title={row.longUrl}>
                    {row.longUrl}
                  </span>
                                <div className="h-0.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-violet-400/50 dark:bg-violet-600/50"
                                        style={{width: `${(row.totalClicks / max) * 100}%`}}
                                    />
                                </div>
                            </div>
                        </td>

                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                  <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                    {row.totalClicks.toLocaleString()}
                  </span>
                                <svg
                                    className="text-zinc-300 dark:text-zinc-700 group-hover:text-violet-400 dark:group-hover:text-violet-500 transition-colors"
                                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <path d="M9 18l6-6-6-6"/>
                                </svg>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
