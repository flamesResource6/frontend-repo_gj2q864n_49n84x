import CommandCenter from './components/CommandCenter'
import EmotionPanel from './components/EmotionPanel'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        {/* Phone frame in 9:16 ratio */}
        <div className="w-[360px] md:w-[380px] lg:w-[420px] aspect-[9/16] rounded-[2rem] border border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur overflow-hidden flex flex-col">
          {/* Top bar */}
          <div className="h-10 flex items-center justify-between px-4 text-xs text-slate-300/80 bg-slate-900/50 border-b border-white/5">
            <span>AI Assistant</span>
            <span>9:16</span>
          </div>

          {/* Scrollable content inside the phone */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Personal AI Assistant</h1>
              <p className="text-blue-200 text-xs">Voice + text commands • Phone control • Emotion tracking</p>
            </div>

            {/* Stack panels for phone layout */}
            <div className="space-y-4">
              <CommandCenter />
              <EmotionPanel />
            </div>

            <div className="text-center mt-2">
              <p className="text-[11px] text-blue-300/60">Connect your phone companion app to execute queued actions.</p>
            </div>
          </div>

          {/* Bottom safe area */}
          <div className="h-6 bg-slate-900/50 border-t border-white/5" />
        </div>
      </div>
    </div>
  )
}

export default App
