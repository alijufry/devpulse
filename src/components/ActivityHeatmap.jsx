import { useState } from 'react'
import { getRecentDays } from '../utils/dateHelpers'

function getIntensityClass(minutes) {
  if (!minutes || minutes <= 0) {
    return 'bg-slate-100 dark:bg-slate-800/90'
  }
  if (minutes < 30) {
    return 'bg-emerald-200 dark:bg-emerald-950/90 dark:border dark:border-emerald-800/60'
  }
  if (minutes < 60) {
    return 'bg-emerald-300 dark:bg-emerald-700/90'
  }
  if (minutes < 100) {
    return 'bg-emerald-500 dark:bg-emerald-500'
  }
  return 'bg-emerald-600 dark:bg-emerald-400'
}

export function ActivityHeatmap({ activityMap }) {
  const days = getRecentDays(140) // 20 weeks
  const [hoveredDay, setHoveredDay] = useState(null)

  // Group into 20 columns of 7 days each
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const totalMinutes = days.reduce((sum, d) => sum + (activityMap[d.dateKey]?.minutes || 0), 0)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Focus Activity Heatmap
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last 20 weeks • <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span> total logged
          </p>
        </div>

        {/* Hover preview pill */}
        <div className="min-h-[24px] text-xs text-slate-500 dark:text-slate-400">
          {hoveredDay ? (
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {hoveredDay.label}: {hoveredDay.minutes}m ({hoveredDay.sessions} sessions)
            </span>
          ) : (
            <span className="text-[11px]">Hover any square for details</span>
          )}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="mt-4 overflow-x-auto pb-1">
        <div className="inline-flex w-full justify-between gap-1.5">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1.5">
              {week.map((day) => {
                const entry = activityMap[day.dateKey] || { minutes: 0, sessions: 0 }
                return (
                  <button
                    key={day.dateKey}
                    type="button"
                    onMouseEnter={() =>
                      setHoveredDay({
                        label: day.label,
                        minutes: entry.minutes,
                        sessions: entry.sessions,
                      })
                    }
                    onMouseLeave={() => setHoveredDay(null)}
                    aria-label={`${day.label}: ${entry.minutes} minutes`}
                    className={`h-4 w-4 rounded-[4px] transition-transform hover:scale-125 focus:outline-none sm:h-[18px] sm:w-[18px] ${getIntensityClass(
                      entry.minutes
                    )}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-slate-400">
        <span>Less</span>
        <span className="h-3 w-3 rounded-[3px] bg-slate-100 dark:bg-slate-800" />
        <span className="h-3 w-3 rounded-[3px] bg-emerald-200 dark:bg-emerald-950" />
        <span className="h-3 w-3 rounded-[3px] bg-emerald-300 dark:bg-emerald-700" />
        <span className="h-3 w-3 rounded-[3px] bg-emerald-500" />
        <span className="h-3 w-3 rounded-[3px] bg-emerald-600 dark:bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  )
}
