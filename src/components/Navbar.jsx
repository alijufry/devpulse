import {
  Activity,
  BarChart3,
  Download,
  Flame,
  KanbanSquare,
  LayoutDashboard,
  Moon,
  RotateCcw,
  Sun,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'Task Board', icon: KanbanSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export function Navbar({
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  streak,
  onResetDemo,
  onExportData,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                DevPulse
              </span>
              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                v1.0
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              Focus &amp; Productivity Workspace
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="order-3 flex w-full items-center justify-center gap-1 rounded-xl bg-slate-100 p-1 sm:order-2 sm:w-auto dark:bg-slate-900">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:flex-initial sm:text-sm ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Right Controls */}
        <div className="order-2 flex items-center gap-2 sm:order-3">
          {/* Streak Badge */}
          <div
            title="Current coding focus streak"
            className="hidden items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 md:flex dark:text-amber-400"
          >
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span>{streak}d streak</span>
          </div>

          <button
            type="button"
            onClick={onExportData}
            title="Export workspace backup as JSON"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={onResetDemo}
            title="Reset to sample portfolio data"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Demo Data</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle dark or light mode"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
