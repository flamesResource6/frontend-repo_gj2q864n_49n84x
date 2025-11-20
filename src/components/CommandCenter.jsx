import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CommandCenter() {
  const [text, setText] = useState('open instagram')
  const [intent, setIntent] = useState(null)
  const [status, setStatus] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const parse = async (t) => {
    try {
      const res = await fetch(`${API}/api/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: t })
      })
      const data = await res.json()
      setIntent(data)
    } catch (e) {
      console.error(e)
    }
  }

  const submit = async () => {
    setStatus('Sending...')
    try {
      const res = await fetch(`${API}/api/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', text, intent })
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('Queued for device')
      setText('')
      setIntent(null)
      fetchHistory()
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API}/api/interactions?limit=20`)
      const data = await res.json()
      setHistory(data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
      <h2 className="text-white text-xl font-semibold mb-4">Voice/Command Control</h2>
      <div className="flex gap-3 mb-3">
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); parse(e.target.value) }}
          placeholder="Try: open camera, turn on wifi, increase volume 20%"
          className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={submit} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl">Send</button>
      </div>
      {status && <p className="text-blue-300 text-sm mb-4">{status}</p>}
      {intent && (
        <div className="text-sm text-blue-200/90 bg-slate-900/50 rounded-xl border border-blue-500/10 p-3 mb-4">
          <span className="font-semibold">Parsed:</span> {intent.type} • target: {intent.target || '—'} • action: {intent.action || '—'} {intent.value != null ? `• value: ${intent.value}` : ''}
        </div>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium">Recent</h3>
          <button onClick={fetchHistory} className="text-xs text-blue-300 hover:text-blue-200">Refresh</button>
        </div>
        <div className="space-y-2 max-h-60 overflow-auto pr-1">
          {history.length === 0 && <p className="text-slate-400 text-sm">No interactions yet.</p>}
          {history.map((h) => (
            <div key={h._id} className="bg-slate-900/50 border border-slate-700/60 rounded-lg p-3 text-slate-200 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/90">{h.text}</span>
                {h.intent?.type && <span className="text-xs text-slate-400">{h.intent.type}</span>}
              </div>
              {h.intent && (
                <div className="text-xs text-slate-400 mt-1">target: {h.intent.target || '—'} • action: {h.intent.action || '—'} {h.intent.value != null ? `• value: ${h.intent.value}` : ''}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
