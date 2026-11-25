import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Navbar } from './components/Navbar'
import { StatsRow } from './components/StatsRow'
import { FocusTimer } from './components/FocusTimer'
import { TaskBoard } from './components/TaskBoard'
import { ActivityHeatmap } from './components/ActivityHeatmap'
import { WeeklyChart } from './components/WeeklyChart'
import { QuickNotes } from './components/QuickNotes'
import { useLocalStorage } from './hooks/useLocalStorage'
import { createDemoActivity, INITIAL_NOTES, INITIAL_TASKS } from './data/demoData'
import { calculateStreak, toDateKey } from './utils/dateHelpers'

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const param = new URLSearchParams(window.location.search).get('tab')
    return ['overview', 'tasks', 'analytics'].includes(param) ? param : 'overview'
  })
  const [theme, setTheme] = useLocalStorage('devpulse_theme', () => {
    const paramTheme = new URLSearchParams(window.location.search).get('theme')
    return paramTheme === 'light' || paramTheme === 'dark' ? paramTheme : 'dark'
  })
  const [tasks, setTasks] = useLocalStorage('devpulse_tasks', INITIAL_TASKS)
  const [notes, setNotes] = useLocalStorage('devpulse_notes', INITIAL_NOTES)
  const [activityMap, setActivityMap] = useLocalStorage('devpulse_activity', () =>
    createDemoActivity()
  )
  const [toastMessage, setToastMessage] = useState('')

  // Allow ?theme=light|dark URL query param on initial load without locking the toggle button
  useEffect(() => {
    const paramTheme = new URLSearchParams(window.location.search).get('theme')
    if (paramTheme === 'light' || paramTheme === 'dark') {
      setTheme(paramTheme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Auto-hide toast notifications after 3 seconds
  useEffect(() => {
    if (!toastMessage) return
    const timer = window.setTimeout(() => setToastMessage(''), 3000)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const todayKey = toDateKey()
  const todayMinutes = activityMap[todayKey]?.minutes || 0

  const streak = useMemo(() => calculateStreak(activityMap), [activityMap])

  const totalSessions = useMemo(
    () =>
      Object.values(activityMap).reduce((sum, entry) => sum + (entry.sessions || 0), 0),
    [activityMap]
  )

  const completedTasks = tasks.filter((t) => t.status === 'Done').length

  const handleCompleteFocusSession = (minutes) => {
    const key = toDateKey()
    setActivityMap((prev) => {
      const current = prev[key] || { minutes: 0, sessions: 0 }
      return {
        ...prev,
        [key]: {
          minutes: current.minutes + minutes,
          sessions: current.sessions + 1,
        },
      }
    })
    setToastMessage(`Logged +${minutes} min focus session!`)
  }

  const handleResetDemo = () => {
    setTasks(INITIAL_TASKS)
    setNotes(INITIAL_NOTES)
    setActivityMap(createDemoActivity())
    setToastMessage('Restored sample portfolio data')
  }

  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      tasks,
      notes,
      activityMap,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `devpulse-backup-${toDateKey()}.json`
    link.click()
    URL.revokeObjectURL(url)
    setToastMessage('Exported workspace backup (JSON)')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        streak={streak}
        onResetDemo={handleResetDemo}
        onExportData={handleExportData}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* Top Metrics */}
        <StatsRow
          todayMinutes={todayMinutes}
          completedTasks={completedTasks}
          totalTasks={tasks.length}
          streak={streak}
          totalSessions={totalSessions}
        />

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <FocusTimer
                  tasks={tasks}
                  onCompleteFocusSession={handleCompleteFocusSession}
                />
              </div>
              <div className="lg:col-span-8">
                <TaskBoard tasks={tasks} setTasks={setTasks} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <ActivityHeatmap activityMap={activityMap} />
                <WeeklyChart activityMap={activityMap} />
              </div>
              <div className="lg:col-span-5">
                <QuickNotes notes={notes} setNotes={setNotes} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'tasks' && (
          <TaskBoard tasks={tasks} setTasks={setTasks} fullView />
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ActivityHeatmap activityMap={activityMap} />
            <WeeklyChart activityMap={activityMap} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-slate-400 sm:px-6">
        Built with React, Vite &amp; Tailwind CSS • All data stays locally in your browser
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg dark:bg-slate-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
