import CommandCenter from './components/CommandCenter'
import EmotionPanel from './components/EmotionPanel'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Personal AI Assistant</h1>
            <p className="text-blue-200">Type natural commands to control your phone. Track your emotional state over time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommandCenter />
            <EmotionPanel />
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-blue-300/60">Connect a phone companion app to execute queued actions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
