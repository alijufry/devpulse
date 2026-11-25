/**
 * Convert a Date object into a local YYYY-MM-DD string.
 */
export function toDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format seconds into MM:SS string (e.g. 1500 -> "25:00").
 */
export function formatTimer(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Format a date string (YYYY-MM-DD) into a readable label like "Nov 25, 2026".
 */
export function formatReadableDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Build an array of the last N days (default 84 days = 12 weeks) ending today.
 * Used to render the GitHub-style coding activity heatmap.
 */
export function getRecentDays(daysCount = 84) {
  const days = []
  const today = new Date()

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({
      dateKey: toDateKey(d),
      dayOfWeek: d.getDay(), // 0 = Sun, 6 = Sat
      label: formatReadableDate(toDateKey(d)),
    })
  }

  return days
}

/**
 * Calculate the current consecutive day streak with at least 1 focus minute.
 * If today has 0 minutes yet, still checks starting from yesterday so the streak
 * doesn't vanish before the user starts today's first session.
 */
export function calculateStreak(activityMap) {
  const today = new Date()
  let streak = 0

  const todayKey = toDateKey(today)
  const hasToday = (activityMap[todayKey]?.minutes || 0) > 0

  // Start checking from today if active, otherwise from yesterday
  let offset = hasToday ? 0 : 1

  while (true) {
    const d = new Date(today)
    d.setDate(today.getDate() - offset)
    const key = toDateKey(d)
    const entry = activityMap[key]

    if (entry && entry.minutes > 0) {
      streak += 1
      offset += 1
    } else {
      break
    }
  }

  return streak
}

/**
 * Return the last 7 days (oldest -> today) for the weekly focus bar chart.
 */
export function getLast7DaysChart(activityMap) {
  const today = new Date()
  const result = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = toDateKey(d)
    const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' })
    const entry = activityMap[key] || { minutes: 0, sessions: 0 }

    result.push({
      dateKey: key,
      day: shortDay,
      minutes: entry.minutes,
      sessions: entry.sessions,
      isToday: i === 0,
    })
  }

  return result
}
