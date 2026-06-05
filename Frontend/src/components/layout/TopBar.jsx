import { useState } from 'react'
import { format } from 'date-fns'
import { useAuth } from '@/context/AuthContext'
import { useAppContext } from '@/context/AppContext'
import NotifPanel from './NotifPanel'

const ROLE_META = {
  athlete: { label: 'Athlete', color: '#00d4aa' },
  coach: { label: 'Head Coach', color: '#4a9eff' },
  physio: { label: 'Physiotherapist', color: '#a78bfa' },
}

export default function TopBar({ pathname }) {
  const { user } = useAuth()
  const { role, toggleNotif, notifOpen } = useAppContext()

  const [search, setSearch] = useState('')

  const meta = ROLE_META[role]
  const today = format(new Date(), 'EEE, MMM d')

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'

  return (
    <header className="relative h-[60px] flex items-center gap-4 px-5 border-b border-apex-border bg-apex-bg2">
      <h1 className="text-white font-semibold text-lg flex-1">
        Dashboard
      </h1>

      <div className="hidden md:block text-apex-txt2 text-sm">
        {today}
      </div>

      <div className="hidden md:flex items-center bg-apex-bg3 border border-apex-border rounded-xl px-3 py-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search athletes, reports..."
          className="bg-transparent outline-none text-sm"
        />
      </div>

      <button
        onClick={toggleNotif}
        className="relative w-10 h-10 rounded-xl border border-apex-border"
      >
        🔔

        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
          style={{
            background: `${meta.color}20`,
            color: meta.color,
          }}
        >
          {initials}
        </div>

        <div className="hidden md:block">
          <div className="text-sm text-white font-semibold">
            {user?.name}
          </div>

          <div className="text-xs text-apex-txt3">
            {meta.label}
          </div>
        </div>
      </div>

      <NotifPanel />
    </header>
  )
}