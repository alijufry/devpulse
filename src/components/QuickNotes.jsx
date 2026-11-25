import { Eraser, FileCode2, ListChecks } from 'lucide-react'

export function QuickNotes({ notes, setNotes }) {
  const insertSnippet = (snippet) => {
    setNotes((prev) => (prev ? `${prev}\n${snippet}` : snippet))
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Dev Scratchpad
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quick notes &amp; snippets auto-saved locally
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => insertSnippet('- [ ] ')}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ListChecks className="h-3.5 w-3.5" />
            <span>Checklist</span>
          </button>

          <button
            type="button"
            onClick={() => insertSnippet('```js\n// snippet\n```')}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>Code</span>
          </button>

          <button
            type="button"
            onClick={() => setNotes('')}
            title="Clear notes"
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-rose-500/30 hover:text-rose-500 dark:border-slate-800 dark:text-slate-400"
          >
            <Eraser className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={8}
        placeholder="Jot down debugging ideas, commands, or daily standup notes..."
        className="mt-4 w-full flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs leading-relaxed text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
      />

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <span>Saved to browser localStorage</span>
        <span className="font-mono">{notes.length} chars</span>
      </div>
    </div>
  )
}
