import { useState, useEffect } from 'react'

/**
 * Custom hook to sync React state with browser localStorage.
 * Falls back to initialValue if nothing is saved or JSON parsing fails.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const fallback = typeof initialValue === 'function' ? initialValue() : initialValue
    try {
      const saved = window.localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : fallback
    } catch (err) {
      console.warn(`Failed to read "${key}" from localStorage:`, err)
      return fallback
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`Failed to save "${key}" to localStorage:`, err)
    }
  }, [key, value])

  return [value, setValue]
}
