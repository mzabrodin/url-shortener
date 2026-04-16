import {NavLink} from 'react-router-dom'
import * as React from "react";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col flex-1">
            <header
                className="sticky top-0 z-10 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
                <nav className="max-w-5xl mx-auto px-5 h-14 flex items-center">

                    <NavLink
                        to="/"
                        className="font-mono font-bold text-[17px] text-violet-600 dark:text-violet-400 hover:opacity-75 transition-opacity tracking-tight"
                    >
                        shorten
                    </NavLink>

                    <div className="flex-1"/>

                    <NavLink
                        to="/"
                        className={({isActive}) =>
                            `text-sm px-3 py-1.5 rounded-md transition-colors ${
                                isActive
                                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            }`
                        }
                    >
                        Shorten
                    </NavLink>

                    <NavLink
                        to="/stats"
                        className={({isActive}) =>
                            `text-sm px-3 py-1.5 rounded-md transition-colors ${
                                isActive
                                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            }`
                        }
                    >
                        Stats
                    </NavLink>

                </nav>
            </header>
            <main className="flex-1 flex flex-col bg-white dark:bg-zinc-950">{children}</main>
        </div>
    )
}
