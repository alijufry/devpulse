/**
 * Play a gentle two-tone chime using the browser's built-in Web Audio API.
 * No external MP3 files needed.
 */
export function playCompletionChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return

    const ctx = new AudioCtx()
    const now = ctx.currentTime

    const notes = [523.25, 659.25, 783.99] // C5, E5, G5 chord arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.12)

      gain.gain.setValueAtTime(0.001, now + idx * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.12 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.45)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + idx * 0.12)
      osc.stop(now + idx * 0.12 + 0.5)
    })
  } catch (err) {
    // Ignore audio errors if blocked by browser autoplay rules
    console.warn('Could not play chime:', err)
  }
}
