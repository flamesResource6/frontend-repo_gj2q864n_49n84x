import { useEffect, useRef, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CommandCenter() {
  const [text, setText] = useState('open instagram')
  const [intent, setIntent] = useState(null)
  const [status, setStatus] = useState('')
  const [history, setHistory] = useState([])
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    fetchHistory()

    // Prepare Web Speech API if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.lang = 'en-US'
      rec.continuous = false
      rec.interimResults = false

      rec.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map(r => r[0]?.transcript)
          .join(' ')
          .trim()
        if (transcript) {
          setText(transcript)
          parse(transcript)
        }
      }

      rec.onend = () => {
        setListening(false)
      }

      recognitionRef.current = rec
    }
  }, [])

  const startListening = () => {
    if (!recognitionRef.current) {
      setStatus('Voice not supported in this browser')
      return
    }
    try {
      setStatus('Listening…')
      setListening(true)
      recognitionRef.current.start()
    } catch (e) {
      setStatus('Mic permission denied or busy')
      setListening(false)
    }
  }

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
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-4">
      <h2 className="text-white text-lg font-semibold mb-3">Voice/Command Control</h2>
      <div className="flex gap-2 mb-2">
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); parse(e.target.value) }}
          placeholder="Try: open camera, turn on wifi, increase volume 20%"
          className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={submit} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl">Send</button>
        <button onClick={startListening} className={`px-3 py-2 rounded-xl border ${listening ? 'border-green-400 text-green-300' : 'border-slate-600 text-slate-300'} hover:border-blue-400 hover:text-blue-200`}>
          {listening ? 'Listening…' : '🎤 Speak'}
        </button>
      </div>
      {status && <p className="text-blue-300 text-xs mb-3">{status}</p>}
      {intent && (
        <div className="text-xs text-blue-200/90 bg-slate-900/50 rounded-xl border border-blue-500/10 p-2 mb-3">
          <span className="font-semibold">Parsed:</span> {intent.type} • target: {intent.target || '—'} • action: {intent.action || '—'} {intent.value != null ? `• value: ${intent.value}` : ''}
        </div>
      )}

      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-medium text-sm">Recent</h3>
          <button onClick={fetchHistory} className="text-[11px] text-blue-300 hover:text-blue-200">Refresh</button>
        </div>
        <div className="space-y-2 max-h-48 overflow-auto pr-1">
          {history.length === 0 && <p className="text-slate-400 text-sm">No interactions yet.</p>}
          {history.map((h) => (
            <div key={h._id} className="bg-slate-900/50 border border-slate-700/60 rounded-lg p-2 text-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/90 truncate max-w-[65%]" title={h.text}>{h.text}</span>
                {h.intent?.type && <span className="text-[10px] text-slate-400">{h.intent.type}</span>}
              </div>
              {h.intent && (
                <div className="text-[10px] text-slate-400 mt-1">target: {h.intent.target || '—'} • action: {h.intent.action || '—'} {h.intent.value != null ? `• value: ${h.intent.value}` : ''}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
