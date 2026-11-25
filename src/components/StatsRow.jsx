import { CheckCircle2, Clock, Flame, Zap } from 'lucide-react'

const DAILY_GOAL_MINUTES = 120

export function StatsRow({ todayMinutes, completedTasks, totalTasks, streak, totalSessions }) {
  const goalPercent = Math.min(100, Math.round((todayMinutes / DAILY_GOAL_MINUTES) * 100))
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const cards = [
    {
      label: "Today's Focus",
      value: `${todayMinutes} min`,
      subtext: `${goalPercent}% of ${DAILY_GOAL_MINUTES}m daily goal`,
      icon: Clock,
      accent: 'text-emerald-500 bg-emerald-500/10',
      progress: goalPercent,
      barColor: 'bg-emerald-500',
    },
    {
      label: 'Tasks Completed',
      value: `${completedTasks} / ${totalTasks}`,
      subtext: `${taskPercent}% completion rate`,
      icon: CheckCircle2,
      accent: 'text-sky-500 bg-sky-500/10',
      progress: taskPercent,
      barColor: 'bg-sky-500',
    },
    {
      label: 'Coding Streak',
      value: `${streak} ${streak === 1 ? 'day' : 'days'}`,
      subtext: streak > 0 ? 'Keep the momentum going!' : 'Start a session today',
      icon: Flame,
      accent: 'text-amber-500 bg-amber-500/10',
    },
    {
      label: 'Total Sessions',
      value: `${totalSessions}`,
      subtext: 'All-time logged sprints',
      icon: Zap,
      accent: 'text-violet-500 bg-violet-500/10',
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <p className="mt-1.5 font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3">
              {typeof card.progress === 'number' && (
                <div className="mb-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${card.barColor}`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">{card.subtext}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
