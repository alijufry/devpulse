import { getLast7DaysChart } from '../utils/dateHelpers'

export function WeeklyChart({ activityMap }) {
  const days = getLast7DaysChart(activityMap)
  const maxMinutes = Math.max(120, ...days.map((d) => d.minutes))
  const weeklyTotal = days.reduce((sum, d) => sum + d.minutes, 0)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            7-Day Focus Trend
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daily focus minutes over the past week
          </p>
        </div>
        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {weeklyTotal} min / wk
        </span>
      </div>

      {/* Bar Chart */}
      <div className="mt-6 flex h-44 items-end justify-between gap-2 sm:gap-4">
        {days.map((item) => {
          const heightPercent = Math.max(6, Math.round((item.minutes / maxMinutes) * 100))
          return (
            <div key={item.dateKey} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-32 w-full items-end justify-center">
                {/* Value label on hover or if today */}
                <span
                  className={`absolute -top-6 font-mono text-[11px] font-medium transition ${
                    item.isToday
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-500 opacity-0 group-hover:opacity-100 dark:text-slate-400'
                  }`}
                >
                  {item.minutes}m
                </span>

                <div
                  className={`w-full max-w-[38px] rounded-t-lg transition-all duration-500 ${
                    item.minutes === 0
                      ? 'bg-slate-100 dark:bg-slate-800'
                      : item.isToday
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/25'
                        : 'bg-emerald-500/75 group-hover:bg-emerald-500 dark:bg-emerald-600/70 dark:group-hover:bg-emerald-500'
                  }`}
                  style={{ height: `${item.minutes === 0 ? 6 : heightPercent}%` }}
                  title={`${item.day}: ${item.minutes} minutes (${item.sessions} sessions)`}
                />
              </div>

              <span
                className={`text-xs font-medium ${
                  item.isToday
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
