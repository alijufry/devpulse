import { useState } from 'react'
import { ArrowRight, Plus, Search, Trash2 } from 'lucide-react'
import { toDateKey } from '../utils/dateHelpers'

const STATUSES = ['To Do', 'In Progress', 'Done']
const PRIORITIES = ['High', 'Medium', 'Low']
const TAGS = ['Frontend', 'Backend', 'Bugfix', 'Study', 'Docs']

const PRIORITY_STYLES = {
  High: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
  Medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
  Low: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400',
}

const TAG_STYLES = {
  Frontend: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  Backend: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  Bugfix: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  Study: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Docs: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
}

export function TaskBoard({ tasks, setTasks, fullView = false }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [tag, setTag] = useState('Frontend')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatusFilter, setActiveStatusFilter] = useState('All')

  const handleAddTask = (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    const newTask = {
      id: `task-${Date.now()}`,
      title: trimmed,
      priority,
      tag,
      status: 'To Do',
      createdAt: toDateKey(),
    }

    setTasks((prev) => [newTask, ...prev])
    setTitle('')
  }

  const handleAdvanceStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task
        const currentIndex = STATUSES.indexOf(task.status)
        const nextStatus = STATUSES[(currentIndex + 1) % STATUSES.length]
        return { ...task, status: nextStatus }
      })
    )
  }

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesQuery =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tag.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      fullView || activeStatusFilter === 'All' || task.status === activeStatusFilter
    return matchesQuery && matchesStatus
  })

  const renderTaskCard = (task) => (
    <div
      key={task.id}
      className="group flex flex-col justify-between gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700 dark:hover:bg-slate-950"
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-sm font-medium leading-snug ${
            task.status === 'Done'
              ? 'text-slate-400 line-through dark:text-slate-500'
              : 'text-slate-800 dark:text-slate-100'
          }`}
        >
          {task.title}
        </p>
        <button
          type="button"
          onClick={() => handleDeleteTask(task.id)}
          title="Delete task"
          className="shrink-0 rounded-md p-1 text-slate-400 opacity-70 transition hover:bg-rose-500/10 hover:text-rose-500 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[task.priority]}`}
          >
            {task.priority}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${TAG_STYLES[task.tag]}`}
          >
            {task.tag}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleAdvanceStatus(task.id)}
          title="Click to move to next status"
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:border-emerald-500/40 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-emerald-400"
        >
          <span>{task.status}</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
      {/* Header + Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {fullView ? 'Sprint Kanban Board' : 'Task Queue'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click a task status pill to cycle To Do → In Progress → Done
          </p>
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or tags..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-xs text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a dev task (e.g. Fix CORS header on API)..."
          className="min-w-[200px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Compact Dashboard Mode vs Full 3-Column Kanban */}
      {fullView ? (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {STATUSES.map((status) => {
            const colTasks = filteredTasks.filter((t) => t.status === status)
            return (
              <div
                key={status}
                className="flex flex-col rounded-xl border border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800/80 dark:bg-slate-950/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300">
                    {status}
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {colTasks.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {colTasks.length > 0 ? (
                    colTasks.map(renderTaskCard)
                  ) : (
                    <p className="py-6 text-center text-xs text-slate-400">
                      No tasks in {status}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <>
          {/* Status Filter Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {['All', ...STATUSES].map((status) => {
              const count =
                status === 'All'
                  ? tasks.length
                  : tasks.filter((t) => t.status === status).length
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatusFilter(status)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    activeStatusFilter === status
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {status} ({count})
                </button>
              )
            })}
          </div>

          <div className="mt-3 grid max-h-[340px] grid-cols-1 gap-2.5 overflow-y-auto pr-1 md:grid-cols-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(renderTaskCard)
            ) : (
              <div className="col-span-full py-10 text-center text-xs text-slate-400">
                No matching tasks found. Add one above!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
