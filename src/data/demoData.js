import { toDateKey } from '../utils/dateHelpers'

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Build responsive dashboard grid with Tailwind',
    priority: 'High',
    tag: 'Frontend',
    status: 'Done',
    createdAt: '2026-11-24',
  },
  {
    id: 'task-2',
    title: 'Add JWT refresh token middleware to auth API',
    priority: 'High',
    tag: 'Backend',
    status: 'In Progress',
    createdAt: '2026-11-25',
  },
  {
    id: 'task-3',
    title: 'Fix mobile overflow on activity heatmap',
    priority: 'Medium',
    tag: 'Bugfix',
    status: 'In Progress',
    createdAt: '2026-11-25',
  },
  {
    id: 'task-4',
    title: 'Solve 2 LeetCode medium graph problems',
    priority: 'Medium',
    tag: 'Study',
    status: 'To Do',
    createdAt: '2026-11-25',
  },
  {
    id: 'task-5',
    title: 'Write README documentation and capture screenshots',
    priority: 'Low',
    tag: 'Docs',
    status: 'To Do',
    createdAt: '2026-11-25',
  },
  {
    id: 'task-6',
    title: 'Refactor localStorage hook with error handling',
    priority: 'Low',
    tag: 'Frontend',
    status: 'Done',
    createdAt: '2026-11-23',
  },
]

export const INITIAL_NOTES = `// Today's Dev Log
- [x] Finish UI layout for Pomodoro timer ring
- [ ] Double check dark/light mode contrast on charts
- [ ] Push portfolio project to GitHub with clean README

Quick reminder:
Run \`npm run build\` before deploying to Vercel or Netlify.`

/**
 * Generate realistic 20-week activity data ending today so new users
 * can immediately explore a populated heatmap and weekly chart.
 */
export function createDemoActivity() {
  const activity = {}
  const today = new Date()

  // Deterministic pattern so demo data always looks clean and realistic
  const pattern = [
    25, 50, 0, 75, 50, 100, 25,
    50, 75, 50, 0, 100, 125, 50,
    0, 50, 75, 100, 50, 25, 0,
    75, 100, 50, 75, 125, 50, 25,
    50, 25, 0, 75, 100, 75, 50,
    100, 75, 50, 125, 50, 0, 25,
    50, 100, 75, 50, 100, 75, 50,
    0, 75, 100, 50, 75, 125, 50,
    50, 75, 100, 25, 50, 75, 0,
    75, 100, 125, 50, 75, 50, 25,
    50, 75, 100, 75, 125, 50, 75,
    50, 75, 100, 50, 125, 75, 100,
    25, 50, 75, 100, 50, 25, 0,
    75, 50, 100, 125, 75, 50, 25,
    0, 50, 75, 50, 100, 75, 50,
    25, 75, 100, 50, 75, 125, 50,
    50, 100, 75, 25, 50, 75, 0,
    75, 100, 125, 50, 75, 100, 50,
    50, 75, 100, 75, 125, 50, 75,
    50, 75, 100, 50, 125, 75, 100,
  ]

  for (let i = 139; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = toDateKey(d)
    const minutes = pattern[139 - i] ?? 50
    if (minutes > 0) {
      activity[key] = {
        minutes,
        sessions: Math.max(1, Math.round(minutes / 25)),
      }
    }
  }

  return activity
}
