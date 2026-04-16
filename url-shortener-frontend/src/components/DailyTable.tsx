import type {DailyStat} from '../api'

interface DailyTableProps {
    daily: DailyStat[]
}

export function DailyTable({daily}: DailyTableProps) {
    if (daily.length === 0) return null

    const max = Math.max(...daily.map(d => d.clicks))

    return (
        <div className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Daily breakdown
            </h2>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                        <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                            Date
                        </th>
                        <th className="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 w-24">
                            Clicks
                        </th>
                        <th className="px-4 py-3 w-48 hidden sm:table-cell"/>
                    </tr>
                    </thead>
                    <tbody>
                    {daily.map((row, i) => (
                        <tr
                            key={row.date}
                            className={i < daily.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800/60' : ''}
                        >
                            <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                                {row.date}
                            </td>
                            <td className="px-4 py-3 text-right font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                                {row.clicks.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                                <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-violet-500 dark:bg-violet-400 transition-all"
                                        style={{width: max > 0 ? `${(row.clicks / max) * 100}%` : '0%'}}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
