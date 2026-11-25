import { useEffect, useState } from 'react'
import { Check, Minus, Pause, Play, Plus, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { formatTimer } from '../utils/dateHelpers'
import { playCompletionChime } from '../utils/sound'

const TIMER_MODES = {
  focus: { label: 'Focus', defaultMinutes: 25, color: '#10b981', badge: 'Deep Work' },
  shortBreak: { label: 'Short Break', defaultMinutes: 5, color: '#0ea5e9', badge: 'Recharge' },
  longBreak: { label: 'Long Break', defaultMinutes: 15, color: '#8b5cf6', badge: 'Rest' },
}

export function FocusTimer({ tasks, onCompleteFocusSession }) {
  const [mode, setMode] = useState('focus')
  const [durations, setDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  })
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedTaskId, setSelectedTaskId] = useState('')

  const totalSeconds = durations[mode] * 60
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0

  // SVG circle geometry
  const radius = 84
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  const activeTasks = tasks.filter((t) => t.status !== 'Done')

  useEffect(() => {
    if (!isRunning) return

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId)
          setIsRunning(false)

          if (soundEnabled) {
            playCompletionChime()
          }

          if (mode === 'focus') {
            onCompleteFocusSession(durations.focus)
          }

          return durations[mode] * 60
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [isRunning, mode, durations, soundEnabled, onCompleteFocusSession])

  // Update browser tab title while timer is running
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTimer(secondsLeft)} • ${TIMER_MODES[mode].label} — DevPulse`
    } else {
      document.title = 'DevPulse — Developer Focus & Productivity Workspace'
    }
  }, [isRunning, secondsLeft, mode])

  const handleModeChange = (nextMode) => {
    setIsRunning(false)
    setMode(nextMode)
    setSecondsLeft(durations[nextMode] * 60)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSecondsLeft(durations[mode] * 60)
  }

  const adjustDuration = (delta) => {
    if (isRunning) return
    const nextMins = Math.min(90, Math.max(5, durations[mode] + delta))
    setDurations((prev) => ({ ...prev, [mode]: nextMins }))
    setSecondsLeft(nextMins * 60)
  }

  const handleQuickLog = () => {
    // Let users log the current focus duration manually (helpful when testing or wrapping up early)
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60))
    const minutesToLog = elapsedMinutes >= 5 ? elapsedMinutes : durations.focus
    setIsRunning(false)
    if (soundEnabled) playCompletionChime()
    onCompleteFocusSession(minutesToLog)
    setSecondsLeft(durations[mode] * 60)
  }

  const currentMode = TIMER_MODES[mode]

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Focus Timer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stay in flow with Pomodoro sprints
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSoundEnabled((s) => !s)}
          title={soundEnabled ? 'Mute completion chime' : 'Unmute completion chime'}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-950/70">
        {Object.entries(TIMER_MODES).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleModeChange(key)}
            className={`rounded-lg px-2 py-1.5 text-xs font-medium transition ${
              mode === key
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Circular SVG Ring */}
      <div className="relative my-5 flex items-center justify-center">
        <svg className="h-52 w-52 -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={currentMode.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center text-center">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {currentMode.badge}
          </span>
          <span className="mt-2 font-mono text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatTimer(secondsLeft)}
          </span>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              disabled={isRunning}
              onClick={() => adjustDuration(-5)}
              title="Decrease by 5 minutes"
              className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-[11px] text-slate-400">{durations[mode]} min</span>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => adjustDuration(5)}
              title="Increase by 5 minutes"
              className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Task Selector */}
      <div className="mb-4">
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Working on
        </label>
        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="">General coding / deep focus</option>
          {activeTasks.map((task) => (
            <option key={task.id} value={task.id}>
              [{task.tag}] {task.title}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsRunning((r) => !r)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-[0.99]"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Start Focus</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          title="Reset timer"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {mode === 'focus' && (
          <button
            type="button"
            onClick={handleQuickLog}
            title="Log focus session now"
            className="flex h-10 items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500/20 dark:text-emerald-400"
          >
            <Check className="h-4 w-4" />
            <span>Log</span>
          </button>
        )}
      </div>
    </div>
  )
}
