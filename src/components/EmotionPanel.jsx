import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function EmotionPanel() {
  const [mood, setMood] = useState('neutral')
  const [arousal, setArousal] = useState(5)
  const [notes, setNotes] = useState('')
  const [latest, setLatest] = useState(null)
  const [status, setStatus] = useState('')

  const save = async () => {
    setStatus('Saving...')
    try {
      const res = await fetch(`${API}/api/emotions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, arousal, notes })
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('Saved!')
      loadLatest()
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    }
  }

  const loadLatest = async () => {
    try {
      const res = await fetch(`${API}/api/emotions/latest`)
      const data = await res.json()
      setLatest(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { loadLatest() }, [])

  return (
    <div className="bg-slate-800/60 border border-pink-500/20 rounded-2xl p-6">
      <h2 className="text-white text-xl font-semibold mb-4">Emotional State</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <select value={mood} onChange={(e)=>setMood(e.target.value)} className="bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white">
          {['happy','neutral','sad','stressed','calm','excited','tired'].map(m=> <option key={m} value={m}>{m}</option>)}
        </select>
        <input type="range" min="1" max="10" value={arousal} onChange={(e)=>setArousal(parseInt(e.target.value))} className="w-full"/>
        <span className="text-blue-200/90 self-center">Energy: {arousal}/10</span>
      </div>
      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes..." className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white mb-3" />
      <button onClick={save} className="bg-pink-600 hover:bg-pink-500 text-white px-5 py-3 rounded-xl">Save</button>

      {status && <p className="text-pink-300 text-sm mt-3">{status}</p>}

      {latest && (
        <div className="mt-4 text-sm text-pink-200/90 bg-slate-900/50 rounded-xl border border-pink-500/10 p-3">
          <div><span className="font-semibold">Latest:</span> mood {latest.mood}, energy {latest.arousal}/10</div>
          {latest.notes && <div className="text-xs text-slate-300 mt-1">{latest.notes}</div>}
        </div>
      )}
    </div>
  )
}
